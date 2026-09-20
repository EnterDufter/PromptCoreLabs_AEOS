# 07 — Requisitos Técnicos, SEO e GEO da Landing Page PromptCore Labs

**Projeto:** PromptCore Labs Landing Page  
**Repositório:** PromptCoreLabs/PromptCoreLabs_Landing_Page  
**Documento:** Requisitos Técnicos, SEO e GEO  
**Status:** Versão 0.1 — base para implementação  
**Última atualização:** 2026-05-21  
**Idioma principal:** Português Brasil

---

## 1. Objetivo deste documento

Este documento define os requisitos técnicos para implementação da primeira versão da landing page institucional da PromptCore Labs.

Ele orienta:

- stack recomendada;
- estrutura inicial de pastas;
- arquitetura técnica enxuta;
- performance;
- acessibilidade;
- SEO tradicional;
- GEO / AI Visibility;
- dados estruturados;
- requisitos de conteúdo semântico;
- critérios de aceite técnico;
- cuidados para evolução futura.

A intenção é construir uma landing simples, robusta, rápida, indexável e preparada para crescimento.

---

## 2. Princípio técnico central

A primeira versão da landing deve ser tecnicamente simples, mas estrategicamente bem preparada.

Princípio:

**Menos complexidade inicial. Mais clareza, performance, SEO, GEO e capacidade de evolução.**

Não criar back-end robusto, banco de dados, autenticação ou arquitetura SaaS neste momento, a menos que surja uma necessidade real depois da validação da landing.

---

## 3. Stack recomendada

### Stack principal

- Next.js
- TypeScript
- TailwindCSS
- Vercel

### Bibliotecas opcionais

- shadcn/ui, se for útil para componentes base;
- Lucide Icons para ícones lineares;
- Framer Motion apenas para microinterações leves;
- Zod apenas se houver validação de formulário customizada;
- next-sitemap ou geração nativa de sitemap;
- analytics leve, quando definido.

### Diretriz

A stack deve priorizar:

- performance;
- SEO;
- facilidade de manutenção;
- código limpo;
- componentes reutilizáveis;
- evolução futura para páginas internas.

---

## 4. Arquitetura técnica inicial

A arquitetura inicial deve ser enxuta:

```text
[Usuário]
   ↓
[Landing Page — Next.js]
   ↓
[Formulário simples de contato]
   ↓
[E-mail / CRM / Google Sheets / Supabase / HubSpot — futuro]
```

Nesta fase, não é necessário criar:

- API Gateway;
- BFF separado;
- microsserviços;
- Redis;
- PostgreSQL;
- CMS headless;
- filas;
- autenticação;
- área logada.

Esses elementos podem ser avaliados em fases futuras.

---

## 5. Estrutura de pastas recomendada

Estrutura inicial sugerida:

```text
/
├─ docs/
│  ├─ 01-briefing-estrategico-promptcore-labs.md
│  ├─ 02-posicionamento-e-mensagem.md
│  ├─ 03-direcao-criativa.md
│  ├─ 04-branding-guide.md
│  ├─ 05-arquitetura-da-landing.md
│  ├─ 06-copywriting-da-landing.md
│  └─ 07-requisitos-tecnicos-seo-geo.md
│
├─ website/
│  ├─ app/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  ├─ sitemap.ts
│  │  └─ robots.ts
│  │
│  ├─ components/
│  │  ├─ layout/
│  │  ├─ sections/
│  │  ├─ ui/
│  │  └─ seo/
│  │
│  ├─ content/
│  │  ├─ landing.ts
│  │  └─ faq.ts
│  │
│  ├─ lib/
│  │  ├─ metadata.ts
│  │  ├─ schema.ts
│  │  └─ utils.ts
│  │
│  ├─ public/
│  │  ├─ images/
│  │  ├─ icons/
│  │  └─ og/
│  │
│  ├─ styles/
│  │  └─ globals.css
│  │
│  ├─ package.json
│  ├─ tailwind.config.ts
│  ├─ tsconfig.json
│  └─ README.md
│
├─ design/
│  ├─ references.md
│  └─ tokens.md
│
├─ assets/
│  ├─ brand/
│  └─ diagrams/
│
└─ README.md
```

---

## 6. Estrutura de componentes

Componentes de seção:

- Header
- HeroSection
- TrustBar
- ProblemSection
- WhatWeDoSection
- AudienceSection
- ApproachSection
- ProjectOSSection
- ServicesSection
- EducationSection
- AuthoritySection
- ContentHubPreview
- FAQSection
- FinalCTA
- Footer

Componentes base:

- Button
- Card
- Badge
- SectionHeader
- Container
- DiagramBlock
- Pill
- FAQItem

Componentes SEO:

- JsonLd
- OrganizationSchema
- WebsiteSchema
- FAQSchema

