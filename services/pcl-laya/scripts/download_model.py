#!/usr/bin/env python3
"""
PCL AEOS - Script de Download do Modelo ONNX Neural Laya
Modelo Canônico: cross-encoder/nli-MiniLM-2-L6-H768
Quantização: INT8 / UINT8 AVX2 (~78 MB)
Hardware Invariant: 100% CPU Execution Provider (0 MB VRAM)
"""

import os
import sys
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models" / "nli-minilm"
MODEL_DIR.mkdir(parents=True, exist_ok=True)

HF_REPO = "cross-encoder/nli-MiniLM2-L6-H768"
FILES = {
    "config.json": f"https://huggingface.co/{HF_REPO}/raw/main/config.json",
    "tokenizer.json": f"https://huggingface.co/{HF_REPO}/raw/main/tokenizer.json",
    "model.onnx": f"https://huggingface.co/{HF_REPO}/resolve/main/onnx/model_quint8_avx2.onnx",
}

def download_file(url: str, dest: Path):
    if dest.exists() and dest.stat().st_size > 1000:
        print(f"[OK] Arquivo ja existe: {dest.name} ({round(dest.stat().st_size / 1024 / 1024, 2)} MB)")
        return

    print(f"[*] Baixando {dest.name} de {url}...")
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
        print(f"[CONCLUIDO] {dest.name} salvo com sucesso ({round(dest.stat().st_size / 1024 / 1024, 2)} MB).")
    except Exception as e:
        print(f"\n[ERRO] Falha ao baixar {dest.name}: {e}")
        if dest.exists():
            dest.unlink()
        raise

def main():
    print("=" * 60)
    print("PCL AEOS LAYA - Preparação de Modelo Neural NLI")
    print(f"Modelo: {HF_REPO}")
    print(f"Destino: {MODEL_DIR}")
    print("Invariante: 0 MB VRAM | CPUExecutionProvider")
    print("=" * 60)

    for filename, url in FILES.items():
        dest_path = MODEL_DIR / filename
        download_file(url, dest_path)

    print("\n[SUCESSO] Todos os artefatos neurais do Laya estao prontos para inferencia em CPU!")

if __name__ == "__main__":
    main()
