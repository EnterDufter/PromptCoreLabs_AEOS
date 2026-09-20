# 08 — Prompt Final de Implementação da Landing Page PromptCore Labs

**Projeto:** PromptCore Labs Landing Page  
**Repositório:** PromptCoreLabs/PromptCoreLabs_Landing_Page  
**Documento:** Prompt Final de Implementação  
**Status:** Versão 0.1 — pronto para uso em Codex/Lovable/ambiente de desenvolvimento  
**Última atualização:** 2026-05-21  
**Idioma principal:** Português Brasil

---

## 1. Objetivo deste documento

Este documento reúne um prompt completo para orientar a implementação da primeira versão da landing page institucional da PromptCore Labs.

Ele deve ser usado por uma ferramenta de desenvolvimento assistido por IA, como Codex, Lovable ou ambiente equivalente, para criar uma landing page em Next.js, TypeScript e TailwindCSS, respeitando os documentos estratégicos já criados no repositório.

---

## 2. Documentos de referência obrigatórios

Antes de implementar, leia e use como base os seguintes documentos:

- `docs/01-briefing-estrategico-promptcore-labs.md`
- `docs/02-posicionamento-e-mensagem.md`
- `docs/03-direcao-criativa.md`
- `docs/04-branding-guide.md`
- `docs/05-arquitetura-da-landing.md`
- `docs/06-copywriting-da-landing.md`
- `docs/07-requisitos-tecnicos-seo-geo.md`

Esses documentos definem posicionamento, branding, copy, arquitetura da página, requisitos técnicos, SEO e GEO.

---

## 3. Prompt para implementação

Use o prompt abaixo para orientar a criação da landing page.