---

## 7. Requisitos de performance

A landing deve ser rápida, leve e confortável.

### Requisitos

- Priorizar renderização estática sempre que possível.
- Evitar dependências pesadas sem necessidade.
- Evitar vídeos na primeira versão.
- Otimizar imagens.
- Usar SVGs leves para diagramas.
- Carregar fontes de forma eficiente.
- Evitar animações pesadas.
- Manter JavaScript mínimo.
- Garantir boa experiência mobile.

### Metas iniciais

- Lighthouse Performance acima de 90.
- Lighthouse SEO acima de 90.
- Lighthouse Accessibility acima de 90.
- Largest Contentful Paint abaixo de 2.5s em condições normais.
- Cumulative Layout Shift próximo de zero.

---

## 8. Requisitos de acessibilidade

A landing deve ser acessível desde a primeira versão.

### Requisitos

- Usar HTML semântico.
- Ter apenas um H1.
- Manter hierarquia correta de headings.
- Garantir contraste adequado.
- Todos os botões devem ter texto claro.
- Links devem ser identificáveis.
- Imagens relevantes devem ter alt text descritivo.
- Imagens decorativas devem usar alt vazio.
- Navegação por teclado deve funcionar.
- Estados de foco devem ser visíveis.
- Evitar depender apenas de cor para transmitir informação.
- FAQ deve ser navegável e legível.

---

## 9. SEO tradicional

### Requisitos básicos

- Title tag clara.
- Meta description objetiva.
- Canonical URL.
- Open Graph tags.
- Twitter Card tags.
- Sitemap.xml.
- Robots.txt.
- URLs semânticas.
- Alt text em imagens relevantes.
- Conteúdo textual indexável.
- Headings organizados.
- Links internos por âncoras.
- Carregamento rápido.
- Mobile-first.

### Title inicial

PromptCore Labs — IA aplicada e arquitetura operacional para startups e ecossistemas

### Meta description inicial

A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar operações inteligentes com IA, dados, automação, agentes e governança.

### Palavras-chave estratégicas

- PromptCore Labs
- IA aplicada
- arquitetura operacional
- automação inteligente
- agentes de IA
- engenharia de contexto
- engenharia de harness
- governança cognitiva
- human-in-the-loop
- startups
- ecossistemas de inovação
- Project.OS
- gestão de projetos
- editais
- evidências
- indicadores
- CRM
- RevOps

---

## 10. GEO / AI Visibility

A landing deve ser construída para ser compreendida por mecanismos de resposta baseados em IA.

### Requisitos de conteúdo

- Resposta direta sobre o que é a PCL nos primeiros blocos da página.
- Linguagem clara e autossuficiente.
- Frases citáveis.
- FAQ estruturado.
- Seções com títulos objetivos.
- Conteúdo em HTML real, não preso em imagens.
- Repetição natural de termos estratégicos.
- Definições claras de PCL e Project.OS.
- Explicações diretas sobre engenharia de contexto, engenharia de harness e human-in-the-loop.
- Data de atualização em conteúdos futuros.

### Requisitos de estrutura

- Usar schema JSON-LD.
- Usar headings claros.
- Criar respostas curtas em FAQs.
- Evitar textos vagos e genéricos.
- Usar listas e tabelas quando ajudarem a extração de informação.
- Garantir que a página responda claramente: quem é, o que faz, para quem faz, como faz e por que é diferente.

---

## 11. Dados estruturados recomendados

### Organization

Usar para descrever a PromptCore Labs como entidade.

Campos recomendados:

- name
- url
- logo, quando disponível
- description
- sameAs, quando houver redes sociais
- foundingDate, se definido
- founder, se aplicável
- areaServed
- knowsAbout

### WebSite

Usar para indicar o site oficial.

Campos recomendados:

- name
- url
- description
- publisher

### FAQPage

Usar para perguntas frequentes da landing.

Perguntas iniciais:

- O que é a PromptCore Labs?
- Para quem é a PromptCore Labs?
- O que a PromptCore Labs faz?
- Qual o diferencial da PCL?
- O que é Project.OS?
- A PCL substitui equipes por IA?

### Article

Usar futuramente nas páginas de conteúdo.

### Person

Usar futuramente na página do fundador, se houver.

---

## 12. Requisitos para FAQ

A FAQ deve ser textual, clara e indexável.

Regras:

- respostas curtas;
- linguagem direta;
- sem promessas absolutas;
- repetir termos estratégicos com naturalidade;
- usar schema FAQPage;
- manter coerência com a mensagem institucional.

---

## 13. Requisitos de conteúdo semântico

Cada seção estratégica deve conter uma frase-resposta clara.

Exemplos:

### PCL

