# Regra de Governança de Infraestrutura e Persistência de Dados (PCL AEOS)

## Requisitos Críticos de Infraestrutura Docker e Volumes

1. **Vinculação Obrigatória de Volumes Externos Persistidos:**
   - Ao modificar ou criar qualquer arquivo `docker-compose*.yml` (ex: `docker-compose.aeos.yml`), NUNCA crie declarações de volumes locais limpos sem mapeamento explícito para os volumes persistentes legados do ecossistema:
     * `db-data` -> `external: true`, `name: promptcore_labs_db-data`
     * `omniroute-data` -> `external: true`, `name: promptcore_labs_omniroute-data`
     * `paperclip-storage` -> `external: true`, `name: promptcore_labs_paperclip-storage`

2. **Prevenção contra Isolamento por Nome de Projeto Compose:**
   - O uso da diretiva `name: <projeto>` no Docker Compose (ex: `name: pcl-aeos`) altera o namespace padrão.
   - SEMPRE mantenha o mapeamento dos volumes nomeados com `external: true` para impedir que o Docker Compose inicialize bancos de dados PostgreSQL ou contêineres zerados em volumes paralelos não mapeados.

3. **Verificação Pré-Execução (Pre-Flight Check):**
   - Antes de executar comandos destrutivos ou de recriação como `docker compose down -v` ou alterações de schema/compose:
     * Verifique a integridade da tabela `companies` (garantindo que a empresa ativa `Prompt Core Labs` / `PROAA` esteja presente).
     * Garanta que os usuários cadastrados (`public.user`) não sejam descartados.

4. **Gerenciamento de Servidores de Desenvolvimento (Next.js / Port 3011):**
   - Lembre-se que a Landing Page (`http://localhost:3011`) é mantida via dev server Node.js (`npm run dev -- -p 3011`). Se a porta recusar conexão, o servidor de dev deve ser reiniciado no diretório `projects/PromptCoreLabs_Landing_Page v2/website`.
