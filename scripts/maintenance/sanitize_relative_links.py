"""
PCL AEOS — Higienizador Canônico de Links e Portabilidade (Achado P2 / Frente D)
Converte caminhos absolutos 'file:///c:/PromptCore_Labs/...' em caminhos relativos ao repositório.
"""

import os
import re
import sys

REPO_ROOT = os.path.abspath(r"C:\PromptCore_Labs")

# Arquivos mapeados para higienização de caminhos absolutos
TARGET_FILES = [
    r"specs\pcl-aeos-evolution\spec-pcl-aeos-temporal-graph-rag-and-reconciliation.md",
    r"projects\pcl-aeos-harmonization\foundation-readiness.md",
    r"projects\pcl-aeos-harmonization\design\claims-register.md",
    r"projects\pcl-aeos-harmonization\design\normative-hierarchy.md",
    r"projects\pcl-aeos-harmonization\design\canonical-architecture.md",
    r"projects\Living Architecture PCL AEOS\docs\strategy\README.md",
    r"projects\Living Architecture PCL AEOS\docs\governance\README.md",
    r"projects\Living Architecture PCL AEOS\docs\security-compliance\README.md",
    r"projects\Living Architecture PCL AEOS\docs\runtime\README.md",
    r"projects\Living Architecture PCL AEOS\docs\infrastructure\README.md",
    r"projects\Living Architecture PCL AEOS\docs\integrations-mcp\README.md",
    r"projects\Living Architecture PCL AEOS\docs\legacy-migration\README.md",
    r"projects\Living Architecture PCL AEOS\docs\memory-rag\legacy-migration.md",
    r"projects\Living Architecture PCL AEOS\docs\memory-rag\README.md",
    r"projects\Living Architecture PCL AEOS\docs\agents-squads\README.md",
    r"projects\Living Architecture PCL AEOS\docs\adrs\ADR-006-tripartite-memory-drp-cloudflare.md",
    r"legacy-migration.md",
    r"knowledge\patterns\adr-pattern.md",
    r"knowledge\patterns\mcp-server-architecture.md",
    r"governance\operating-model.md",
    r"architecture\architecture-map.md"
]

def sanitize_link(match, file_dir):
    full_url = match.group(0)
    # Extrai o caminho local após file:///c:/PromptCore_Labs ou file:///C:/PromptCore_Labs
    pattern = r"file:\/\/\/[cC]:\/PromptCore_Labs\/?([^\)\s\"'>]*)"
    m = re.search(pattern, full_url, re.IGNORECASE)
    if not m:
        return full_url
    
    target_rel_to_repo = m.group(1).replace("%20", " ")
    target_abs = os.path.normpath(os.path.join(REPO_ROOT, target_rel_to_repo))
    
    # Calcula caminho relativo a partir do diretório do arquivo fonte
    rel_path = os.path.relpath(target_abs, file_dir).replace("\\", "/")
    if not rel_path.startswith("."):
        rel_path = "./" + rel_path
        
    # Re-aplica encoding para espaços se o original usava
    if "%20" in full_url:
        rel_path = rel_path.replace(" ", "%20")
        
    return rel_path

def process_file(rel_file_path):
    abs_path = os.path.join(REPO_ROOT, rel_file_path)
    if not os.path.exists(abs_path):
        print(f"[SKIP] Arquivo não encontrado: {rel_file_path}")
        return 0

    file_dir = os.path.dirname(abs_path)
    with open(abs_path, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r"file:\/\/\/[cC]:\/PromptCore_Labs\/?[^\)\s\"'>]*"
    matches = list(re.finditer(pattern, content, re.IGNORECASE))
    if not matches:
        return 0

    new_content = re.sub(pattern, lambda m: sanitize_link(m, file_dir), content, flags=re.IGNORECASE)

    with open(abs_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"[OK] {rel_file_path}: {len(matches)} caminhos absolutos convertidos em relativos.")
    return len(matches)

def main():
    print("=" * 70)
    print("PCL AEOS — HIGIENIZAÇÃO DE CAMINHOS LOCAIS E PORTABILIDADE")
    print("=" * 70)
    total_conversions = 0
    for rel_path in TARGET_FILES:
        total_conversions += process_file(rel_path)
    print("-" * 70)
    print(f"Total de ocorrências absolutas higienizadas: {total_conversions}")
    print("=" * 70)

if __name__ == "__main__":
    main()
