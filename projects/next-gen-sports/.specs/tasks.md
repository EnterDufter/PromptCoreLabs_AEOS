# Plano de Execução — Protótipo Navegável NGS (Gate G-01 → Onda 2)

**Diretório Alvo:** `C:\PromptCore_Labs\projects\next-gen-sports\prototype\`  
**Responsáveis Onda 2:** `Builder UI` (UI/UX, Tailwind, Telas, Dados Mockados) + `Cipher DevSec` (Tipagem TS, Trava LGPD, Build/QA)  
**Orçamento / Restrição FinOps:** R$ 0 de infraestrutura (build estático local Vite + React + TS + Tailwind; zero backend; zero chamadas a APIs pagas).

---

## Lista de Tarefas Atômicas

| ID | Tarefa | Responsável | Arquivos Alvo | Critério de Aceite (DoD) |
|---|---|---|---|---|
| **T-01** | **Scaffold Vite + React + TS + Tailwind** | `Cipher DevSec` | `prototype/package.json`, `tailwind.config.js`, `tsconfig.json`, `index.html` | `npm install` e `npm run build` passam com `Exit Code 0`; fontes `Sora` e `Inter` e paleta `#031B33`, `#0D47A1`, `#17B3B3`, `#FAFAFB` configuradas. |
| **T-02** | **Contratos TypeScript & Dados Mockados Tipados** | `Cipher DevSec` | `src/types/ngs.ts`, `src/data/mock*.ts` | Todos os contratos de `design.md` implementados em strict TS; `Gabriel Almeida` (16 anos, `pending` LGPD) + elenco multiesporte fictício; zero termos proibidos. |
| **T-03** | **Contexto Reativo (`NgsContext`) & Normalização** | `Cipher DevSec` | `src/context/NgsContext.tsx` | Troca de ator (`Atleta`, `Liga`, `Patrocinador`, `Responsável Legal`), troca de módulo, ações de consentimento LGPD e conclusão de módulo Academy (`0–1000` → `Readiness 0–100`) funcionando em memória. |
| **T-04** | **AppShell, TopBar com ActorSwitcher & MobileNav** | `Builder UI` | `src/components/layout/TopBar.tsx`, `SideNav.tsx`, `MobileNav.tsx` | Navegação fluida em `390px` (mobile) e `1440px` (desktop); seletor rápido de ator visível no header; assinatura `Next Gen Sports | Powered by PromptCore Labs` + selo `PCL Inside`. |
| **T-05** | **Hub Central: Feed em 3 Colunas & IA Copy Modal** | `Builder UI` | `src/components/hub/HubFeed3Col.tsx`, `PostCard.tsx`, `CopyAiModal.tsx` | Layout 3 colunas limpo (Zero AI Slop), filtro por modalidade, reações técnicas e modal de geração de copy simulada para compartilhamento externo. |
| **T-06** | **Módulo 1: Gestão de Ligas + Upload Folha Kart** | `Builder UI` | `src/components/modules/LeaguesView.tsx` | Lista de ligas B2B2C, etapas, inscrições e simulador de leitura de folha de tempos de kart gerando prova no Feed. |
| **T-07** | **Módulo 2: Portal do Atleta + Academy + Mídia-Kit** | `Builder UI` | `src/components/modules/AthletePortalView.tsx`, `ReadinessDrawer.tsx` | Exibe `Readiness Score 0–100` explicável (5 pilares clicáveis com evidências), `Academy LMS 0–1000` interativo, Mídia-Kit auditável e sub-bloco `Driver` restrito ao automobilismo. |
| **T-08** | **Módulo 3: Commerce Hub (Especialistas & Kits)** | `Builder UI` | `src/components/modules/CommerceHubView.tsx` | Lista de `Especialistas de Performance` recomendados por gap do Readiness, `Kits de Performance` e `Vouchers de Desenvolvimento` simulados (vocabulário canônico). |
| **T-09** | **Módulo 4: Sponsorship (Filtro Readiness > 70)** | `Builder UI` | `src/components/modules/SponsorshipView.tsx` | Filtro funcional `Readiness Score > 70`, visão de marcas e contrapartidas; bloqueio automático se menor sem consentimento; zero menções a incentivo fiscal ou captação regulada. |
| **T-10** | **Módulo 5: Talent Network & Fluxo LGPD Art. 14** | `Builder UI` + `Cipher DevSec` | `src/components/modules/TalentNetworkView.tsx`, `src/components/lgpd/LgpdConsentModal.tsx` | Rede de conexões, olheiros e endossos; trava real *Privacy by Default* para `< 18` desbloqueada ao vivo pelo `Responsável Legal` no modal LGPD. |
| **T-11** | **Auditoria Final, Exclusões & Build Check** | `Cipher DevSec` | Todo `prototype/` | Grep automatizado confirmando 0 ocorrências dos termos vetados definidos no Gate G-01; `npm run build` Exit Code 0. |
