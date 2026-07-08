==================================================
OBJETIVO
==================================================

Prover a visão arquitetural detalhada da topologia de rede, serviços de contêineres e mapeamento de volumes do Harness local do PromptCoreLabs_AEOS.

==================================================
TOPOLOGIA DE SERVIÇOS (DOCKER)
==================================================

O Harness local é composto por três contêineres principais orquestrados via docker-compose:

1. Banco de Dados (pcl-db)
   • Imagem: postgres:17-alpine
   • Porta interna/externa: 5432
   • Responsabilidade: armazenamento persistente de dados relacionais para o PaperClip.
   • Volume: db-data:/var/lib/postgresql/data (persistência nomeada do Docker).

2. Gateway de IA (pcl-omniroute)
   • Imagem: omniroute:cli
   • Porta interna/externa: 20130
   • Responsabilidade: gateway unificado de roteamento de modelos de IA e controle de cotas (EBITDA Shield).
   • Volume: omniroute-data:/var/lib/omniroute.
   • Arquivo de ambiente: ./OmniRoute/.env.

3. Painel de Controle e Agentes (pcl-paperclip)
   • Imagem: construída a partir de ./PaperClip/Dockerfile
   • Porta interna/externa: 3100
   • Dependências: db e omniroute (aguarda a inicialização de ambos).
   • Responsabilidade: dashboard visual, execução de agent swarms e automações do ecossistema.
   • Volumes:
     - paperclip-storage:/app/storage
     - ./PaperClip-Companies:/app/companies (mapeamento físico de dados sensíveis).
   • Arquivo de ambiente: ./PaperClip/.env.

==================================================
DIAGRAMA DE REDE LOCAL
==================================================

Os contêineres operam na mesma rede de ponte (default bridge) criada pelo Docker Compose, permitindo resolução de DNS interno:

[ Host Machine ]
      │
      ├── (Porta 3100)  ──► [ Container: pcl-paperclip ] (painel de controle)
      │                            │
      │                            ├── (DNS: db:5432)        ──► [ Container: pcl-db ]
      │                            └── (DNS: omniroute:20130) ──► [ Container: pcl-omniroute ]
      │
      ├── (Porta 20130) ──► [ Container: pcl-omniroute ]
      └── (Porta 5432)  ──► [ Container: pcl-db ]

==================================================
INTEGRAÇÃO DE MODELOS LOCAIS (HOST ACCESS)
==================================================

Quando o container `pcl-omniroute` necessita de acesso aos provedores locais rodando no Host (LM Studio na porta 1234 ou Ollama na porta 11434):

• A comunicação é roteada através do DNS especial do Docker:
  http://host.docker.internal:[porta]
• Isso permite que os contêineres acessem a GPU dedicada (RTX 3050) da máquina host física.

==================================================
SEGURANÇA DE DADOS
==================================================

O mapeamento de volume `./PaperClip-Companies:/app/companies` no `pcl-paperclip` garante que todos os dados empresariais permaneçam armazenados de forma persistente e visível diretamente no sistema de arquivos do Host. Isso assegura que nenhuma informação sensível de clientes e projetos seja perdida ou armazenada dentro de camadas de contêineres efêmeras.

==================================================
FONTES DE REFERÊNCIA
==================================================

docker-compose.yml

PCL_INFRA_STACK_v2.md