A PromptCore Labs é uma empresa de IA aplicada, automação e arquitetura operacional que ajuda startups, empresas e ecossistemas de inovação a estruturar operações inteligentes com dados, contexto, governança e agentes de IA.

### Project.OS

Project.OS é uma plataforma da PromptCore Labs para gestão inteligente de projetos, editais, evidências, indicadores e ecossistemas de inovação.

### Abordagem

A PromptCore Labs combina engenharia de contexto, engenharia de harness e human-in-the-loop para reduzir a imprevisibilidade da IA e ampliar a capacidade humana de decisão.

---

## 14. Requisitos de formulário

A primeira versão pode usar formulário simples.

### Campos sugeridos

- Nome
- E-mail
- Organização
- Tipo de organização
- Mensagem

### Tipo de organização

- Startup
- Empresa
- Hub / Parque Tecnológico
- Universidade
- Aceleradora
- Instituição pública ou de fomento
- Outro

### Integração inicial possível

- e-mail;
- formulário externo;
- HubSpot;
- Google Sheets;
- Supabase;
- API Route simples do Next.js.

### Regras

- validar campos obrigatórios;
- evitar pedir informações demais;
- incluir consentimento básico de contato;
- preparar evolução futura para CRM.

---

## 15. Requisitos de segurança inicial

Mesmo sendo uma landing simples, deve haver cuidados mínimos.

- HTTPS obrigatório.
- Não expor chaves no front-end.
- Usar variáveis de ambiente para integrações.
- Validar dados de formulário no cliente e no servidor, se houver API própria.
- Evitar scripts de terceiros desnecessários.
- Configurar headers básicos de segurança quando possível.
- Proteger contra spam em formulário, se necessário.

---

## 16. Analytics e mensuração

A primeira versão deve prever mensuração simples.

Eventos úteis:

- clique no CTA principal do hero;
- clique no CTA Project.OS;
- envio de formulário;
- clique em contato;
- clique em conteúdos;
- scroll até seções estratégicas.

Ferramentas possíveis:

- Vercel Analytics;
- Google Analytics;
- Plausible;
- PostHog;
- HubSpot tracking, se houver CRM.

A ferramenta deve ser escolhida depois, sem travar a primeira implementação.

---

## 17. Requisitos de conteúdo futuro

A landing deve preparar expansão para páginas internas:

- `/servicos`
- `/plataformas`
- `/project-os`
- `/cursos`
- `/conteudos`
- `/sobre`
- `/contato`

Essas páginas não são obrigatórias na primeira versão, mas a arquitetura deve permitir evolução sem refatoração pesada.

---

## 18. Requisitos de deploy

### Plataforma recomendada

Vercel.

### Fluxo sugerido

- Branch `main` para produção.
- Branch `dev` ou `develop` para evolução.
- Branches `feature/*` para novas entregas.
- Pull Requests para revisão.
- Deploy automático via Vercel conectado ao GitHub.

### Variáveis futuras

- URL do formulário ou endpoint.
- Chaves de analytics.
- Integrações de CRM.
- E-mail de destino.

---

## 19. Critérios de aceite técnico

A primeira versão será considerada adequada se:

- rodar sem erros em ambiente local;
- tiver build de produção funcionando;
- for responsiva;
- tiver boa performance;
- usar HTML semântico;
- tiver title e meta description;
- tiver Open Graph;
- tiver sitemap e robots;
- tiver FAQ indexável;
- tiver JSON-LD básico;
- tiver CTAs funcionando;
- tiver formulário ou link de contato funcional;
- preservar a identidade definida nos documentos anteriores;
- evitar complexidade técnica desnecessária.

---

## 20. Critérios de aceite SEO/GEO

A primeira versão será considerada adequada para SEO/GEO se:

- explicar o que é a PCL no primeiro scroll;
- usar H1 único e H2s claros;
- tiver respostas diretas no FAQ;
- tiver conteúdo textual real;
- tiver meta tags consistentes;
- usar termos estratégicos com naturalidade;
- incluir schema Organization, WebSite e FAQPage;
- evitar mensagens vagas;
- definir claramente Project.OS;
- reforçar IA aplicada, arquitetura operacional, governança, startups e ecossistemas de inovação.

---

## 21. Não fazer na primeira versão

Evitar nesta fase:

- back-end robusto;
- autenticação;
- banco de dados próprio;
- CMS headless;
- área logada;
- blog completo;
- animações pesadas;
- vídeos de fundo;
- excesso de bibliotecas;
- integrações complexas;
- dashboards reais;
- métricas inventadas;
- depoimentos fictícios;
- cases não validados.

---

## 22. Próximo documento recomendado

O próximo documento deve ser:

`08-prompt-final-implementacao.md`

Objetivo:

Criar um prompt completo para implementação da landing page da PromptCore Labs em Next.js, TypeScript e TailwindCSS, usando todos os documentos estratégicos como base.
