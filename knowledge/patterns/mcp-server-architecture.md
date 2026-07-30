# Padrão Arquitetural: Divisão e Escopo de MCP Servers no PCL AEOS

## Visão Geral

No ecossistema **PromptCore Labs (AEOS)**, o **Model Context Protocol (MCP)** é organizado seguindo a estratégia de **Escopo Híbrido** para garantir **soberania de dados**, **portabilidade de repositório** e **segurança de credenciais**.

---

## 1. Escopo Global da IDE (`C:\Users\<user>\.gemini\...`)

### Quando Utilizar?
- **Ferramentas Transversais de Terceiros**: Utilitários gerais da IDE que são compartilhados entre múltiplos projetos sem ligação exclusiva a um repositório (ex: `StitchMCP`, `visualization`, `context`).
- **Credenciais de Desenvolvedor Pessoal**: Serviços que exigem tokens pessoais vinculados ao perfil do desenvolvedor (ex: `STITCH_API_KEY`).

### Benefícios:
- Configuração única por máquina.
- Impede a exposição acidental de chaves de API de terceiros nos commits do Git.

---

## 2. Escopo do Workspace / Repositório (`c:\PromptCore_Labs\mcp\`)

### Quando Utilizar?
- **Lógica e Dados Proprietários do Projeto**: Servidores MCP que acessam bancos de dados (`pcl-db` / Postgres, SQLite local), esquemas de especificações (`.specs/`) ou microsserviços internos.
- **Ferramentas Customizadas do AEOS**: Scripts do **PCL Cortex Micro-Loop**, validadores de SDD ou integrações diretas com o OmniRoute/PaperClip.
- **Garantia de Portabilidade no Git**: Ao clonar o repositório (`git clone`), o novo ambiente já possui todos os servidores MCP do projeto versionados.

### Estrutura de Diretórios do Repositório:
```text
c:\PromptCore_Labs\
├── mcp/
│   └── pcl-cortex/           <-- Servidor MCP local (Node.js/ESM)
│       ├── package.json
│       └── src/index.js
├── .agents/
│   └── mcp/                  <-- Ferramentas e extensões de apoio aos Agentes
├── mcp.config.json           <-- Manifesto declarativo de registro dos MCPs do repositório
```

---

## 3. Manifesto `mcp.config.json`

O arquivo [`mcp.config.json`](file:///c:/PromptCore_Labs/mcp.config.json) na raiz do repositório registra os servidores locais:

```json
{
  "mcpServers": {
    "pcl-cortex": {
      "command": "node",
      "args": ["./mcp/pcl-cortex/src/index.js"],
      "env": {
        "OMNI_ROUTE_URL": "http://localhost:20130"
      }
    }
  }
}
```
