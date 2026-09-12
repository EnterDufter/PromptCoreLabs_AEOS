# ADR-0008: Governança de Persistência de Volumes Docker e Prevenção de Isolamento de Namespace

* **Status**: Accepted
* **Data**: 12/09/2026
* **Decisores**: Arquitetura PCL AEOS & Cortex Intelligence
* **Domínio**: Infraestrutura, Docker Compose, Banco de Dados, Persistência de Estado

---

## 1. Contexto e Problema

Em 12/09/2026, durante a transição e execução do arquivo de orquestração `docker-compose.aeos.yml` com a diretiva `name: pcl-aeos`, o Docker Compose passou a isolar os volumes da aplicação criando namespaces limpos (`pcl-aeos_db-data`, `pcl-aeos_omniroute-data`, `pcl-aeos_paperclip-storage`).

Como consequência:
1. O banco de dados PostgreSQL (`pcl-db`) subiu em uma instância totalmente limpa (zerada), resultando no desacoplamento temporário da empresa principal **Prompt Core Labs (`PROAA`)** e da conta de usuário administrador (`edu.machado@gmail.com`).
2. O serviço Paperclip inicializou em modo onboarding criando uma empresa genérica de fallback (`TES`), gerando erros de acesso em rotas históricas como `/PROAA/dashboard`.

---

## 2. Decisão Arquitetural

Fica estabelecido como regra de arquitetura imutável para o ecossistema **PCL AEOS**:

1. **Mapeamento Obrigatório de Volumes Externos**:
   Todos os arquivos `docker-compose*.yml` da infraestrutura devem obrigatoriamente declarar os volumes com a sinalização `external: true` e seus nomes reais legados de persistência no host:

   ```yaml
   volumes:
     db-data:
       external: true
       name: promptcore_labs_db-data
     omniroute-data:
       external: true
       name: promptcore_labs_omniroute-data
     paperclip-storage:
       external: true
       name: promptcore_labs_paperclip-storage
   ```

2. **Trava de Segurança do Agente (Agent Rule)**:
   Criada a regra `.agents/rules/infrastructure-persistence.md` que é carregada automaticamente pela IA assistente em todas as sessões de trabalho, garantindo que o agente recuse alterar nomes de projetos ou volumes sem prescrever o mapeamento dos volumes externos legados.

3. **Checklist de Integridade de Estado**:
   Antes de qualquer alteração de infraestrutura, deve-se validar a persistência da tabela `companies` com o registro `PROAA` e a tabela `public.user`.

---

## 3. Consequências e Validação

* **Vantagens**:
  * **Imunidade contra Perda de Estado**: Garante que trocas de arquivos compose ou comandos `docker compose down` jamais desconectem o banco de dados de produção local.
  * **Consistência de Agente de IA**: O assistente Antigravity / Cortex consulta automaticamente a regra em `.agents/rules/infrastructure-persistence.md` antes de efetuar comandos no Docker.
  * **Segurança Zero-Loss**: Dados de empresas, agents, logs e chats permanecem imutáveis e protegidos.
