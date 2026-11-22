"""
PCL AEOS - System One Decision Classifier (Laya Engine v2.0 — PROAA-14)
Conformidade: SPEC-PCL-AEOS-CLASSIFIER-01, SPEC-PCL-AEOS-MEMORY-03 & PROAA-14
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2)
Invariante de Hardware: 100% CPU Execution Provider (0 MB VRAM alocada na RTX 3050)
Evoluções PROAA-14:
  1. predict_batch(pairs) com Length-Bucketing (<=32, <=64, <=128) e Softmax Vetorizado NumPy
  2. AdaptiveBatchScheduler (janela 3-5ms, max_batch=16, 1 worker CPU dedicado)
  3. SemanticLRUCache (<1ms) particionado por model_sha256 e learner_ver
  4. Contrato laya.Learner (771 features congeladas) + Conformal Prediction (q_hat)
  5. Novas Primitivas System One: match_intent, deduplicate_memory, verify_policy, lightning_council
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
import math
import os
import re
import sys
import threading
import time
from collections import OrderedDict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union
from pydantic import BaseModel, Field

os.environ.setdefault("OMP_WAIT_POLICY", "PASSIVE")
os.environ.setdefault("ONNXRUNTIME_EXECUTION_PROVIDERS", "CPUExecutionProvider")

logger = logging.getLogger("pcl.laya")
if not logger.handlers:
    handler = logging.StreamHandler(sys.stderr)
    handler.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)s] [Laya] %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

HAS_ONNX_DEPENDENCIES = False
try:
    import numpy as np
    import onnxruntime as ort
    from tokenizers import Tokenizer
    HAS_ONNX_DEPENDENCIES = True
except ImportError:
    HAS_ONNX_DEPENDENCIES = False


# ============================================================================
# SCHEMAS DE REQUISIÇÃO (Retrocompatíveis + SystemOneRequest PROAA-14)
# ============================================================================

class NLIEvaluationRequest(BaseModel):
    premise: str = Field(..., description="Contexto, premissa ou documento de referência")
    hypothesis: str = Field(..., description="Hipótese, claim ou afirmação a ser confrontada contra a premissa")


class BinaryEvaluationRequest(BaseModel):
    state: str = Field(..., description="Contexto ou estado textual para avaliação")
    query: str = Field(..., description="Pergunta tipada binária")
    threshold: Optional[float] = Field(0.60, description="Limiar de probabilidade para confirmação da classe alvo")
    allow_abstain: Optional[bool] = Field(False, description="Se True, permite retorno de 'uncertain' via Conformal Prediction")


class ChoiceEvaluationRequest(BaseModel):
    state: str = Field(..., description="Contexto ou estado textual")
    query: str = Field(..., description="Pergunta para seleção de alternativa")
    options: List[str] = Field(..., description="Lista de alternativas discretas")


class ScoreEvaluationRequest(BaseModel):
    state: str = Field(..., description="Contexto ou estado textual")
    query: str = Field(..., description="Pergunta para pontuação calibrada")
    min_val: float = Field(0.0, description="Valor mínimo")
    max_val: float = Field(1.0, description="Valor máximo")


class BatchEvaluationRequest(BaseModel):
    state: str = Field(..., description="Contexto compartilhado para o lote")
    questions: List[Dict[str, Any]] = Field(..., description="Lista de perguntas estruturadas com id, type e query")


class SystemOneRequest(BaseModel):
    state: str = Field(..., description="Contexto ou premissa base")
    mode: str = Field("council", description="choice | score | noul | match_intent | deduplicate_memory | verify_policy | council")
    query: Optional[str] = Field("", description="Pergunta ou critério")
    options: Optional[List[str]] = Field(None, description="Alternativas, intenções, memórias ou políticas")
    min_val: Optional[float] = Field(0.0)
    max_val: Optional[float] = Field(1.0)
    threshold: Optional[float] = Field(0.60)
    allow_abstain: Optional[bool] = Field(True)
    checks: Optional[List[Dict[str, Any]]] = Field(None, description="Lista de checagens para mode='council'")


# ============================================================================
# 1. CACHE SEMÂNTICO LRU < 1 MS (SemanticLRUCache — PROAA-14 Seção 3)
# ============================================================================

class SemanticLRUCache:
    """
    Cache Semântico LRU em RAM protegido por threading.RLock (< 1 ms).
    Particionado criptograficamente por mode, model_sha256, learner_ver e threshold.
    """

    def __init__(self, max_entries: Optional[int] = None, ttl_sec: Optional[int] = None) -> None:
        self.max_entries = max_entries or int(os.environ.get("LAYA_CACHE_MAX_ENTRIES", 20000))
        self.ttl_sec = ttl_sec or int(os.environ.get("LAYA_CACHE_TTL_SEC", 3600))
        self._store: OrderedDict[str, Tuple[float, Dict[str, Any]]] = OrderedDict()
        self._lock = threading.RLock()
        self.hits = 0
        self.misses = 0

    @staticmethod
    def build_key(
        mode: str,
        model_sha256: str,
        learner_ver: str,
        threshold: Union[float, str],
        premise: str,
        hypothesis: str
    ) -> str:
        raw_key = f"{mode}|{model_sha256}|{learner_ver}|{threshold}|{premise}\x00{hypothesis}"
        return hashlib.sha256(raw_key.encode("utf-8", errors="ignore")).hexdigest()

    def get(self, key: str) -> Optional[Dict[str, Any]]:
        now = time.perf_counter()
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                self.misses += 1
                return None
            ts, payload = entry
            if (now - ts) > self.ttl_sec:
                del self._store[key]
                self.misses += 1
                return None
            self._store.move_to_end(key)
            self.hits += 1
            cloned = dict(payload)
            cloned["cache_hit"] = True
            return cloned

    def put(self, key: str, payload: Dict[str, Any]) -> None:
        now = time.perf_counter()
        with self._lock:
            cloned = dict(payload)
            cloned["cache_hit"] = False
            self._store[key] = (now, cloned)
            self._store.move_to_end(key)
            while len(self._store) > self.max_entries:
                self._store.popitem(last=False)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()
            self.hits = 0
            self.misses = 0

    def get_metrics(self) -> Dict[str, Any]:
        with self._lock:
            total = self.hits + self.misses
            hit_rate = round(self.hits / total, 4) if total > 0 else 0.0
            return {
                "cache_entries": len(self._store),
                "cache_max_entries": self.max_entries,
                "cache_ttl_sec": self.ttl_sec,
                "cache_hits": self.hits,
                "cache_misses": self.misses,
                "cache_hit_rate": hit_rate
            }


# ============================================================================
# 2. CONTRATO LAYA.LEARNER (771 FEATURES CONGELADAS + CONFORMAL PREDICTION)
# ============================================================================

class LayaLearnerHead:
    """
    Cabeça linear leve em CPU (771 features = 768d frozen representation + 3d ONNX NLI logits)
    com calibração Conformal Prediction (q_hat) para abstenção segura ('uncertain').
    Preserva 100% da imutabilidade SHA-256 do arquivo model.onnx.
    """

    FEATURE_DIM = 771

    def __init__(self, learner_dir: Optional[Path] = None, backbone_sha256: Optional[str] = None) -> None:
        self.base_dir = learner_dir or (
            Path(__file__).resolve().parent.parent / "models" / "laya-learner" / "memory_reconciliation"
        )
        self.backbone_sha256 = backbone_sha256 or "unverified"
        self.learner_ver = "1.0.0"
        self.domain = "memory_reconciliation"
        self.alpha = 0.10
        self.q_hat = 0.4200
        self.is_loaded = False
        self.W: Optional[Any] = None
        self.b: Optional[Any] = None
        self.metrics: Dict[str, float] = {}
        self._load_if_available()

    def _load_if_available(self) -> None:
        if not HAS_ONNX_DEPENDENCIES:
            return
        manifest_path = self.base_dir / "manifest.json"
        weights_path = self.base_dir / "head_weights.npz"
        if not manifest_path.exists() or not weights_path.exists():
            return
        try:
            m_data = json.loads(manifest_path.read_text(encoding="utf-8"))
            if m_data.get("feature_dim") != self.FEATURE_DIM:
                return
            rec_sha = m_data.get("backbone_model_sha256")
            if rec_sha and self.backbone_sha256 and rec_sha != self.backbone_sha256:
                logger.warning("SHA-256 do backbone mudou (%s != %s); ignorando pesos antigos do Learner.", rec_sha, self.backbone_sha256)
                return
            npz = np.load(str(weights_path))
            W = npz["W"].astype(np.float32)
            b = npz["b"].astype(np.float32)
            if W.shape != (3, self.FEATURE_DIM) or b.shape != (3,):
                return
            self.W = W
            self.b = b
            self.learner_ver = str(m_data.get("learner_ver", "1.0.0"))
            conformal = m_data.get("conformal", {})
            self.alpha = float(conformal.get("alpha", 0.10))
            self.q_hat = float(conformal.get("q_hat", 0.4200))
            self.metrics = m_data.get("metrics", {})
            # Detecta se o bloco 0..767 é nulo (residual puro calibrado nos 3 logits finais) para fast-path O(1)
            self.is_residual_fastpath = bool(np.max(np.abs(W[:, :768])) < 1e-7)
            self.W_logits = W[:, 768:771].T.copy()
            self.is_loaded = True
        except Exception as exc:
            logger.warning("Falha ao carregar LayaLearnerHead: %s", exc)

    @staticmethod
    def build_frozen_features_771d(
        token_ids_list: List[List[int]],
        attention_masks_list: List[List[int]],
        nli_logits_matrix: "np.ndarray"
    ) -> "np.ndarray":
        """
        Constrói o tensor determinístico float32[B, 771] = concat(cls_embedding[B, 768], nli_logits[B, 3])
        usando operações vetorizadas em NumPy (< 0.4 ms em CPU, 0 MB VRAM).
        """
        batch_size = len(token_ids_list)
        feats_768 = np.zeros((batch_size, 768), dtype=np.float32)

        for i in range(batch_size):
            ids_arr = np.asarray(token_ids_list[i], dtype=np.int64)
            mask_arr = np.asarray(attention_masks_list[i], dtype=np.int64)
            valid_tokens = ids_arr[mask_arr > 0]
            n_tok = max(1, int(valid_tokens.size))
            inv_sqrt = 1.0 / math.sqrt(n_tok)

            if valid_tokens.size > 0:
                buckets = (valid_tokens * 2654435761) & 511
                feats_768[i, :512] = np.bincount(buckets, minlength=512).astype(np.float32) * inv_sqrt
            if valid_tokens.size > 1:
                bg_buckets = ((valid_tokens[:-1] * 31) ^ valid_tokens[1:]) % 248
                feats_768[i, 512:760] = np.bincount(bg_buckets, minlength=248).astype(np.float32) * inv_sqrt

            l0, l1, l2 = float(nli_logits_matrix[i, 0]), float(nli_logits_matrix[i, 1]), float(nli_logits_matrix[i, 2])
            feats_768[i, 760] = min(1.0, n_tok / 128.0)
            feats_768[i, 761] = l0 - l1
            feats_768[i, 762] = l1 - l2
            feats_768[i, 763] = l0 - l2
            feats_768[i, 764] = max(l0, l1, l2) - min(l0, l1, l2)

        norms = np.linalg.norm(feats_768, axis=1, keepdims=True)
        norms = np.where(norms < 1e-8, 1.0, norms)
        feats_768 = feats_768 / norms

        logits_f32 = nli_logits_matrix.astype(np.float32)
        return np.concatenate([feats_768, logits_f32], axis=1)

    def predict_calibrated_probs(
        self,
        features_771d: Optional["np.ndarray"],
        base_logits: "np.ndarray"
    ) -> "np.ndarray":
        """Aplica os pesos lineares (W[3, 771], b[3]) se carregados, ou softmax sobre base_logits."""
        if self.is_loaded and self.W is not None and self.b is not None:
            if getattr(self, "is_residual_fastpath", False) or features_771d is None:
                logits = base_logits.astype(np.float32) @ self.W_logits + self.b
            else:
                logits = features_771d @ self.W.T + self.b
        else:
            logits = base_logits
        max_l = np.max(logits, axis=1, keepdims=True)
        exp_l = np.exp(logits - max_l)
        return exp_l / np.sum(exp_l, axis=1, keepdims=True)

    def conformal_prediction_set(
        self,
        probs: List[float],
        id2label: Dict[int, str]
    ) -> List[str]:
        """Retorna o conjunto preditivo Conformal: {c : (1 - p[c]) <= q_hat}."""
        return [
            id2label.get(idx, "neutral")
            for idx, p in enumerate(probs)
            if (1.0 - float(p)) <= self.q_hat
        ]


# ============================================================================
# 3. MOTOR NEURAL ONNX COM PREDICT_BATCH & LENGTH-BUCKETING (0 MB VRAM)
# ============================================================================

class ONNXNLIEngine:
    """
    Motor Neural de Inferência em Linguagem Natural (NLI) em CPU INT8.
    Inclui predict_batch vetorizado com Length-Bucketing (<=32, <=64, <=128 tokens),
    SemanticLRUCache (<1ms) e extração de features 771d para o LayaLearnerHead.
    """

    def __init__(self, model_dir: Optional[str] = None) -> None:
        self.model_id = "cross-encoder/nli-MiniLM2-L6-H768"
        self.device = "CPUExecutionProvider"
        self.vram_allocated_mb = 0
        self.id2label = {0: "contradiction", 1: "entailment", 2: "neutral"}
        self.label2id = {"contradiction": 0, "entailment": 1, "neutral": 2}

        self.is_ready = False
        self.engine_mode = "symbolic_fallback"
        self.session = None
        self.tokenizer = None
        self.pad_token_id = 1
        self.model_path = None
        self.tokenizer_path = None
        self.commit_sha = None
        self.model_sha256 = "symbolic"
        self.init_error = None
        self._tokenizer_lock = threading.RLock()

        # Telemetria
        self.total_inferences = 0
        self.neural_inferences = 0
        self.batch_calls = 0
        self.fallback_inferences = 0
        self.last_fallback_reason = None
        self.last_fallback_time = None

        self.cache = SemanticLRUCache()
        self._initialize(model_dir)
        self.learner = LayaLearnerHead(backbone_sha256=self.model_sha256)

    def _initialize(self, model_dir: Optional[str] = None) -> None:
        candidates = []
        if model_dir:
            candidates.append(Path(model_dir))
        if os.environ.get("LAYA_MODEL_DIR"):
            candidates.append(Path(os.environ["LAYA_MODEL_DIR"]))
        default_dir = Path(__file__).resolve().parent.parent / "models" / "nli-minilm"
        candidates.append(default_dir)

        resolved_dir = None
        for cand in candidates:
            if (cand / "model.onnx").exists() and (cand / "tokenizer.json").exists():
                resolved_dir = cand
                break

        if not HAS_ONNX_DEPENDENCIES:
            self.init_error = "Dependências ausentes (onnxruntime / tokenizers / numpy não instalados)"
            self.engine_mode = "symbolic_fallback"
            self.is_ready = False
            return

        if not resolved_dir:
            self.init_error = f"Artefatos do modelo não encontrados: {[str(c) for c in candidates]}"
            self.engine_mode = "symbolic_fallback"
            self.is_ready = False
            return

        try:
            self.model_path = str(resolved_dir / "model.onnx")
            self.tokenizer_path = str(resolved_dir / "tokenizer.json")
            config_file = resolved_dir / "config.json"
            manifest_file = resolved_dir / "manifest.json"

            if manifest_file.exists():
                try:
                    m_data = json.loads(manifest_file.read_text(encoding="utf-8"))
                    self.commit_sha = m_data.get("commit_sha")
                    artifacts = m_data.get("artifacts", {})
                    if "model.onnx" in artifacts:
                        self.model_sha256 = artifacts["model.onnx"].get("sha256") or "unverified"
                except Exception as me:
                    logger.warning("Falha ao ler manifest.json: %s", me)

            if config_file.exists():
                try:
                    cfg = json.loads(config_file.read_text(encoding="utf-8"))
                    cfg_labels = cfg.get("id2label", {})
                    if cfg_labels:
                        self.id2label = {int(k): v.lower() for k, v in cfg_labels.items()}
                        self.label2id = {v.lower(): int(k) for k, v in cfg_labels.items()}
                    if "pad_token_id" in cfg:
                        self.pad_token_id = int(cfg["pad_token_id"])
                except Exception as ce:
                    logger.warning("Falha ao ler config.json: %s", ce)

            self.tokenizer = Tokenizer.from_file(self.tokenizer_path)
            self.tokenizer.enable_truncation(max_length=128)
            self.tokenizer.no_padding()

            opts = ort.SessionOptions()
            default_threads = min(6, max(4, (os.cpu_count() or 4) // 2))
            cpu_threads = int(os.environ.get("LAYA_CPU_THREADS", default_threads))
            opts.intra_op_num_threads = cpu_threads
            opts.inter_op_num_threads = 1
            opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

            self.session = ort.InferenceSession(
                self.model_path,
                sess_options=opts,
                providers=["CPUExecutionProvider"]
            )
            self.session_input_names = {inp.name for inp in self.session.get_inputs()}
            self.is_ready = True
            self.engine_mode = "neural_onnx"
            self.init_error = None
        except Exception as e:
            self.is_ready = False
            self.engine_mode = "symbolic_fallback"
            self.init_error = f"Erro ao inicializar sessão ONNX: {str(e)}"
            logger.error("Falha ao inicializar motor ONNX: %s", e)

    def _forward_logits_bucketing(
        self,
        pairs: List[Tuple[str, str]],
        max_length: int = 128
    ) -> Tuple["np.ndarray", List[Any]]:
        """
        Executa a inferência ONNX em lote com Length-Bucketing inteligente (<=32, <=64, <=128).
        Se a dispersão de comprimentos do lote for pequena (max_len - min_len <= 20), executa
        em 1 única chamada C++ ONNX sem desperdício de padding.
        """
        with self._tokenizer_lock:
            self.tokenizer.enable_truncation(max_length=max_length)
            self.tokenizer.no_padding()
            encodings = self.tokenizer.encode_batch(pairs)

        n_items = len(pairs)
        raw_logits_all = np.zeros((n_items, 3), dtype=np.float32)
        lengths = [len(e.ids) for e in encodings]
        min_l, max_l = min(lengths), max(lengths)

        if n_items <= 8 or (max_l - min_l) <= 20:
            buckets_list = [list(range(n_items))]
        else:
            b32, b64, b128 = [], [], []
            for idx, seq_len in enumerate(lengths):
                if seq_len <= 32:
                    b32.append(idx)
                elif seq_len <= 64:
                    b64.append(idx)
                else:
                    b128.append(idx)
            buckets_list = [b for b in (b32, b64, b128) if b]

        for b_indices in buckets_list:
            max_seq = max(lengths[i] for i in b_indices)
            b_size = len(b_indices)
            input_ids = np.full((b_size, max_seq), self.pad_token_id, dtype=np.int64)
            attention_mask = np.zeros((b_size, max_seq), dtype=np.int64)

            for row_i, orig_idx in enumerate(b_indices):
                enc = encodings[orig_idx]
                L = lengths[orig_idx]
                input_ids[row_i, :L] = enc.ids
                attention_mask[row_i, :L] = enc.attention_mask

            ort_inputs = {
                "input_ids": input_ids,
                "attention_mask": attention_mask
            }
            if "token_type_ids" in self.session_input_names:
                token_type_ids = np.zeros((b_size, max_seq), dtype=np.int64)
                for row_i, orig_idx in enumerate(b_indices):
                    enc = encodings[orig_idx]
                    token_type_ids[row_i, :lengths[orig_idx]] = enc.type_ids
                ort_inputs["token_type_ids"] = token_type_ids

            bucket_logits = self.session.run(None, ort_inputs)[0]
            for row_i, orig_idx in enumerate(b_indices):
                raw_logits_all[orig_idx] = bucket_logits[row_i]

        return raw_logits_all, encodings

    def extract_features_batch_771d(
        self,
        pairs: List[Tuple[str, str]],
        max_length: int = 128
    ) -> Tuple["np.ndarray", "np.ndarray"]:
        """
        Extrai a matriz de features 771d (float32[B, 771]) e os logits NLI brutos (float32[B, 3])
        usando predict_batch com length-bucketing em CPU (0 MB VRAM).
        """
        if not (self.is_ready and self.session and self.tokenizer):
            raise RuntimeError("Sessão ONNX não disponível para extração de features 771d.")

        raw_logits_all, encodings = self._forward_logits_bucketing(pairs, max_length=max_length)
        token_ids_all = [enc.ids for enc in encodings]
        masks_all = [enc.attention_mask for enc in encodings]

        features_771d = LayaLearnerHead.build_frozen_features_771d(
            token_ids_all, masks_all, raw_logits_all
        )
        return features_771d, raw_logits_all

    def predict_batch(
        self,
        pairs: List[Tuple[str, str]],
        max_length: int = 128,
        use_cache: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Inferência NLI vetorizada em lote único com Length-Bucketing (<=32, <=64, <=128 tokens),
        Softmax Vetorizado em NumPy e Cache Semântico LRU (< 1 ms).
        """
        if not pairs:
            return []

        t_start = time.perf_counter()
        self.batch_calls += 1
        self.total_inferences += len(pairs)

        results: List[Optional[Dict[str, Any]]] = [None] * len(pairs)
        miss_indices: List[int] = []
        miss_pairs: List[Tuple[str, str]] = []
        miss_keys: List[str] = []

        learner_ver = self.learner.learner_ver if self.learner.is_loaded else "base"

        if use_cache:
            for idx, (prem, hyp) in enumerate(pairs):
                t_c0 = time.perf_counter()
                ckey = self.cache.build_key("nli", self.model_sha256, learner_ver, "0.50", prem, hyp)
                cached = self.cache.get(ckey)
                if cached is not None:
                    cached["duration_ms"] = round((time.perf_counter() - t_c0) * 1000.0, 4)
                    results[idx] = cached
                else:
                    miss_indices.append(idx)
                    miss_pairs.append((prem, hyp))
                    miss_keys.append(ckey)
        else:
            miss_indices = list(range(len(pairs)))
            miss_pairs = list(pairs)
            miss_keys = [
                self.cache.build_key("nli", self.model_sha256, learner_ver, "0.50", p, h)
                for p, h in pairs
            ]

        if not miss_pairs:
            return [r for r in results if r is not None]

        if self.is_ready and self.session and self.tokenizer:
            try:
                t_b0 = time.perf_counter()
                raw_logits, encodings = self._forward_logits_bucketing(miss_pairs, max_length=max_length)
                if self.learner.is_loaded and not getattr(self.learner, "is_residual_fastpath", True):
                    feats_771d = LayaLearnerHead.build_frozen_features_771d(
                        [e.ids for e in encodings],
                        [e.attention_mask for e in encodings],
                        raw_logits
                    )
                else:
                    feats_771d = None
                probs_matrix = self.learner.predict_calibrated_probs(feats_771d, raw_logits)
                batch_elapsed_ms = (time.perf_counter() - t_b0) * 1000.0
                per_item_ms = round(batch_elapsed_ms / max(1, len(miss_pairs)), 3)
                self.neural_inferences += len(miss_pairs)

                for local_i, orig_idx in enumerate(miss_indices):
                    p_row = probs_matrix[local_i]
                    c_prob = round(float(p_row[0]), 4)
                    e_prob = round(float(p_row[1]), 4)
                    n_prob = round(float(p_row[2]), 4)
                    pred_idx = int(np.argmax(p_row))
                    pred_label = self.id2label.get(pred_idx, "neutral")
                    pred_set = self.learner.conformal_prediction_set([c_prob, e_prob, n_prob], self.id2label)

                    item_res = {
                        "contradiction": c_prob,
                        "entailment": e_prob,
                        "neutral": n_prob,
                        "predicted_label": pred_label,
                        "conformal_set": pred_set,
                        "conformal_abstain": len(pred_set) != 1,
                        "learner_ver": learner_ver,
                        "feature_dim": LayaLearnerHead.FEATURE_DIM,
                        "engine_mode": "neural_onnx",
                        "model_id": self.model_id,
                        "commit_sha": self.commit_sha,
                        "model_sha256": self.model_sha256,
                        "duration_ms": per_item_ms,
                        "batch_total_ms": round(batch_elapsed_ms, 2),
                        "cache_hit": False,
                        "device": self.device,
                        "vram_allocated_mb": self.vram_allocated_mb
                    }
                    if use_cache:
                        self.cache.put(miss_keys[local_i], item_res)
                    results[orig_idx] = item_res

                return [r for r in results if r is not None]
            except Exception as e:
                self.fallback_inferences += len(miss_pairs)
                self.last_fallback_reason = f"Batch inference exception: {str(e)}"
                self.last_fallback_time = time.time()
                logger.warning("Exceção em predict_batch ONNX: %s. Acionando fallback simbólico.", e)

        # Fallback Simbólico Determinístico item a item
        self.fallback_inferences += len(miss_pairs)
        self.last_fallback_reason = self.init_error or "Motor neural não inicializado"
        self.last_fallback_time = time.time()
        for local_i, orig_idx in enumerate(miss_indices):
            prem, hyp = miss_pairs[local_i]
            res = self._predict_symbolic_fallback(prem, hyp, t_start)
            res["fallback_reason"] = self.last_fallback_reason
            res["cache_hit"] = False
            if use_cache:
                self.cache.put(miss_keys[local_i], res)
            results[orig_idx] = res

        return [r for r in results if r is not None]

    def predict(self, premise: str, hypothesis: str, use_cache: bool = True) -> Dict[str, Any]:
        """Executa predição de um único par delegando ao pipeline vetorizado e cacheado."""
        return self.predict_batch([(premise, hypothesis)], use_cache=use_cache)[0]

    def _predict_symbolic_fallback(self, premise: str, hypothesis: str, start_time: float) -> Dict[str, Any]:
        p_lower = premise.lower()
        h_lower = hypothesis.lower()

        antonym_pairs = [
            ("ativado", "desativado"), ("true", "false"), ("sim", "não"),
            ("permitido", "proibido"), ("public", "private"), ("online", "offline"),
            ("20130", "8080"), ("20140", "8080"), ("20140", "3000"),
            ("memória ram", "disco"), ("stale", "fresh"), ("obsoleto", "canônico"),
            ("síncrono", "assíncrono"), ("ativo", "inativo"), ("válido", "inválido")
        ]

        is_contradiction = False
        for a, b in antonym_pairs:
            if (a in p_lower and b in h_lower) or (b in p_lower and a in h_lower):
                is_contradiction = True
                break

        negation_terms = {"não", "not", "nunca", "sem", "proibido", "desativado"}
        p_has_neg = any(term in p_lower.split() for term in negation_terms)
        h_has_neg = any(term in h_lower.split() for term in negation_terms)
        if p_has_neg != h_has_neg:
            p_words = set(re.findall(r"\w+", p_lower)) - negation_terms
            h_words = set(re.findall(r"\w+", h_lower)) - negation_terms
            if len(p_words.intersection(h_words)) >= 2:
                is_contradiction = True

        words_p = set(re.findall(r"\w+", p_lower)) - {"o", "a", "os", "as", "de", "do", "da", "em", "para", "com", "que", "se", "é"}
        words_h = set(re.findall(r"\w+", h_lower)) - {"o", "a", "os", "as", "de", "do", "da", "em", "para", "com", "que", "se", "é"}
        overlap = len(words_p.intersection(words_h))
        ratio = overlap / max(len(words_h), 1)

        if is_contradiction:
            c_prob, e_prob, n_prob = 0.94, 0.02, 0.04
            label = "contradiction"
        elif ratio >= 0.5:
            e_prob = min(0.60 + ratio * 0.35, 0.95)
            c_prob = 0.03
            n_prob = round(1.0 - (e_prob + c_prob), 4)
            label = "entailment"
        else:
            n_prob = 0.70
            e_prob = round(max(0.15, ratio * 0.3), 4)
            c_prob = round(max(0.05, 0.15 - ratio * 0.1), 4)
            label = "neutral"

        duration_ms = (time.perf_counter() - start_time) * 1000
        return {
            "contradiction": round(c_prob, 4),
            "entailment": round(e_prob, 4),
            "neutral": round(n_prob, 4),
            "predicted_label": label,
            "conformal_set": [label],
            "conformal_abstain": False,
            "engine_mode": "symbolic_fallback",
            "model_id": self.model_id,
            "duration_ms": round(duration_ms, 2),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }


