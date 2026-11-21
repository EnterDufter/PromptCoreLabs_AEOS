# Requisitos Legais & Copy de Interface (Onda 1) — Next Gen Sports (NGS)

**Data:** 2026-11-21  
**Responsável:** Lex Compliance (Compliance, Jurídico, GovTech, AI Academy & PeopleOps — PCL)  
**Destinatários:** `Builder UI` e `Cipher DevSec`  
**Base Canônica:** `PARECER_COMPLIANCE_LGPD_PI.md` & `.specs/specify.md` (v2.1.0-canonical)  
**Escopo:** Fluxo/Modal de Consentimento Parental (LGPD Art. 14), regras de *Privacy by Default* (< 18 anos) e *disclaimers* obrigatórios do protótipo navegável (Hub Central + 5 telas).

---

## 1. Fluxo & Modal de Consentimento Parental (LGPD Art. 14)

### 1.1 Regras de Estado & *Privacy by Default* (< 18 anos)

Para qualquer atleta cadastrado com idade inferior a 18 anos, a interface e o estado da aplicação (`Builder UI` / `Cipher DevSec`) devem aplicar obrigatoriamente:

1. **Estado Inicial Obrigatório (`Pendente Responsável`):**
   - Todo perfil `< 18 anos` nasce **privado por padrão** com a badge/status `Pendente Responsável`.
   - Enquanto estiver em `Pendente Responsável` (ou se o responsável optar por `Manter Perfil Privado`):
     - **Oculto no `Talent Network` público:** Não aparece em buscas, rankings públicos ou listagens para *scouts* e marcas.
     - **Oculto no `Sponsorship`:** Não recebe propostas, não aparece em vitrines de patrocínio e não gera Mídia-Kit público compartilhável.
     - **Compartilhamento externo bloqueado:** Botões de exportação/compartilhamento externo permanecem desabilitados.
2. **Zero Dados Sensíveis ou Biométricos:**
   - **Proibido exibir, solicitar ou simular** dados biométricos ou de saúde (frequência cardíaca, sono, VO2, peso, biometria ou histórico clínico) nas telas do protótipo (Art. 5º, II e Art. 11 LGPD).
   - Apenas **telemetria de pista não-sensível** (tempos de volta, setores, traçado), evolução na `NGS Academy` e evidências esportivas auditáveis podem compor o `Portal do Atleta` e o `Readiness Score` (0–100).
3. **Explicabilidade do `Readiness Score` (Art. 20 LGPD):**
   - O `Readiness Score` (0–100) deve exibir, ao clique/expansão, as **evidências objetivas** que compõem a nota, garantindo transparência ao atleta e ao responsável legal.
4. **Transição após Aprovação (`Autorizado pelo Responsável`):**
   - Somente após o preenchimento dos dados do responsável, marcação dos 3 checkboxes obrigatórios e clique em `Aprovar Acesso & Visibilidade`, o status muda para `Autorizado pelo Responsável`, liberando a visibilidade controlada no `Talent Network` e `Sponsorship` (com opção de revogação/retorno ao modo privado a qualquer momento).

---

### 1.2 Copy Exata do Modal de Validação do Responsável Legal (pt-BR)

#### Cabeçalho do Modal
- **Título:** `Autorização do Responsável Legal (LGPD — Art. 14)`
- **Subtítulo / Texto de Apoio:**
  > Para proteger atletas menores de 18 anos, o perfil nasce **privado por padrão** (`Pendente Responsável`). A validação de um pai, mãe ou tutor legal é obrigatória para liberar a visibilidade controlada no **Talent Network** e no módulo **Sponsorship**.

#### Campos de Identificação do Responsável (Obrigatórios para `Aprovar Acesso & Visibilidade`)
- **Nome completo do Responsável Legal** *(placeholder: `Ex.: Maria Silva Oliveira`)*
- **CPF do Responsável** *(placeholder: `000.000.000-00`)*
- **E-mail de confirmação do Responsável** *(placeholder: `responsavel@email.com`)*
- **Vínculo com o(a) atleta** *(select: `Mãe` | `Pai` | `Tutor(a) Legal`)*

#### Checkboxes Obrigatórios (Todos desmarcados por padrão)
1. `[ ]` **Consentimento para Tratamento de Dados Esportivos:** Autorizo o tratamento dos dados esportivos, educacionais (`NGS Academy`) e de telemetria não-sensível de pista do(a) menor sob minha responsabilidade para construção do `Portal do Atleta` e cálculo explicável do `Readiness Score`, ciente de que nenhum dado biométrico ou de saúde é coletado.
2. `[ ]` **Autorização de Visibilidade Controlada:** Autorizo a exibição do perfil esportivo no `Talent Network` e no módulo `Sponsorship` para descoberta por ligas, especialistas e patrocinadores, podendo revogar esta autorização e retornar o perfil ao modo privado a qualquer momento.
3. `[ ]` **Declaração de Responsabilidade Legal:** Declaro ser pai, mãe ou tutor(a) legal do(a) atleta menor de 18 anos e confirmo a leitura dos Termos de Uso e da Política de Privacidade da Next Gen Sports.

#### Botões de Ação (Rodapé do Modal)
- **Botão Primário:** `Aprovar Acesso & Visibilidade` *(habilitado somente com os 4 campos preenchidos e os 3 checkboxes marcados; altera status para `Autorizado pelo Responsável`)*.
- **Botão Secundário:** `Manter Perfil Privado` *(sempre habilitado; mantém o status `Pendente Responsável` / privado, ocultando o perfil no `Sponsorship` e no `Talent Network` público)*.

---

## 2. Disclaimers Obrigatórios das Telas (Copy Exata pt-BR)

### 2.1 Disclaimer de Conformidade — Tela `Sponsorship`
Exibir como faixa discreta ou card informativo no topo/rodapé da área de oportunidades do `Sponsorship`:

> **Aviso de Conformidade:** Este módulo realiza exclusivamente a conexão comercial direta e gestão de patrocínios esportivos entre marcas, ligas e atletas. Não constitui oferta pública de valores mobiliários, intermediação financeira regulada, captação de investimento ou gestão de incentivos fiscais.

### 2.2 Disclaimer Global — Rodapé do Protótipo (Hub Central + 5 Telas)
Exibir de forma fixa e discreta no rodapé de todas as telas do protótipo navegável:

> **Ambiente de Demonstração (Protótipo Navegável NGS):** Perfis, pontuações, telemetria, métricas e oportunidades exibidas são dados simulados para validação de experiência, sem vínculo contratual ou tratamento de dados pessoais reais em produção.

---

## 3. Checklist de Exclusão & Auditoria de Copy

Validação obrigatória antes da entrega visual (`Builder UI`) e revisão de segurança (`Cipher DevSec`):

- [x] **Zero referências na UI e nas especificações de tela** a nomes ou módulos excluídos do escopo do protótipo (entidades externas não autorizadas, embaixadores vetados, módulos financeiros/tokenização e mecanismos de incentivo fiscal).
- [x] **Zero coleta ou exibição de dados sensíveis/biométricos** (frequência cardíaca, sono, saúde) em qualquer componente do protótipo.
- [x] **Vocabulário canônico respeitado:** `Painel Central NGS`, `Portal do Atleta`, `Liga Esportiva`, `Talent Network`, `Sponsorship`, `Commerce Hub` e `Readiness Score` (`0–100`).
- [x] **Fluxo `< 18 anos` bloqueado por padrão (`Pendente Responsável`)** até ação explícita em `Aprovar Acesso & Visibilidade`.