```text
Você é um desenvolvedor front-end sênior, especialista em Next.js, TypeScript, TailwindCSS, SEO técnico, acessibilidade, design systems e landing pages institucionais B2B.

Sua tarefa é implementar a primeira versão da landing page institucional da PromptCore Labs no repositório atual.

Antes de escrever código, leia todos os documentos abaixo e use-os como fonte de verdade:

- docs/01-briefing-estrategico-promptcore-labs.md
- docs/02-posicionamento-e-mensagem.md
- docs/03-direcao-criativa.md
- docs/04-branding-guide.md
- docs/05-arquitetura-da-landing.md
- docs/06-copywriting-da-landing.md
- docs/07-requisitos-tecnicos-seo-geo.md

OBJETIVO

Criar uma landing page institucional premium, confortável de navegar, clara, performática e preparada para SEO/GEO para a empresa PromptCore Labs.

A landing deve comunicar que a PromptCore Labs atua com IA aplicada, automação e arquitetura operacional para startups, empresas e ecossistemas de inovação.

A página deve transmitir segurança, autoridade, clareza, governança e maturidade técnica, evitando o visual genérico de empresas de IA com excesso de neon, robôs, cérebros 3D ou promessas exageradas.

STACK OBRIGATÓRIA

- Next.js
- TypeScript
- TailwindCSS
- App Router
- HTML semântico
- Deploy futuro previsto em Vercel

BIBLIOTECAS PERMITIDAS

- Lucide Icons para ícones simples e lineares
- Framer Motion apenas para microinterações leves, se realmente necessário
- shadcn/ui apenas se fizer sentido para acelerar componentes base

Não adicione bibliotecas pesadas sem necessidade.

ESCOPO DA PRIMEIRA VERSÃO

Criar uma landing page de página única, com navegação por âncoras.

Não criar:

- back-end robusto
- banco de dados
- autenticação
- dashboard real
- CMS
- área logada
- blog completo
- integrações complexas
- métricas inventadas
- depoimentos fictícios
- clientes fictícios
- cases não validados

ESTRUTURA DA PÁGINA

Implemente as seções nesta ordem:

1. Header / Navegação
2. Hero Section
3. Barra de confiança / síntese institucional
4. Problema central
5. O que fazemos
6. Para quem
7. Nossa abordagem
8. Project.OS
9. Serviços
10. Educação e Labs
11. Autoridade e experiência
12. Conteúdos futuros / SEO-GEO Hub
13. FAQ
14. CTA final
15. Footer

COPY

Use como base principal o arquivo:

- docs/06-copywriting-da-landing.md

Preserve a essência dos textos. Pode ajustar pequenas quebras, títulos e microcopy para melhorar fluidez visual, mas não altere o posicionamento central.

HERO

Use o seguinte conteúdo no primeiro scroll:

Eyebrow:
IA aplicada, automação e arquitetura operacional

H1:
Arquitetura, IA e operação para transformar ideias em empresas mais inteligentes.

Subheadline:
A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar processos, dados, automações e agentes de IA com governança, contexto e visão de crescimento.

Frase de diferenciação:
IA corporativa não deve operar no improviso. Criamos arquiteturas cognitivas para que humanos e agentes inteligentes trabalhem juntos com segurança, rastreabilidade e propósito.

CTA principal:
Fale com a PromptCore Labs

CTA secundário:
Conheça o Project.OS

DIREÇÃO VISUAL

Siga a direção criativa “Executive Cognitive Lab”.

A landing deve parecer:

- institucional premium
- moderna
- confortável
- clara
- tecnológica sem exagero
- confiável
- humana
- orientada a startups, hubs, universidades, parques tecnológicos e empresas em transformação

Use uma base predominantemente clara, com elementos navy, azul e teal.

Evite:

- dark mode total
- neon excessivo
- estética cyberpunk
- robôs humanoides
- cérebros 3D
- hologramas genéricos
- imagens frias de banco de imagem
- efeitos visuais pesados

PALETA INICIAL

Use como referência:

Neutros:
- #FFFFFF
- #F7F8FA
- #EEF2F6
- #D8E0EA
- #6B7280

Institucionais:
- #0B1220
- #111827
- #172A45

Destaques:
- #1D4ED8
- #0891B2
- #7C3AED
- #10B981
- #F59E0B

Regra visual:
80% neutros, 15% institucional, 5% destaque.

TIPOGRAFIA

Use fontes modernas, legíveis e executivas.

Preferência:
- Manrope para títulos
- Inter para corpo

Caso a implementação inicial use apenas uma fonte, priorize Inter ou Geist.

COMPONENTES NECESSÁRIOS

Crie componentes reutilizáveis, por exemplo:

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
- Button
- Card
- Badge
- SectionHeader
- Container
- DiagramBlock
- FAQItem
- JsonLd

ESTILO DOS COMPONENTES

Cards:
- fundo branco
- bordas suaves
- cantos arredondados
- sombras leves
- espaçamento interno generoso
- textos curtos e escaneáveis

Botões:
- botão primário azul
- botão secundário com borda
- estados hover discretos
- foco visível

Ícones:
- simples
- lineares
- consistentes
- usar Lucide Icons, se disponível

Diagramas:
- representar IA como arquitetura, contexto, dados, agentes, governança e humano no loop
- não usar robôs ou clichês futuristas
- preferir SVG ou blocos HTML/CSS leves

SEO

Implemente:

- title tag
- meta description
- Open Graph
- Twitter Card
- canonical
- sitemap
- robots
- H1 único
- H2s claros
- conteúdo textual real
- alt text em imagens relevantes
- URLs e âncoras semânticas

Title:
PromptCore Labs — IA aplicada e arquitetura operacional para startups e ecossistemas

Meta description:
A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar operações inteligentes com IA, dados, automação, agentes e governança.

GEO / AI VISIBILITY

A página deve ser compreensível por mecanismos de IA.

Requisitos:

- explicar diretamente o que é a PromptCore Labs no primeiro scroll
- usar frases autossuficientes e citáveis
- manter FAQ textual e indexável
- definir claramente Project.OS
- usar HTML semântico
- evitar texto importante dentro de imagens
- criar schema JSON-LD básico

SCHEMA JSON-LD

Criar dados estruturados para:

- Organization
- WebSite
- FAQPage

Organization deve incluir, quando possível:

- name: PromptCore Labs
- description: empresa de IA aplicada, automação e arquitetura operacional para startups, empresas e ecossistemas de inovação
- url: usar placeholder até domínio final estar definido
- knowsAbout: IA aplicada, arquitetura operacional, automação inteligente, agentes de IA, engenharia de contexto, engenharia de harness, governança cognitiva, CRM, RevOps, Project.OS

FAQ

Implementar as perguntas e respostas do arquivo docs/06-copywriting-da-landing.md.

A FAQ deve ser acessível, indexável e compatível com schema FAQPage.

FORMULÁRIO / CONTATO

Nesta primeira versão, não criar back-end robusto.

Criar uma seção de contato ou CTA final que possa funcionar inicialmente com:

- mailto
- link externo futuro
- formulário simples sem integração real

Se criar formulário, deixar integração preparada, mas não inventar endpoint.

Campos sugeridos:

- Nome
- E-mail
- Organização
- Tipo de organização
- Mensagem

ACESSIBILIDADE

Garantir:

- HTML semântico
- contraste adequado
- foco visível
- navegação por teclado
- labels em campos de formulário
- alt text em imagens relevantes
- botões com texto claro
- headings em ordem correta

PERFORMANCE

Garantir:

- build sem erros
- página responsiva
- imagens otimizadas
- evitar vídeos pesados
- evitar dependências desnecessárias
- evitar animações pesadas
- manter JavaScript mínimo

ESTRUTURA DE PASTAS RECOMENDADA

Se o projeto ainda não existir, criar dentro de /website:

website/
  app/
    layout.tsx
    page.tsx
    sitemap.ts
    robots.ts
  components/
    layout/
    sections/
    ui/
    seo/
  content/
    landing.ts
    faq.ts
  lib/
    metadata.ts
    schema.ts
    utils.ts
  public/
    images/
    icons/
    og/
  styles/
    globals.css

Se já existir uma estrutura diferente, adaptar sem quebrar o padrão do projeto.

CRITÉRIOS DE ACEITE

A entrega estará correta se:

- explicar a PCL em até cinco segundos
- transmitir autoridade e conforto visual
- usar a copy definida nos documentos
- seguir a direção “Executive Cognitive Lab”
- diferenciar a PCL de uma agência genérica de IA
- apresentar Project.OS como plataforma da PCL
- explicar engenharia de contexto, engenharia de harness e human-in-the-loop
- usar H1 único
- ter SEO básico implementado
- ter JSON-LD Organization, WebSite e FAQPage
- ser responsiva
- ter boa performance
- evitar hype e clichês de IA
- não criar complexidade técnica desnecessária

ENTREGA ESPERADA

Ao final, entregar:

1. Código da landing implementado.
2. Estrutura de componentes organizada.
3. README do website com instruções para rodar localmente.
4. Confirmação dos arquivos criados/alterados.
5. Observações sobre pendências reais, sem inventar integrações ou métricas.

IMPORTANTE

Não avance para backend, CMS, área logada ou blog completo nesta etapa.

A prioridade é criar uma landing institucional premium, clara, performática e preparada para SEO/GEO.
```