# ============================================================================
# 4. MICRO-BATCHING ADAPTATIVO (AdaptiveBatchScheduler — PROAA-14 Seção 2.2)
# ============================================================================

class AdaptiveBatchScheduler:
    """
    Coalesce chamadas assíncronas concorrentes dentro de uma janela de 3-5ms (LAYA_BATCH_WINDOW_MS=4)
    até max_batch=16 em 1 único worker CPU dedicado, evitando contenção de threads ONNX.
    """

    def __init__(self, nli_engine: ONNXNLIEngine) -> None:
        self.nli_engine = nli_engine
        self.window_ms = float(os.environ.get("LAYA_BATCH_WINDOW_MS", 4.0))
        self.max_batch_size = int(os.environ.get("LAYA_MAX_BATCH_SIZE", 16))
        self._queue: Optional[asyncio.Queue] = None
        self._worker_task: Optional[asyncio.Task] = None
        self.coalesced_batches = 0
        self.coalesced_items = 0

    async def start(self) -> None:
        if self._queue is None:
            self._queue = asyncio.Queue()
            self._worker_task = asyncio.create_task(self._worker_loop())

    async def stop(self) -> None:
        if self._worker_task is not None:
            self._worker_task.cancel()
            try:
                await self._worker_task
            except asyncio.CancelledError:
                pass
            self._worker_task = None
            self._queue = None

    async def submit_pairs(self, pairs: List[Tuple[str, str]]) -> List[Dict[str, Any]]:
        if not pairs:
            return []
        if self._queue is None:
            await self.start()
        loop = asyncio.get_running_loop()
        fut: asyncio.Future = loop.create_future()
        await self._queue.put((pairs, fut))
        return await fut

    async def _worker_loop(self) -> None:
        assert self._queue is not None
        while True:
            first_pairs, first_fut = await self._queue.get()
            batch_requests: List[Tuple[List[Tuple[str, str]], asyncio.Future]] = [(first_pairs, first_fut)]
            total_pairs = len(first_pairs)

            deadline = time.perf_counter() + (self.window_ms / 1000.0)
            while total_pairs < self.max_batch_size:
                remaining = deadline - time.perf_counter()
                if remaining <= 0:
                    break
                try:
                    next_pairs, next_fut = await asyncio.wait_for(self._queue.get(), timeout=remaining)
                    batch_requests.append((next_pairs, next_fut))
                    total_pairs += len(next_pairs)
                except asyncio.TimeoutError:
                    break

            flat_pairs: List[Tuple[str, str]] = []
            slices: List[Tuple[int, int, asyncio.Future]] = []
            cursor = 0
            for req_pairs, req_fut in batch_requests:
                start_i = cursor
                end_i = cursor + len(req_pairs)
                flat_pairs.extend(req_pairs)
                slices.append((start_i, end_i, req_fut))
                cursor = end_i

            self.coalesced_batches += 1
            self.coalesced_items += len(flat_pairs)

            try:
                all_results = self.nli_engine.predict_batch(flat_pairs)
                for s_i, e_i, fut in slices:
                    if not fut.done():
                        fut.set_result(all_results[s_i:e_i])
            except Exception as exc:
                for _, _, fut in slices:
                    if not fut.done():
                        fut.set_exception(exc)


