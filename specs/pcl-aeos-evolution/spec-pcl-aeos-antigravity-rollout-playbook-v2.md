# PLAYBOOK-PCL-AEOS-ROLLOUT-04: Playbook de Execução & Gap Analysis para Antigravity IDE

**Versão:** 2.0-Execution & Sync  
**Status:** Ready for Antigravity IDE & PCL Cortex Execution  
**Papel de Destino:** Forward Deployed Engineer (FDE) / Antigravity IDE Agent Harness / PCL Cortex Engine  
**Escopo:** Confronto de Arquitetura, Adequação do Repositório PCL_AEOS, Deploy Local Docker, Sincronização de Repositórios e Atualização da Documentação Pública  

---

## 1. Instruções Gerais para o Antigravity IDE (FDE Execution)

Você está atuando como o **Forward Deployed Engineer (FDE)** responsável por executar a adequação do repositório **PromptCoreLabs_AEOS** às novas especificações agnósticas de arquitetura.

Seu objetivo é realizar um **Gap Analysis** (confrontar o estado atual do repositório com as especificações), aproveitar tudo o que já está configurado no OmniRoute local, declarar a infraestrutura do **PCL Extended Memory Agent** e do **PCL Classifier Engine** com isolamento no Docker local e proteção via Cloudflare Tunnel, e **sincronizar de forma integral o repositório e a documentação pública**.

---

## 2. Roteiro de Execução Passo a Passo

### **Passo 1: Audit & Gap Analysis do OmniRoute Gateway (:20130)**
1. Inspecione a pasta do OmniRoute Gateway no repositório (`/docker/omniroute` ou equivalente).
2. Verifique se a rota `/v1/classifier/evaluate` está exposta e se o suporte ao **Laya System One (MCP Server e microsserviço :20140)** como motor soberano de classificação do Sistema 1 está habilitado.
3. Garanta que o contrato do **PCL Classifier Port** (`spec-pcl-aeos-classifier-engine.md`) seja respeitado:
   - Respostas das primitivas em tempo < 100ms.
   - Retorno estruturado em JSON com custo $0.00 de saída de tokens.

### **Passo 2: Declaração do Container `pcl-agent-extended-memory` no Docker**
1. Abra o arquivo `docker-compose.aeos.yml` do repositório.
2. Adicione a declaração do serviço de agente autônomo de segundo plano (`pcl-agent-extended-memory`), utilizando a imagem do **Hermes Agent** como provedor de referência (*Default Reference Adapter*):
   ```yaml
   pcl-agent-extended-memory:
     image: nousresearch/hermes-agent:latest # Reference Adapter
     container_name: pcl-agent-extended-memory
     restart: unless-stopped
     environment:
       - OPENAI_BASE_URL=http://pcl-omniroute:20130/v1
       - OPENAI_API_KEY=sk-pcl-omniroute-sovereign
       - CLASSIFIER_ENDPOINT=http://pcl-omniroute:20130/v1/classifier/evaluate
       - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
       - SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN}
     volumes:
       - ./data/agent_memory:/root/.hermes/memory
       - ./data/agent_skills:/root/.hermes/skills
       - ./.agent/skills:/workspace/antigravity_skills
     networks:
       - aeos-internal-network
   ```

### **Passo 3: Configuração do Cloudflare Tunnel (`cloudflared`) Local**
1. Adicione o serviço `cloudflared` no mesmo `docker-compose.aeos.yml`:
   ```yaml
   cloudflared:
     image: cloudflare/cloudflared:latest
     container_name: pcl-cloudflare-tunnel
     restart: unless-stopped
     command: tunnel --no-autoupdate run
     environment:
       - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
     networks:
       - aeos-internal-network
   ```
2. Isso garantirá que webhooks de canais externos (Slack, Telegram, WhatsApp) cheguem ao seu Docker local de forma criptografada sem abrir portas no roteador.

### **Passo 4: Sincronização de Skills com a Pasta do Antigravity IDE**
1. Garanta que qualquer arquivo `.md` de habilidade gerado em `./data/agent_skills/` seja espelhado ou copiado para a pasta `.agent/skills/` do Antigravity.
2. Submeta as novas habilidades à verificação do **Stage Gate 4 (Validate)** conforme a governança TLC v3 do PCL AEOS.

### **Passo 5: Sincronização de Repositórios e Atualização Integral da Documentação (PCL Cortex)**
1. **Sincronização & Git Commit**:
   - Realize o commit e a sincronização das alterações no repositório `PromptCoreLabs_AEOS` e em quaisquer submódulos/repositórios correlatos afetados pela adequação agnóstica.
2. **Atualização da Documentação Pública (GitHub Pages)**:
   - Ordene ao **PCL Cortex Engine** a compilação e atualização integral do portal de documentação hospedado em `https://enterdufter.github.io/PromptCoreLabs_AEOS/#`.
   - Atualize os esquemas de arquitetura, contratos de API (`PCL Classifier Engine`, `PCL Extended Memory Agent`, `PCL Pluggable Orchestrator`) e guias de implantação no repositório de docs (`/docs` ou branch `gh-pages`).
   - Garanta a total coerência entre o código implantado no Antigravity e a documentação pública oficial.

---

## 3. Critérios de Sucesso da Execução
- [ ] Gap Analysis concluído sem sobrescrever configurações existentes do OmniRoute local.
- [ ] O Antigravity IDE consegue disparar chamadas para `http://localhost:20130/v1` com triagem pelo Classificador.
- [ ] O container `pcl-agent-extended-memory` sobe com sucesso no Docker local.
- [ ] O Cloudflare Tunnel estabelece conexão de borda segura.
- [ ] Sincronização completa realizada nos repositórios relevantes.
- [ ] Documentação do site oficial (`https://enterdufter.github.io/PromptCoreLabs_AEOS/#`) atualizada de forma integral pelo PCL Cortex Engine.