---

## 4. Observações de uso

Este prompt pode ser usado em diferentes ferramentas, mas deve ser aplicado com critério.

### Para Codex

Usar o prompt completo e pedir que ele leia os documentos do repositório antes de implementar. Ideal para criar o projeto, componentes e arquivos técnicos.

### Para Lovable

Usar o prompt completo, mas reforçar a necessidade de manter a direção visual clara, premium e confortável. Revisar o código gerado antes de aceitar.

### Para Stitch ou ferramentas de design

Usar principalmente as partes de direção visual, hero, arquitetura da página, componentes e copy. Não usar as instruções técnicas de Next.js como prioridade.

---

## 5. Versão curta do prompt

Use esta versão quando a ferramenta tiver limite de contexto:

```text
Crie uma landing page institucional premium para a PromptCore Labs usando Next.js, TypeScript e TailwindCSS.

A PromptCore Labs é uma empresa de IA aplicada, automação e arquitetura operacional para startups, empresas e ecossistemas de inovação.

A landing deve seguir a direção visual “Executive Cognitive Lab”: clara, confortável, moderna, confiável, com estética de consultoria executiva + laboratório de inovação + SaaS B2B.

Evite dark mode total, neon excessivo, robôs, cérebros 3D e clichês de IA.

Use base clara, navy, azul e teal.

Hero:
H1: Arquitetura, IA e operação para transformar ideias em empresas mais inteligentes.
Subheadline: A PromptCore Labs ajuda startups, empresas e ecossistemas de inovação a estruturar processos, dados, automações e agentes de IA com governança, contexto e visão de crescimento.
Frase: IA corporativa não deve operar no improviso. Criamos arquiteturas cognitivas para que humanos e agentes inteligentes trabalhem juntos com segurança, rastreabilidade e propósito.
CTAs: Fale com a PromptCore Labs / Conheça o Project.OS.

Seções:
Header, Hero, Barra de confiança, Problema central, O que fazemos, Para quem, Nossa abordagem, Project.OS, Serviços, Educação e Labs, Autoridade, Conteúdos futuros, FAQ, CTA final e Footer.

Inclua SEO básico, H1 único, meta tags, Open Graph, sitemap, robots e JSON-LD para Organization, WebSite e FAQPage.

A página deve ser responsiva, acessível, performática e sem back-end robusto nesta fase.
```

---

## 6. Próximo documento recomendado

O próximo documento deve ser:

`09-roadmap-e-evolucao.md`

Objetivo:

Definir a evolução futura da presença digital da PromptCore Labs após a primeira landing: páginas internas, conteúdos de autoridade, Project.OS, serviços, cursos, integrações, analytics e futuras camadas técnicas.