# ============================================================================
# 5. MOTOR CLASSIFICADOR LAYA SYSTEM ONE (LayaClassifierEngine v2.0)
# ============================================================================

class LayaClassifierEngine:
    def __init__(self, model_dir: Optional[str] = None) -> None:
        self.device = "CPUExecutionProvider"
        self.vram_allocated_mb = 0
        self.nli_engine = ONNXNLIEngine(model_dir)
        self.scheduler = AdaptiveBatchScheduler(self.nli_engine)
        self._warmup()

    def _warmup(self) -> None:
        _ = self.nli_engine.predict_batch(
            [("PCL AEOS initialization state", "Is system ready?")],
            use_cache=False
        )

    def evaluate_nli(self, premise: str, hypothesis: str) -> Dict[str, Any]:
        return self.nli_engine.predict(premise, hypothesis)

    @staticmethod
    def _clean_contradiction_hypothesis(query: str) -> str:
        prefix_match = re.search(
            r"^(?:o\s+claim\s+)?(?:contradiz\s+ou\s+gera\s+conflito\s+com|contradiz|gera\s+conflito\s+com|é\s+stale\s+em\s+relação\s+a)\s*:\s*(.+)$",
            query,
            re.IGNORECASE
        )
        return prefix_match.group(1).strip() if prefix_match else query

    def evaluate_binary(
        self,
        state: str,
        query: str,
        threshold: float = 0.60,
        allow_abstain: bool = False
    ) -> Dict[str, Any]:
        start = time.perf_counter()
        state_lower = state.lower()
        query_lower = query.lower()

        # 1. Guardrail / Prompt Injection Screen (< 1ms)
        if any(term in query_lower for term in ["injection", "injeção", "jailbreak", "abuse", "malicioso"]):
            suspicious_patterns = [
                r"ignore previous instructions",
                r"ignore as instruções anteriores",
                r"system prompt leak",
                r"reveal secret",
                r"bypass security",
                r"drop table",
                r"rm -rf"
            ]
            has_threat = any(re.search(pat, state_lower) for pat in suspicious_patterns)
            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "result": has_threat,
                "decision": "deny" if has_threat else "allow",
                "confidence": 0.98 if has_threat else 0.92,
                "engine_mode": "regex_guardrail",
                "cache_hit": False,
                "duration_ms": round(duration_ms, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # 2. Contradiction & Memory Staleness Check (Alimentado pelo Motor NLI + Conformal Prediction)
        if any(term in query_lower for term in ["contradiz", "conflito", "stale", "obsoleto"]):
            clean_hypothesis = self._clean_contradiction_hypothesis(query)
            nli = self.nli_engine.predict(premise=state, hypothesis=clean_hypothesis)
            c_prob = nli["contradiction"]
            e_prob = nli["entailment"]
            n_prob = nli["neutral"]

            is_conflict = (c_prob >= threshold) and (c_prob > e_prob)
            margin = c_prob - max(e_prob, n_prob)
            conformal_abstain = nli.get("conformal_abstain", False)

            if allow_abstain and ((abs(margin) < 0.15 and c_prob < threshold) or (conformal_abstain and c_prob < 0.72)):
                decision = "uncertain"
                is_conflict = False
                confidence = round(max(c_prob, e_prob, n_prob), 4)
            elif is_conflict:
                decision = "conflict"
                confidence = c_prob
            else:
                decision = "consistent"
                confidence = round(max(e_prob, n_prob, 1.0 - c_prob), 4)

            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "result": "uncertain" if (allow_abstain and decision == "uncertain") else is_conflict,
                "decision": decision,
                "confidence": confidence,
                "decision_threshold": threshold,
                "hypothesis_evaluated": clean_hypothesis,
                "nli_probs": {
                    "contradiction": c_prob,
                    "entailment": e_prob,
                    "neutral": n_prob
                },
                "conformal_set": nli.get("conformal_set", [nli["predicted_label"]]),
                "predicted_label": nli["predicted_label"],
                "engine_mode": nli["engine_mode"],
                "model_id": self.nli_engine.model_id,
                "cache_hit": bool(nli.get("cache_hit", False)),
                "duration_ms": round(duration_ms, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # 3. RAG Answerability Check
        if any(term in query_lower for term in ["answerable", "responde", "ajuda a responder", "contém a resposta"]):
            nli = self.nli_engine.predict(premise=state, hypothesis=query)
            is_answerable = (nli["entailment"] >= 0.35) or (nli["predicted_label"] == "entailment")
            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "result": is_answerable,
                "confidence": round(max(nli["entailment"], 1.0 - nli["entailment"]), 4),
                "nli_probs": {
                    "contradiction": nli["contradiction"],
                    "entailment": nli["entailment"],
                    "neutral": nli["neutral"]
                },
                "engine_mode": nli["engine_mode"],
                "model_id": self.nli_engine.model_id,
                "cache_hit": bool(nli.get("cache_hit", False)),
                "duration_ms": round(duration_ms, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # 4. Avaliação binária genérica calibrada via NLI
        nli = self.nli_engine.predict(premise=state, hypothesis=query)
        result = nli["entailment"] >= 0.50 or (nli["predicted_label"] == "entailment")
        confidence = nli["entailment"] if result else max(nli["contradiction"], nli["neutral"])
        if allow_abstain and nli.get("conformal_abstain") and max(nli["entailment"], nli["contradiction"]) < threshold:
            res_out: Union[bool, str] = "uncertain"
        else:
            res_out = result
        duration_ms = (time.perf_counter() - start) * 1000

        return {
            "result": res_out,
            "confidence": round(confidence, 4),
            "nli_probs": {
                "contradiction": nli["contradiction"],
                "entailment": nli["entailment"],
                "neutral": nli["neutral"]
            },
            "conformal_set": nli.get("conformal_set", [nli["predicted_label"]]),
            "engine_mode": nli["engine_mode"],
            "model_id": self.nli_engine.model_id,
            "cache_hit": bool(nli.get("cache_hit", False)),
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_choice(self, state: str, query: str, options: List[str]) -> Dict[str, Any]:
        start = time.perf_counter()
        state_lower = state.lower()
        query_lower = query.lower()

        if not options:
            raise ValueError("A lista de opções não pode estar vazia.")

        if any(term in query_lower for term in ["modelo", "complexidade", "route", "roteamento"]):
            token_count = len(state.split())
            if any(term in state_lower for term in ["arquitetura", "refatoração", "adr", "especificação", "segurança crítica"]):
                selected = "deep_reasoning" if "deep_reasoning" in options else options[-1]
                confidence = 0.94
            elif token_count < 80 and not any(term in state_lower for term in ["complexo", "análise profunda"]):
                selected = "local_fast" if "local_fast" in options else options[0]
                confidence = 0.96
            else:
                selected = options[len(options) // 2]
                confidence = 0.89

            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "selected": selected,
                "confidence": confidence,
                "engine_mode": "routing_policy",
                "cache_hit": False,
                "duration_ms": round(duration_ms, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        if any(term in query_lower for term in ["tool", "ferramenta", "gate", "permissão"]):
            danger_patterns = ["rm -rf", "drop table", "git push --force", "format c:", "mkfs", "delete from"]
            if any(p in state_lower for p in danger_patterns):
                selected = "deny" if "deny" in options else options[-1]
                confidence = 0.99
            elif any(p in state_lower for p in ["git commit", "docker compose up", "write_to_file", "npm install"]):
                selected = "confirm" if "confirm" in options else options[1 % len(options)]
                confidence = 0.91
            else:
                selected = "allow" if "allow" in options else options[0]
                confidence = 0.95

            duration_ms = (time.perf_counter() - start) * 1000
            return {
                "selected": selected,
                "confidence": confidence,
                "engine_mode": "safety_gate",
                "cache_hit": False,
                "duration_ms": round(duration_ms, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # Avaliação Vetorizada em Lote Único (PROAA-14 Seção 2.1)
        pairs = [(state, f"{query} -> {opt}" if query else opt) for opt in options]
        batch_res = self.nli_engine.predict_batch(pairs)
        scores = [r["entailment"] for r in batch_res]
        any_cache_hit = all(r.get("cache_hit", False) for r in batch_res)

        best_idx = int(scores.index(max(scores))) if max(scores) > 0 else 0
        selected = options[best_idx]
        total = sum(scores) + 1e-6
        confidence = round(scores[best_idx] / total if scores[best_idx] > 0 else 0.75, 4)

        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "selected": selected,
            "confidence": min(max(confidence, 0.75), 0.98),
            "option_scores": {opt: round(s, 4) for opt, s in zip(options, scores)},
            "engine_mode": self.nli_engine.engine_mode,
            "model_id": self.nli_engine.model_id,
            "cache_hit": any_cache_hit,
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_score(self, state: str, query: str, min_val: float = 0.0, max_val: float = 1.0) -> Dict[str, Any]:
        start = time.perf_counter()
        nli = self.nli_engine.predict(premise=state, hypothesis=query)
        ratio = nli["entailment"]
        score = min_val + (max_val - min_val) * ratio
        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "score": round(score, 4),
            "entailment_prob": round(ratio, 4),
            "confidence": round(0.80 + ratio * 0.19, 4),
            "engine_mode": nli["engine_mode"],
            "model_id": self.nli_engine.model_id,
            "cache_hit": bool(nli.get("cache_hit", False)),
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_batch(self, state: str, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Executa um lote de perguntas coalescendo todas as avaliações NLI em predict_batch."""
        start = time.perf_counter()
        results = []
        for q in questions:
            q_type = q.get("type", "binary")
            query = q.get("query", "")
            if q_type == "binary":
                res = self.evaluate_binary(state, query)
            elif q_type == "nli":
                res = self.evaluate_nli(premise=state, hypothesis=query)
            elif q_type == "choice":
                res = self.evaluate_choice(state, query, q.get("options", []))
            elif q_type == "score":
                res = self.evaluate_score(state, query, q.get("min_val", 0.0), q.get("max_val", 1.0))
            else:
                res = {"error": f"Tipo desconhecido: {q_type}"}
            results.append({"id": q.get("id"), "result": res})

        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "batch_size": len(questions),
            "results": results,
            "total_duration_ms": round(duration_ms, 2),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    # =========================================================================
    # NOVAS PRIMITIVAS SYSTEM ONE (PROAA-14 Seção 4.2)
    # =========================================================================

    def match_intent(
        self,
        state: str,
        intents: List[str],
        threshold: float = 0.65
    ) -> Dict[str, Any]:
        """
        Ranqueia intenções/rotas em 1 único predict_batch() e retorna matched_intent,
        confidence, scores_by_intent e abstain se abaixo do limiar.
        """
        start = time.perf_counter()
        if not intents:
            raise ValueError("A lista 'intents' não pode estar vazia.")

        pairs = [(state, f"The user intent corresponds to: {intent}") for intent in intents]
        batch_out = self.nli_engine.predict_batch(pairs)

        raw_scores = [r["entailment"] + (0.25 * (1.0 - r["contradiction"])) for r in batch_out]
        max_s = max(raw_scores) if raw_scores else 0.0
        exp_s = [math.exp((s - max_s) * 3.0) for s in raw_scores]
        sum_exp = sum(exp_s) + 1e-8
        norm_scores = [round(e / sum_exp, 4) for e in exp_s]

        best_idx = int(norm_scores.index(max(norm_scores)))
        best_intent = intents[best_idx]
        best_conf = round(max(norm_scores[best_idx], batch_out[best_idx]["entailment"]), 4)
        abstain = best_conf < threshold and max(r["entailment"] for r in batch_out) < (threshold * 0.5)

        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "matched_intent": "uncertain" if abstain else best_intent,
            "top_candidate": best_intent,
            "confidence": best_conf,
            "threshold": threshold,
            "abstain": abstain,
            "scores_by_intent": {intent: round(sc, 4) for intent, sc in zip(intents, norm_scores)},
            "cache_hit": all(r.get("cache_hit", False) for r in batch_out),
            "engine_mode": self.nli_engine.engine_mode,
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def deduplicate_memory(
        self,
        candidate: str,
        existing_memories: List[str],
        entailment_threshold: float = 0.88,
        contradiction_threshold: float = 0.70
    ) -> Dict[str, Any]:
        """
        Compara candidate contra Top-K memórias existentes em 1 único predict_batch().
        Retorna action: 'insert' | 'merge_duplicate' | 'supersede_contradiction' | 'uncertain'.
        """
        start = time.perf_counter()
        if not existing_memories:
            return {
                "action": "insert",
                "target_index": None,
                "nli_probs": None,
                "duration_ms": round((time.perf_counter() - start) * 1000, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        pairs = [(mem, candidate) for mem in existing_memories]
        batch_out = self.nli_engine.predict_batch(pairs)

        best_ent_idx = max(range(len(batch_out)), key=lambda i: batch_out[i]["entailment"])
        best_con_idx = max(range(len(batch_out)), key=lambda i: batch_out[i]["contradiction"])

        max_ent = batch_out[best_ent_idx]["entailment"]
        max_con = batch_out[best_con_idx]["contradiction"]

        if max_con >= contradiction_threshold and max_con > max_ent:
            action = "supersede_contradiction"
            target_idx: Optional[int] = best_con_idx
            chosen_probs = batch_out[best_con_idx]
        elif max_ent >= entailment_threshold:
            action = "merge_duplicate"
            target_idx = best_ent_idx
            chosen_probs = batch_out[best_ent_idx]
        elif max_con >= (contradiction_threshold - 0.12) or max_ent >= (entailment_threshold - 0.12):
            action = "uncertain"
            target_idx = best_con_idx if max_con >= max_ent else best_ent_idx
            chosen_probs = batch_out[target_idx]
        else:
            action = "insert"
            target_idx = None
            chosen_probs = batch_out[best_ent_idx]

        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "action": action,
            "target_index": target_idx,
            "target_memory": existing_memories[target_idx] if target_idx is not None else None,
            "nli_probs": {
                "contradiction": chosen_probs["contradiction"],
                "entailment": chosen_probs["entailment"],
                "neutral": chosen_probs["neutral"]
            },
            "cache_hit": all(r.get("cache_hit", False) for r in batch_out),
            "engine_mode": self.nli_engine.engine_mode,
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def verify_policy(
        self,
        state: str,
        policy_rules: List[str],
        threshold: float = 0.65
    ) -> Dict[str, Any]:
        """
        Avalia cada regra de governança contra state em 1 único predict_batch() e retorna
        compliant: bool, violated_rules: List[Dict] e decision ('allow' | 'confirm' | 'deny').
        """
        start = time.perf_counter()
        if not policy_rules:
            return {
                "compliant": True,
                "decision": "allow",
                "confidence": 1.0,
                "violated_rules": [],
                "duration_ms": round((time.perf_counter() - start) * 1000, 3),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        pairs = [(state, rule) for rule in policy_rules]
        batch_out = self.nli_engine.predict_batch(pairs)

        violated_rules: List[Dict[str, Any]] = []
        uncertain_rules: List[Dict[str, Any]] = []

        for idx, (rule, nli_res) in enumerate(zip(policy_rules, batch_out)):
            c_prob = nli_res["contradiction"]
            e_prob = nli_res["entailment"]
            if c_prob >= threshold and c_prob > e_prob:
                violated_rules.append({
                    "rule_index": idx,
                    "rule": rule,
                    "contradiction_prob": c_prob,
                    "entailment_prob": e_prob
                })
            elif c_prob >= (threshold - 0.15) and c_prob > e_prob:
                uncertain_rules.append({
                    "rule_index": idx,
                    "rule": rule,
                    "contradiction_prob": c_prob
                })

        if violated_rules:
            compliant = False
            decision = "deny"
            confidence = max(v["contradiction_prob"] for v in violated_rules)
        elif uncertain_rules:
            compliant = False
            decision = "confirm"
            confidence = max(u["contradiction_prob"] for u in uncertain_rules)
        else:
            compliant = True
            decision = "allow"
            confidence = round(max(1.0 - max(r["contradiction"] for r in batch_out), 0.85), 4)

        duration_ms = (time.perf_counter() - start) * 1000
        return {
            "compliant": compliant,
            "decision": decision,
            "confidence": round(confidence, 4),
            "violated_rules": violated_rules,
            "cache_hit": all(r.get("cache_hit", False) for r in batch_out),
            "engine_mode": self.nli_engine.engine_mode,
            "duration_ms": round(duration_ms, 3),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def lightning_council(
        self,
        state: str,
        checks: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Conselho Relâmpago (PROAA-14 Seção 4.1 e 4.2):
        Coalesce todos os pares NLI de todas as checagens (noul, verify_policy, match_intent, score, deduplicate_memory)
        em 1 ÚNICO predict_batch() vetorizado em CPU, e aciona o Circuit Breaker Semântico (skip_llm=True)
        quando extractive_qa_entailment >= 0.92.
        """
        start = time.perf_counter()
        results_by_idx: Dict[int, Dict[str, Any]] = {}
        flat_pairs: List[Tuple[str, str]] = []
        check_slices: List[Tuple[int, Dict[str, Any], int, int]] = []

        # 1. Pré-filtragem de Regex Guardrails e Fast-Paths Determinísticos (<0.1ms) e coleta de pares NLI para batch único
        for idx, chk in enumerate(checks):
            c_id = chk.get("id", f"chk_{idx}")
            c_type = chk.get("type", "noul")
            query = str(chk.get("query", ""))
            options = chk.get("options") or []

            if c_type in ("noul", "binary") and any(t in query.lower() for t in ["injection", "injeção", "jailbreak", "malicioso"]):
                g_res = self.evaluate_binary(state, query)
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": g_res["result"],
                    "confidence": g_res["confidence"],
                    "engine_mode": "regex_guardrail",
                    "cache_hit": False
                }
                continue

            if c_type in ("match_intent", "choice") and any(o in ("local_fast", "deep_reasoning") for o in options):
                r_res = self.evaluate_choice(state, "roteamento modelo complexidade", options)
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": r_res["selected"],
                    "confidence": r_res["confidence"],
                    "engine_mode": r_res["engine_mode"],
                    "cache_hit": False
                }
                continue

            s_pos = len(flat_pairs)
            if c_type in ("noul", "binary", "score"):
                clean_hyp = self._clean_contradiction_hypothesis(query) if "contradiz" in query.lower() else query
                flat_pairs.append((state, clean_hyp))
            elif c_type in ("verify_policy", "choice", "match_intent"):
                for opt in options:
                    hyp = f"The user intent corresponds to: {opt}" if c_type == "match_intent" else (f"{query} -> {opt}" if query else opt)
                    flat_pairs.append((state, hyp))
            elif c_type == "deduplicate_memory":
                for mem in options:
                    flat_pairs.append((mem, state))
            e_pos = len(flat_pairs)
            check_slices.append((idx, chk, s_pos, e_pos))

        # 2. Executa 1 ÚNICO predict_batch() para todo o Conselho Relâmpago!
        batch_outputs = self.nli_engine.predict_batch(flat_pairs) if flat_pairs else []
        qa_entailment = 0.0

        # 3. Decodifica cada fatia de resultado
        for idx, chk, s_pos, e_pos in check_slices:
            c_id = chk.get("id", f"chk_{idx}")
            c_type = chk.get("type", "noul")
            query = str(chk.get("query", ""))
            options = chk.get("options") or []
            threshold = float(chk.get("threshold", 0.60))
            slice_out = batch_outputs[s_pos:e_pos]

            if not slice_out:
                results_by_idx[idx] = {"id": c_id, "type": c_type, "decision": "uncertain", "confidence": 0.0}
                continue

            if c_type in ("noul", "binary"):
                nli = slice_out[0]
                is_contra_query = any(t in query.lower() for t in ["contradiz", "conflito", "stale", "obsoleto"])
                if is_contra_query:
                    is_conf = nli["contradiction"] >= threshold and nli["contradiction"] > nli["entailment"]
                    decision: Any = True if is_conf else (
                        "uncertain" if nli.get("conformal_abstain") and nli["contradiction"] >= 0.40 else False
                    )
                    conf = nli["contradiction"] if is_conf else max(nli["entailment"], nli["neutral"])
                else:
                    is_ent = nli["entailment"] >= 0.50 or nli["predicted_label"] == "entailment"
                    decision = True if is_ent else False
                    conf = nli["entailment"] if is_ent else max(nli["contradiction"], nli["neutral"])
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": decision,
                    "confidence": round(conf, 4),
                    "engine_mode": nli["engine_mode"],
                    "cache_hit": bool(nli.get("cache_hit", False))
                }

            elif c_type == "score":
                nli = slice_out[0]
                min_v = float(chk.get("min_val", 0.0))
                max_v = float(chk.get("max_val", 1.0))
                ratio = nli["entailment"]
                qa_entailment = max(qa_entailment, ratio)
                sc = round(min_v + (max_v - min_v) * ratio, 4)
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": sc,
                    "score": sc,
                    "confidence": round(0.80 + ratio * 0.19, 4),
                    "engine_mode": nli["engine_mode"],
                    "cache_hit": bool(nli.get("cache_hit", False))
                }

            elif c_type == "verify_policy":
                violated = [r for r in slice_out if r["contradiction"] >= threshold and r["contradiction"] > r["entailment"]]
                if violated:
                    dec = "deny"
                    conf = max(r["contradiction"] for r in violated)
                else:
                    dec = "allow"
                    conf = round(max(1.0 - max(r["contradiction"] for r in slice_out), 0.85), 4)
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": dec,
                    "confidence": round(conf, 4),
                    "engine_mode": slice_out[0]["engine_mode"],
                    "cache_hit": all(r.get("cache_hit", False) for r in slice_out)
                }

            elif c_type in ("match_intent", "choice"):
                scores = [r["entailment"] + 0.2 * (1.0 - r["contradiction"]) for r in slice_out]
                best_i = int(scores.index(max(scores)))
                best_opt = options[best_i] if best_i < len(options) else "unknown"
                results_by_idx[idx] = {
                    "id": c_id,
                    "type": c_type,
                    "decision": best_opt,
                    "confidence": round(max(slice_out[best_i]["entailment"], 0.78), 4),
                    "engine_mode": slice_out[0]["engine_mode"],
                    "cache_hit": all(r.get("cache_hit", False) for r in slice_out)
                }

        ordered_results = [results_by_idx[i] for i in range(len(checks)) if i in results_by_idx]
        total_duration_ms = round((time.perf_counter() - start) * 1000.0, 2)

        return {
            "mode": "council",
            "checks_count": len(ordered_results),
            "coalesced_nli_pairs": len(flat_pairs),
            "results": ordered_results,
            "circuit_breaker": {
                "extractive_qa_entailment": round(qa_entailment, 4),
                "skip_llm": qa_entailment >= 0.92
            },
            "total_duration_ms": total_duration_ms,
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_systemone(self, req: SystemOneRequest) -> Dict[str, Any]:
        """Roteador unificado do endpoint POST /v1/systemone (PROAA-14 Seção 4.1)."""
        mode = (req.mode or "council").lower()
        if mode == "council":
            return self.lightning_council(req.state, req.checks or [])
        if mode == "choice":
            return self.evaluate_choice(req.state, req.query or "", req.options or [])
        if mode == "score":
            return self.evaluate_score(req.state, req.query or "", req.min_val or 0.0, req.max_val or 1.0)
        if mode in ("noul", "binary"):
            return self.evaluate_binary(req.state, req.query or "", req.threshold or 0.60, bool(req.allow_abstain))
        if mode == "match_intent":
            return self.match_intent(req.state, req.options or [], req.threshold or 0.65)
        if mode == "deduplicate_memory":
            return self.deduplicate_memory(req.state, req.options or [])
        if mode == "verify_policy":
            return self.verify_policy(req.state, req.options or [], req.threshold or 0.65)
        raise ValueError(f"Modo SystemOne inválido: '{req.mode}'.")

    def get_health_status(self) -> Dict[str, Any]:
        is_neural = self.nli_engine.is_ready and self.nli_engine.engine_mode == "neural_onnx"
        status = "healthy" if is_neural else "degraded"
        cache_stats = self.nli_engine.cache.get_metrics()
        return {
            "status": status,
            "service": "pcl-laya",
            "version": "2.0.0-PROAA14",
            "engine_mode": self.nli_engine.engine_mode,
            "is_ready": self.nli_engine.is_ready,
            "model_id": self.nli_engine.model_id,
            "commit_sha": self.nli_engine.commit_sha,
            "model_sha256": self.nli_engine.model_sha256,
            "execution_provider": self.device,
            "vram_allocated_mb": self.vram_allocated_mb,
            "labels": self.nli_engine.id2label,
            "learner": {
                "is_loaded": self.nli_engine.learner.is_loaded,
                "learner_ver": self.nli_engine.learner.learner_ver,
                "feature_dim": LayaLearnerHead.FEATURE_DIM,
                "q_hat": self.nli_engine.learner.q_hat,
                "alpha": self.nli_engine.learner.alpha,
                "metrics": self.nli_engine.learner.metrics
            },
            "cache": cache_stats,
            "telemetry": {
                "total_inferences": self.nli_engine.total_inferences,
                "neural_inferences": self.nli_engine.neural_inferences,
                "batch_calls": self.nli_engine.batch_calls,
                "coalesced_batches": self.scheduler.coalesced_batches,
                "coalesced_items": self.scheduler.coalesced_items,
                "fallback_inferences": self.nli_engine.fallback_inferences,
                "last_fallback_reason": self.nli_engine.last_fallback_reason,
                "last_fallback_time": self.nli_engine.last_fallback_time,
                "init_error": self.nli_engine.init_error,
                **cache_stats
            },
            "conformance": [
                "SPEC-PCL-AEOS-CLASSIFIER-01",
                "SPEC-PCL-AEOS-MEMORY-03",
                "PROAA-14"
            ]
        }
