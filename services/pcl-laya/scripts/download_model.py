#!/usr/bin/env python3
"""
PCL AEOS - Script de Download e Validação Criptográfica do Modelo ONNX Neural Laya
Modelo Canônico: cross-encoder/nli-MiniLM-2-L6-H768
Quantização: INT8 / UINT8 AVX2 (~78 MB)
Hardware Invariant: 100% CPU Execution Provider (0 MB VRAM)
Rastreabilidade: PCL-AEOS-REPRODUCIBILITY-01 (Pinagem de Commit + Verificação SHA-256)
"""

import os
import sys
import json
import hashlib
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "nli-minilm"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

HF_REPO = "cross-encoder/nli-MiniLM2-L6-H768"
HF_COMMIT = "b95119ce93d3e065de6214e38cd4a97b0f2f2c6d"

EXPECTED_ARTIFACTS = {
    "config.json": {
        "url": f"https://huggingface.co/{HF_REPO}/raw/{HF_COMMIT}/config.json",
        "size": 875,
        "sha256": "8b0e41caff7567c0f53e6983f35591c3dec59507c9173ab125c5823394fb57f3"
    },
    "tokenizer.json": {
        "url": f"https://huggingface.co/{HF_REPO}/raw/{HF_COMMIT}/tokenizer.json",
        "size": 1356048,
        "sha256": "82139106e603ee4e1d5bc99d056ccbed5a92bc24848b1b5a7137c26e00d0dbf6"
    },
    "model.onnx": {
        "url": f"https://huggingface.co/{HF_REPO}/resolve/{HF_COMMIT}/onnx/model_quint8_avx2.onnx",
        "size": 82823063,
        "sha256": "44391a5241a62e0083c1a8899a71e69a092b95aea5ba89e14062925468eceac7"
    }
}


def compute_sha256(path: Path) -> str:
    hasher = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()


def verify_file(dest: Path, expected_info: dict) -> bool:
    if not dest.exists():
        return False
    size = dest.stat().st_size
    if size != expected_info["size"]:
        print(f"[AVISO] Tamanho divergente para {dest.name}: {size} bytes (esperado: {expected_info['size']})")
        return False
    actual_hash = compute_sha256(dest)
    if actual_hash != expected_info["sha256"]:
        print(f"[AVISO] SHA-256 divergente para {dest.name}: {actual_hash} (esperado: {expected_info['sha256']})")
        return False
    return True


def download_file(filename: str, info: dict, dest: Path):
    if verify_file(dest, info):
        print(f"[OK] Arquivo verificado e integro: {filename} ({round(dest.stat().st_size / 1024 / 1024, 2)} MB | SHA-256 verificado)")
        return

    url = info["url"]
    print(f"[*] Baixando {filename} da revisao imutavel {HF_COMMIT[:8]}...")
    try:
        def reporthook(count, block_size, total_size):
            if total_size > 0:
                percent = int(count * block_size * 100 / total_size)
                mb = round(count * block_size / 1024 / 1024, 1)
                total_mb = round(total_size / 1024 / 1024, 1)
                sys.stdout.write(f"\r    Progresso: {percent}% ({mb}/{total_mb} MB)")
                sys.stdout.flush()

        urllib.request.urlretrieve(url, dest, reporthook=reporthook)
        sys.stdout.write("\n")
        
        # Validacao estrita de integridade pos-download
        if not verify_file(dest, info):
            if dest.exists():
                dest.unlink()
            raise ValueError(f"Checksum SHA-256 ou tamanho invalido apos download de {filename}")

        print(f"[CONCLUIDO] {filename} baixado e verificado com sucesso ({round(dest.stat().st_size / 1024 / 1024, 2)} MB).")
    except Exception as e:
        print(f"\n[ERRO] Falha ao baixar {filename}: {e}")
        if dest.exists():
            dest.unlink()
        raise


def validate_config_labels(config_path: Path) -> dict:
    with open(config_path, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    id2label = cfg.get("id2label", {})
    expected = {"0": "contradiction", "1": "entailment", "2": "neutral"}
    # Normaliza chaves para str
    normalized = {str(k): v.lower() for k, v in id2label.items()}
    if normalized != expected:
        raise ValueError(f"Mapeamento id2label inesperado no config.json: {normalized} (esperado: {expected})")
    print("[OK] Mapeamento de rotulos id2label validado com sucesso a partir de config.json.")
    return normalized


def generate_manifest(manifest_path: Path, artifacts: dict, labels: dict):
    manifest = {
        "model_id": HF_REPO,
        "commit_sha": HF_COMMIT,
        "pinned_revision": HF_COMMIT,
        "verified_at": datetime.now(timezone.utc).isoformat(),
        "hardware_invariant": "100% CPU Execution Provider (0 MB VRAM)",
        "quantization": "INT8 / UINT8 AVX2",
        "labels": labels,
        "artifacts": {
            name: {
                "size_bytes": info["size"],
                "sha256": info["sha256"],
                "status": "verified"
            }
            for name, info in artifacts.items()
        }
    }
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"[OK] Manifest criptografico salvo em {manifest_path.name}.")


def main():
    print("=" * 70)
    print("PCL AEOS LAYA - Provisionamento Criptograficamente Pinado de Modelo NLI")
    print(f"Modelo: {HF_REPO}")
    print(f"Revisao Imutavel (Commit): {HF_COMMIT}")
    print(f"Destino: {MODEL_DIR}")
    print("Invariante: 0 MB VRAM | CPUExecutionProvider")
    print("=" * 70)

    for filename, info in EXPECTED_ARTIFACTS.items():
        dest_path = MODEL_DIR / filename
        download_file(filename, info, dest_path)

    config_path = MODEL_DIR / "config.json"
    labels = validate_config_labels(config_path)

    manifest_path = MODEL_DIR / "manifest.json"
    generate_manifest(manifest_path, EXPECTED_ARTIFACTS, labels)

    print("\n[SUCESSO] Todos os artefatos neurais foram verificados (SHA-256 e tamanho) e estao prontos!")


if __name__ == "__main__":
    main()
