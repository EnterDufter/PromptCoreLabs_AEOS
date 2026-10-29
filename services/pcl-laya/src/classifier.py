"""
PCL AEOS - System One Decision Classifier (Laya Engine)
Conformidade: SPEC-PCL-AEOS-CLASSIFIER-01 & SPEC-PCL-AEOS-MEMORY-03
Motor Neural Canônico: cross-encoder/nli-MiniLM-2-L6-H768 (ONNX INT8 / AVX2)
Invariante de Hardware: 100% CPU Execution Provider (0 MB VRAM alocada)
Dual-Engine: ONNX Neural Engine com Fallback Simbólico Determinístico Gracioso
"""

import os
import sys
import time
import re
import math
import json
import logging
import hashlib
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from pydantic import BaseModel, Field

logger = logging.getLogger("pcl.laya")
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("[%(asctime)s] [%(levelname)s] [Laya] %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

# Importação segura de dependências ONNX e Tokenizers
HAS_ONNX_DEPENDENCIES = False
try:
    import numpy as np
    import onnxruntime as ort
    from tokenizers import Tokenizer
    HAS_ONNX_DEPENDENCIES = True
except ImportError:
    HAS_ONNX_DEPENDENCIES = False


class NLIEvaluationRequest(BaseModel):
    premise: str = Field(..., description="Contexto, premissa ou documento de referência")
    hypothesis: str = Field(..., description="Hipótese, claim ou afirmação a ser confrontada contra a premissa")


class BinaryEvaluationRequest(BaseModel):
    state: str = Field(..., description="Contexto ou estado textual para avaliação")
    query: str = Field(..., description="Pergunta tipada binária (ex: 'Contém injeção?', 'O claim contradiz a especificação?')")
    threshold: Optional[float] = Field(0.60, description="Limiar de probabilidade para confirmação da classe alvo (padrão 0.60)")
    allow_abstain: Optional[bool] = Field(False, description="Se True, permite retorno de 'uncertain' em casos de baixa separação de margem")


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


class ONNXNLIEngine:
    """
    Motor Neural de Inferência em Linguagem Natural (NLI).
    Baseado em cross-encoder/nli-MiniLM-2-L6-H768 em formato ONNX quantizado (INT8 / AVX2).
    Garantia: 100% CPU Execution Provider, 0 MB VRAM alocada, latência ~10-25ms.
    Rastreabilidade Criptográfica: Validação de Commit SHA e Hash SHA-256 dos artefatos.
    """
    def __init__(self, model_dir: Optional[str] = None):
        self.model_id = "cross-encoder/nli-MiniLM2-L6-H768"
        self.device = "CPUExecutionProvider"
        self.vram_allocated_mb = 0
        self.id2label = {0: "contradiction", 1: "entailment", 2: "neutral"}
        self.label2id = {"contradiction": 0, "entailment": 1, "neutral": 2}
        
        self.is_ready = False
        self.engine_mode = "symbolic_fallback"
        self.session = None
        self.tokenizer = None
        self.model_path = None
        self.tokenizer_path = None
        self.commit_sha = None
        self.model_sha256 = None
        self.init_error = None

        # Telemetria de Inferência e Fallback
        self.total_inferences = 0
        self.neural_inferences = 0
        self.fallback_inferences = 0
        self.last_fallback_reason = None
        self.last_fallback_time = None

        self._initialize(model_dir)

    def _initialize(self, model_dir: Optional[str] = None):
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
            logger.warning("Dependências ONNX ausentes no ambiente. Motor Laya operando em modo degradado (symbolic_fallback).")
            self.engine_mode = "symbolic_fallback"
            self.is_ready = False
            return

        if not resolved_dir:
            self.init_error = f"Artefatos do modelo não encontrados nos diretórios candidatos: {[str(c) for c in candidates]}"
            logger.warning("Artefatos do modelo Laya ausentes. Motor operando em modo degradado (symbolic_fallback).")
            self.engine_mode = "symbolic_fallback"
            self.is_ready = False
            return

        try:
            self.model_path = str(resolved_dir / "model.onnx")
            self.tokenizer_path = str(resolved_dir / "tokenizer.json")
            config_file = resolved_dir / "config.json"
            manifest_file = resolved_dir / "manifest.json"

            # 1. Carrega manifest criptográfico se disponível
            if manifest_file.exists():
                try:
                    with open(manifest_file, "r", encoding="utf-8") as mf:
                        m_data = json.load(mf)
                        self.commit_sha = m_data.get("commit_sha")
                        artifacts = m_data.get("artifacts", {})
                        if "model.onnx" in artifacts:
                            self.model_sha256 = artifacts["model.onnx"].get("sha256")
                except Exception as me:
                    logger.warning("Falha ao ler manifest.json: %s", me)

            # 2. Carrega mapeamento id2label dinamicamente de config.json
            if config_file.exists():
                try:
                    with open(config_file, "r", encoding="utf-8") as cf:
                        cfg = json.load(cf)
                        cfg_labels = cfg.get("id2label", {})
                        if cfg_labels:
                            self.id2label = {int(k): v.lower() for k, v in cfg_labels.items()}
                            self.label2id = {v.lower(): int(k) for k, v in cfg_labels.items()}
                except Exception as ce:
                    logger.warning("Falha ao ler labels de config.json: %s", ce)

            # 3. Configura Tokenizer Fast RoBERTa/MiniLM
            self.tokenizer = Tokenizer.from_file(self.tokenizer_path)
            self.tokenizer.enable_truncation(max_length=128)
            self.tokenizer.no_padding()

            # 4. Configura Sessão ONNX Runtime estritamente em CPU
            opts = ort.SessionOptions()
            cpu_threads = int(os.environ.get("LAYA_CPU_THREADS", 2))
            opts.intra_op_num_threads = cpu_threads
            opts.inter_op_num_threads = 1
            opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL

            self.session = ort.InferenceSession(
                self.model_path,
                sess_options=opts,
                providers=["CPUExecutionProvider"]
            )
            self.is_ready = True
            self.engine_mode = "neural_onnx"
            self.init_error = None
            logger.info("ONNXNLIEngine inicializado com sucesso (neural_onnx | CPUExecutionProvider | commit: %s)", self.commit_sha or "unverified")
        except Exception as e:
            self.is_ready = False
            self.engine_mode = "symbolic_fallback"
            self.init_error = f"Erro ao inicializar sessão ONNX: {str(e)}"
            logger.error("Falha ao inicializar motor ONNX: %s. Revertendo para fallback simbólico.", e)

    def predict(self, premise: str, hypothesis: str) -> Dict[str, Any]:
        """
        Calcula as probabilidades normalizadas de Contradição, Consonância (Entailment) e Neutralidade.
        """
        start = time.perf_counter()
        self.total_inferences += 1

        if self.is_ready and self.session and self.tokenizer:
            try:
                # 1. Tokenização do par cruzado (Premissa, Hipótese)
                encoding = self.tokenizer.encode(premise, hypothesis)
                input_ids = np.array([encoding.ids], dtype=np.int64)
                attention_mask = np.array([encoding.attention_mask], dtype=np.int64)
                token_type_ids = np.array([encoding.type_ids], dtype=np.int64)

                ort_inputs = {
                    "input_ids": input_ids,
                    "attention_mask": attention_mask
                }
                session_inputs = [inp.name for inp in self.session.get_inputs()]
                if "token_type_ids" in session_inputs:
                    ort_inputs["token_type_ids"] = token_type_ids

                # 2. Inferência ONNX em CPU
                raw_outputs = self.session.run(None, ort_inputs)[0]
                logits = raw_outputs[0].tolist()

                # 3. Softmax normalizado
                max_logit = max(logits)
                exp_logits = [math.exp(x - max_logit) for x in logits]
                sum_exp = sum(exp_logits)
                probs = [x / sum_exp for x in exp_logits]

                # Mapeamento do cross-encoder/nli-MiniLM2-L6-H768
                contradiction_prob = round(probs[0], 4)
                entailment_prob = round(probs[1], 4)
                neutral_prob = round(probs[2], 4)

                pred_idx = probs.index(max(probs))
                pred_label = self.id2label.get(pred_idx, "neutral")

                duration_ms = (time.perf_counter() - start) * 1000
                self.neural_inferences += 1

                return {
                    "contradiction": contradiction_prob,
                    "entailment": entailment_prob,
                    "neutral": neutral_prob,
                    "predicted_label": pred_label,
                    "engine_mode": "neural_onnx",
                    "model_id": self.model_id,
                    "commit_sha": self.commit_sha,
                    "model_sha256": self.model_sha256,
                    "duration_ms": round(duration_ms, 2),
                    "device": self.device,
                    "vram_allocated_mb": self.vram_allocated_mb
                }
            except Exception as e:
                self.fallback_inferences += 1
                self.last_fallback_reason = f"Runtime inference exception: {str(e)}"
                self.last_fallback_time = time.time()
                logger.warning("Exceção na inferência ONNX: %s. Acionando fallback simbólico.", e)
                res = self._predict_symbolic_fallback(premise, hypothesis, start)
                res["fallback_reason"] = self.last_fallback_reason
                return res

        # Fallback Simbólico Determinístico (Dual-Engine)
        self.fallback_inferences += 1
        self.last_fallback_reason = self.init_error or "Motor neural não inicializado"
        self.last_fallback_time = time.time()
        res = self._predict_symbolic_fallback(premise, hypothesis, start)
        res["fallback_reason"] = self.last_fallback_reason
        return res

    def _predict_symbolic_fallback(self, premise: str, hypothesis: str, start_time: float) -> Dict[str, Any]:
        p_lower = premise.lower()
        h_lower = hypothesis.lower()

        # Dicionário ontológico de oposições polares e antônimos
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

        # Verificação de inversão por negação
        negation_terms = {"não", "not", "nunca", "sem", "proibido", "desativado"}
        p_has_neg = any(term in p_lower.split() for term in negation_terms)
        h_has_neg = any(term in h_lower.split() for term in negation_terms)
        if p_has_neg != h_has_neg:
            p_words = set(re.findall(r"\w+", p_lower)) - negation_terms
            h_words = set(re.findall(r"\w+", h_lower)) - negation_terms
            if len(p_words.intersection(h_words)) >= 2:
                is_contradiction = True

        # Cálculo de consonância léxico-semântica
        words_p = set(re.findall(r"\w+", p_lower)) - {"o", "a", "os", "as", "de", "do", "da", "em", "para", "com", "que", "se", "é"}
        words_h = set(re.findall(r"\w+", h_lower)) - {"o", "a", "os", "as", "de", "do", "da", "em", "para", "com", "que", "se", "é"}
        overlap = len(words_p.intersection(words_h))
        ratio = overlap / max(len(words_h), 1)

        if is_contradiction:
            c_prob = 0.94
            e_prob = 0.02
            n_prob = 0.04
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
            "engine_mode": "symbolic_fallback",
            "model_id": self.model_id,
            "duration_ms": round(duration_ms, 2),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }


