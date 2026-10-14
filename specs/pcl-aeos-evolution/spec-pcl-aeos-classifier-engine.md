# SPEC-PCL-AEOS-CLASSIFIER-01: PCL Triage & System 1 Classifier Engine Specification

**Versão:** 2.0-Agnostic  
**Status:** Approved for Implementation (Ports & Adapters Architecture)  
**Autor:** Forward Deployed Architecture (FDA) / PCL AI Squad  
**Escopo:** OmniRoute AI Gateway (:20130), Antigravity IDE, PCL Core Engine  
**Padrão Arquitetural:** Hexagonal Architecture (Ports & Adapters) / Strategy Pattern  
**Normas de Governança:** ISO/IEC 27001 & ISO/IEC 42001  

---

## 1. Diretriz Arquitetural: Abstração & Independência de Provedor

Para garantir que o **PCL AEOS** permaneça um Sistema Operacional de IA Soberano e totalmente agnóstico, o componente de decisão e triagem ultra-rápida é especificado como um **Porto de Classificação do Sistema 1 (`PCL Classifier Port`)**.

A arquitetura do AEOS **não depende de um fornecedor único**. O contrato de interface é genérico e permite plugar diferentes **Provedores de Classificação (Classifier Adapters)** conforme a necessidade do projeto de cada cliente.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 PCL AEOS CORE / HARNESS                                │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                  REST / gRPC Interface
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        OMNIROUTE AI GATEWAY (:20130)                                   │
│                        `/v1/classifier/evaluate`                                       │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ PCL CLASSIFIER PORT (CONTRATO ABSTRATO)                                          │  │
│  │  - Primitivas: `binary` (no/nul), `choice` (enum), `score` (numeric)             │  │
│  │  - SLA de Latência: < 100ms                                                       │  │
│  │  - Saída Tipada & Custo Marginal de Output = $0.00                               │  │
│  └───────────────────────────────────────┬──────────────────────────────────────────┘  │
│                                          │                                             │
│                  ┌───────────────────────┼───────────────────────┐                     │
│                  │ (Default)             │ (Alternative)         │ (Fallback)          │
│                  ▼                       ▼                       ▼                     │
│  ┌────────────────────────┐  ┌───────────────────────┐  ┌──────────────────────────┐ │
│  │ Provider Adapter: JEV  │  │ Provider Adapter:     │  │ Provider Adapter:        │ │
│  │ (TypeSafe AI)          │  │ Local Rust Classifier │  │ Structured LLM Fallback  │ │
│  └────────────────────────┘  └───────────────────────┘  └──────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Contrato da Interface Abstrata (`PCL Classifier Port`)

Qualquer provedor de classificação integrado ao PCL AEOS deve implementar rigorosamente as três primitivas determinísticas abaixo:

1. **`evaluate_binary(state, query) -> { result: boolean, confidence: float }`**
   - Respostas estritas de sim/não ou verdadeiro/falso sem geração de texto.
2. **`evaluate_choice(state, query, options[]) -> { selected: string, confidence: float }`**
   - Seleção determinística dentre uma lista fixa de opções.
3. **`evaluate_score(state, query, min, max) -> { score: float, confidence: float }`**
   - Atribuição de pontuação numérica dentro de um intervalo calibrado.

### Requisitos Inegociáveis do Porto
- **Latência:** Resposta entre **50ms e 200ms**.
- **Segurança de Tipos (Type Safety):** Garantia absoluta de conformidade ao schema JSON, eliminando quebras de pipeline e alucinações de texto.
- **EBITDA Shield / Economia de Tokens:** Isenção de cobrança de tokens de saída (*zero output token generation*).

---

## 3. Mapeamento de Provedores (Adapters)

### **3.1. Provedor Padrão (Reference Implementation): JEV (TypeSafe AI)**
- **Descrição:** Modelo do Sistema 1 treinado por RLCD (Reinforcement Learning for Calibrated Decisions) da TypeSafe AI [102, 104].
- **Caso de Uso no AEOS:** Triagem primária de prompts no Antigravity IDE, classificação de intenções em milissegundos e guardrails pré-execução [119, 161].
- **Custo:** \$0.042 / 1M input tokens. \$0.00 output.

### **3.2. Provedor Alternativo A: Local Compiled Classifier (Rust / ONNX)**
- **Descrição:** Classificador embarcado compilado em Rust rodando via ONNX Runtime diretamente no contêiner local do AEOS [33, 112].
- **Caso de Uso:** Ambiência de borda com *air-gap* total ou requisitos de latência <20ms (ex: detecção de fraudes ou filtros de segurança pesados).

### **3.3. Provedor Alternativo B: Cloud Enterprise Structured Classifier**
- **Descrição:** Adaptador para saídas estruturadas via Amazon Bedrock, Google Vertex AI ou OpenAI Structured Outputs.
- **Caso de Uso:** Clientes corporativos com restrições normativas de uso exclusivo de nuvem pública contratada.

---

## 4. Configuração no OmniRoute AI Gateway (:20130)

O OmniRoute gerencia a troca dinâmica do provedor através de variáveis de ambiente no `docker-compose.aeos.yml`:

```yaml
# Trecho de configuração no OmniRoute Gateway
OMNIROUTE_CLASSIFIER_PROVIDER: "jev" # Opções: "jev", "local_rust", "bedrock_structured"
OMNIROUTE_CLASSIFIER_JEV_API_KEY: "${JEV_API_KEY}"
OMNIROUTE_CLASSIFIER_FAILOVER_ENABLED: "true"
```

---

## 5. Próximos Passos de Integração
1. A rota `/v1/classifier/evaluate` do OmniRoute deve expor a interface genérica.
2. O Antigravity IDE chamará o endpoint agnóstico, sem acoplamento direto com a SDK do JEV.
