# Padrão Arquitetural: Integração Gemini NotebookLM no PCL AEOS

## Visão Geral

No **PromptCore Labs (AEOS)**, o **Gemini NotebookLM** atua como a **Camada de Síntese de Conhecimento e Inteligência de Documentos Longos**, operando em perfeita sinergia com o RAG de memória local (`memory/rag/`).

```text
Foundation ➔ Governance ➔ Bootstrap ➔ Knowledge / Memory ➔ Agents ➔ Integrations / MCP
```

---

## 1. Responsabilidade Arquitetural do Gemini NotebookLM

Ao contrário da busca por código ou vetores locais, o Gemini NotebookLM serve para:
1. **Compreensão de Documentos Extensos**: Transcrições de reuniões, análises de mercado, especificações complexas e relatórios corporativos.
2. **Síntese Executiva para Agentes**: Geração de **Briefing Docs, FAQs, Guia de Estudos (Study Guides) e Audio Overviews**.
3. **Embasamento para SDD (Spec-Driven Development)**: Suporte aos agentes `Strategist_One` e `Lead_TLC_Engineer` na fase de elaboração do `specify.md` e `design.md`.

---

## 2. Ferramentas Expostas pelo MCP Server (`mcp/gemini-notebooklm`)

| Ferramenta MCP | Descrição | Utilizado Por |
| :--- | :--- | :--- |
| `notebooklm_list_notebooks` | Consulta os cadernos e fontes ativas no catálogo do repositório. | `Strategist_One`, `CEO` |
| `notebooklm_query_notes` | Realiza consultas semânticas e busca notas de síntese. | Squad Completa |
| `notebooklm_sync_knowledge` | Indexa novos documentos markdown das camadas `knowledge/` e `memory/`. | `Builder`, `Reviewer_QA` |
| `notebooklm_export_briefing` | Gera resumos executivos, roteiros e especificações de Audio Overview. | `Neuromarketing_Strategist`, `RevOps_Architect` |

---

## 3. Segurança & Soberania de Dados

- **Zero Segredos no Código**: O servidor MCP consome credenciais estritamente via variáveis de ambiente (`GEMINI_NOTEBOOKLM_TOKEN` / `GEMINI_API_KEY`).
- **Indexação Controlada**: Apenas documentos das camadas autorizadas (`knowledge/`, `memory/`, `.specs/`) são marcados para sincronização via manifesto local `memory/context/notebooklm-catalog.json`.