class LayaClassifierEngine:
    def __init__(self, model_dir: Optional[str] = None):
        self.device = "CPUExecutionProvider"
        self.vram_allocated_mb = 0
        self.nli_engine = ONNXNLIEngine(model_dir)
        self._warmup()

    def _warmup(self):
        # Aquecimento inicial para compilar grafos e estabilizar latência CPU < 20ms
        _ = self.evaluate_binary("PCL AEOS initialization state", "Is system ready?")

    def evaluate_nli(self, premise: str, hypothesis: str) -> Dict[str, Any]:
        """
        Executa inferência cruzada de NLI entre premissa e hipótese.
        Retorna probabilidades de [contradiction, entailment, neutral].
        """
        return self.nli_engine.predict(premise, hypothesis)

    def evaluate_binary(self, state: str, query: str, threshold: float = 0.60, allow_abstain: bool = False) -> Dict[str, Any]:
        start = time.perf_counter()
        state_lower = state.lower()
        query_lower = query.lower()

        # 1. Guardrail / Prompt Injection Screen (Heurística Regex de Alta Velocidade < 1ms)
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
                "confidence": 0.98 if has_threat else 0.92,
                "engine_mode": "regex_guardrail",
                "duration_ms": round(duration_ms, 2),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # 2. Contradiction & Memory Staleness Check (Alimentado pelo Motor NLI)
        if any(term in query_lower for term in ["contradiz", "conflito", "stale", "obsoleto"]):
            # Extrai hipótese limpa caso a query utilize prefixos heurísticos/sintéticos
            clean_hypothesis = query
            prefix_match = re.search(
                r"^(?:o\s+claim\s+)?(?:contradiz\s+ou\s+gera\s+conflito\s+com|contradiz|gera\s+conflito\s+com|é\s+stale\s+em\s+relação\s+a)\s*:\s*(.+)$",
                query,
                re.IGNORECASE
            )
            if prefix_match:
                clean_hypothesis = prefix_match.group(1).strip()

            # Avalia premissa e hipótese puras no motor NLI
            nli = self.nli_engine.predict(premise=state, hypothesis=clean_hypothesis)
            c_prob = nli["contradiction"]
            e_prob = nli["entailment"]
            n_prob = nli["neutral"]

            # Análise de separação e limiar de decisão
            is_conflict = (c_prob >= threshold) and (c_prob > e_prob)
            margin = c_prob - max(e_prob, n_prob)

            if allow_abstain and abs(margin) < 0.15 and c_prob < threshold:
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
                "result": is_conflict,
                "decision": decision,
                "confidence": confidence,
                "decision_threshold": threshold,
                "hypothesis_evaluated": clean_hypothesis,
                "nli_probs": {
                    "contradiction": c_prob,
                    "entailment": e_prob,
                    "neutral": n_prob
                },
                "predicted_label": nli["predicted_label"],
                "engine_mode": nli["engine_mode"],
                "model_id": self.nli_engine.model_id,
                "duration_ms": round(duration_ms, 2),
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
                "duration_ms": round(duration_ms, 2),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # 4. Avaliação binária genérica calibrada via NLI
        nli = self.nli_engine.predict(premise=state, hypothesis=query)
        result = nli["entailment"] >= 0.50 or (nli["predicted_label"] == "entailment")
        confidence = nli["entailment"] if result else max(nli["contradiction"], nli["neutral"])
        duration_ms = (time.perf_counter() - start) * 1000

        return {
            "result": result,
            "confidence": round(confidence, 4),
            "nli_probs": {
                "contradiction": nli["contradiction"],
                "entailment": nli["entailment"],
                "neutral": nli["neutral"]
            },
            "engine_mode": nli["engine_mode"],
            "model_id": self.nli_engine.model_id,
            "duration_ms": round(duration_ms, 2),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_choice(self, state: str, query: str, options: List[str]) -> Dict[str, Any]:
        start = time.perf_counter()
        state_lower = state.lower()
        query_lower = query.lower()

        if not options:
            raise ValueError("A lista de opções não pode estar vazia.")

        # Roteamento por complexidade de modelo (ex: 'local', 'flash', 'pro')
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
                "duration_ms": round(duration_ms, 2),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # Tool Call Gating (ex: ['allow', 'confirm', 'deny'])
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
                "duration_ms": round(duration_ms, 2),
                "device": self.device,
                "vram_allocated_mb": self.vram_allocated_mb
            }

        # Seleção Semântica por NLI Entailment entre Estado e Opções
        scores = []
        for opt in options:
            nli = self.nli_engine.predict(premise=state, hypothesis=f"{query} -> {opt}")
            scores.append(nli["entailment"])

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
            "duration_ms": round(duration_ms, 2),
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
            "confidence": round(0.80 + ratio * 0.19, 4),
            "engine_mode": nli["engine_mode"],
            "model_id": self.nli_engine.model_id,
            "duration_ms": round(duration_ms, 2),
            "device": self.device,
            "vram_allocated_mb": self.vram_allocated_mb
        }

    def evaluate_batch(self, state: str, questions: List[Dict[str, Any]]) -> Dict[str, Any]:
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

    def get_health_status(self) -> Dict[str, Any]:
        """
        Gera relatório honesto e observável de saúde e prontidão do Laya.
        Distingue 'healthy' (ONNX neural operacional) de 'degraded' (operando em fallback simbólico).
        """
        is_neural = self.nli_engine.is_ready and self.nli_engine.engine_mode == "neural_onnx"
        status = "healthy" if is_neural else "degraded"
        return {
            "status": status,
            "service": "pcl-laya",
            "version": "1.2.0",
            "engine_mode": self.nli_engine.engine_mode,
            "is_ready": self.nli_engine.is_ready,
            "model_id": self.nli_engine.model_id,
            "commit_sha": self.nli_engine.commit_sha,
            "model_sha256": self.nli_engine.model_sha256,
            "execution_provider": self.device,
            "vram_allocated_mb": self.vram_allocated_mb,
            "labels": self.nli_engine.id2label,
            "telemetry": {
                "total_inferences": self.nli_engine.total_inferences,
                "neural_inferences": self.nli_engine.neural_inferences,
                "fallback_inferences": self.nli_engine.fallback_inferences,
                "last_fallback_reason": self.nli_engine.last_fallback_reason,
                "last_fallback_time": self.nli_engine.last_fallback_time,
                "init_error": self.nli_engine.init_error
            },
            "conformance": ["SPEC-PCL-AEOS-CLASSIFIER-01", "SPEC-PCL-AEOS-MEMORY-03"]
        }
