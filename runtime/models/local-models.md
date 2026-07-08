==================================================
OBJETIVO
==================================================

Prover instruções detalhadas para configuração, execução e integração de Modelos Locais (LM Studio e Ollama) no Harness do PromptCoreLabs_AEOS.

Modelos locais garantem processamento de baixo custo e soberania de dados para o TIER-3.

==================================================
1. LM STUDIO (HEAVY CODING LOCAL)
==================================================

O LM Studio é utilizado para executar modelos locais de grande porte voltados a desenvolvimento e codificação massiva.

Configuração Padrão:
• Modelo Recomendado: Qwen3-Coder-30B (ou versão otimizada equivalente).
• Hardware Alvo: GPU dedicada Nvidia (RTX 3050 4GB/8GB ou superior).
• Configuração de Servidor Local:
  - Habilitar o servidor local HTTP na porta 1234.
  - URL de endpoint local: http://localhost:1234/v1
  - Offload de GPU (GPU Offload) configurado no máximo de camadas suportadas pela VRAM para otimizar velocidade de resposta.

==================================================
2. OLLAMA (AUDITORIA E CLI LOCAL)
==================================================

O Ollama é utilizado para tarefas de CLI rápidas, parsing de dados leves e auditoria de logs locais devido à sua velocidade e facilidade de deploy em segundo plano.

Configuração Padrão:
• Modelo Recomendado: Gemma 3 4B (ou gemma3:4b).
• Porta Padrão do Servidor: 11434.
• URL de endpoint local: http://localhost:11434

Comandos Operacionais:

1. Baixar o modelo de auditoria:
   ollama pull gemma3:4b

2. Executar o modelo interativamente:
   ollama run gemma3:4b

3. Listar modelos locais disponíveis:
   ollama list

==================================================
INTEGRAÇÃO COM O DOCKER COMPOSE
==================================================

Os servidores locais do LM Studio e do Ollama rodam diretamente no sistema Host para ter acesso total aos drivers de GPU (CUDA).

Para os contêineres Docker (OmniRoute e PaperClip) se comunicarem com os serviços do host:

• Endereço LM Studio: http://host.docker.internal:1234
• Endereço Ollama: http://host.docker.internal:11434

Certifique-se de que os softwares locais estejam configurados para aceitar conexões vindas de todos os IPs (ligados à interface 0.0.0.0 e não apenas 127.0.0.1).

==================================================
FONTES DE REFERÊNCIA
==================================================

PCL_INFRA_STACK_v2.md

runtime/harness/overview.md

bootstrap/environment/setup.md
