==================================================
OBJETIVO
==================================================

Prover as instruções operacionais de gerenciamento, comandos e controle do ciclo de vida dos contêineres do Harness local através do Docker Compose.

==================================================
COMANDOS OPERACIONAIS PRINCIPAIS
==================================================

Os comandos abaixo devem ser executados no terminal Host a partir do diretório raiz:

c:\PromptCore_Labs

1. Iniciar o Harness Completo (Modo Background)
   docker compose up -d

   • O parâmetro -d garante que os serviços rodem em segundo plano.
   • A imagem do PaperClip será construída na primeira execução.

2. Parar o Harness (Preservando Volumes)
   docker compose down

   • Para e remove os contêineres e a rede virtual.
   • Os volumes db-data, omniroute-data e os arquivos físicos de PaperClip-Companies NÃO são afetados.

3. Visualizar Logs em Tempo Real
   • Todos os serviços:
     docker compose logs -f
   • Apenas um serviço específico (ex: paperclip):
     docker compose logs -f paperclip

4. Reiniciar Serviços
   docker compose restart [nome-do-servico]

==================================================
GUIA DE MANUTENÇÃO E SOLUÇÃO DE ERROS
==================================================

Reconstrução Total do Container PaperClip:
Caso haja atualizações no código fonte em `./PaperClip`, force a reconstrução da imagem:
docker compose build --no-cache paperclip
docker compose up -d --force-recreate paperclip

Resolução de Erro de Permissão de Volumes (Postgres):
Se o contêiner `pcl-db` falhar na inicialização devido a permissões de disco, remova o volume associado e reinsira (isso apagará a base local de desenvolvimento):
docker compose down -v
docker compose up -d

Remoção de Contêineres Órfãos:
Se houver mudança de estrutura no docker-compose.yml, limpe os contêineres antigos:
docker compose down --remove-orphans

==================================================
VARIÁVEIS DE AMBIENTE OPERACIONAIS
==================================================

As configurações e segredos são controlados pelos arquivos `.env` locais:

• ./OmniRoute/.env: contém chaves de API dos provedores de nuvem (Gemini, Claude, OpenAI) e configurações de roteamento.
• ./PaperClip/.env: chaves de segurança da aplicação de automação e dados de banco de dados.

==================================================
FONTES DE REFERÊNCIA
==================================================

docker-compose.yml

runtime/harness/overview.md
