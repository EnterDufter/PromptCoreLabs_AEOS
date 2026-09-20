# PromptCore Labs — Landing Page

Repositório oficial da landing page institucional da **PromptCore Labs**.

A PromptCore Labs é uma empresa de **IA aplicada, automação e arquitetura operacional** para startups, empresas e ecossistemas de inovação.

A primeira versão deste projeto tem como objetivo criar uma landing page institucional premium, clara, performática e preparada para **SEO** e **GEO / AI Visibility**, comunicando a proposta da PCL com autoridade, conforto visual e foco em conversão qualificada.

---

## 1. Definição rápida

**PromptCore Labs — IA aplicada, automação e arquitetura operacional para startups, empresas e ecossistemas de inovação.**

---

## 2. Pitch base

Projetamos estruturas de IA, dados, contexto e automação para que empresas operem com agentes inteligentes de forma governada, segura e escalável, reduzindo a imprevisibilidade da IA e ampliando a capacidade humana de decisão.

---

## 3. Objetivo da landing page

A landing page deve explicar rapidamente:

1. O que é a PromptCore Labs.
2. Para quem ela trabalha.
3. Que problema ela resolve.
4. Como ela resolve.
5. Por que sua abordagem é confiável.
6. Qual o papel do Project.OS.
7. Como iniciar uma conversa.

A página deve transmitir:

- clareza;
- autoridade;
- segurança;
- inovação aplicada;
- maturidade técnica;
- governança;
- protagonismo humano no uso de IA.

---

## 4. Direção estratégica

A PromptCore Labs não deve ser percebida como uma agência genérica de IA, nem como uma software house tradicional.

O posicionamento desejado é:

> Uma consultoria-laboratório de IA aplicada, arquitetura operacional, plataformas e educação para startups, empresas e ecossistemas de inovação.

A direção criativa definida para a primeira versão é:

**Executive Cognitive Lab**

Uma identidade visual que une:

- consultoria executiva;
- laboratório de inovação;
- plataforma SaaS B2B;
- clareza visual;
- conforto de navegação;
- tecnologia sem excesso de futurismo.

---

## 5. Escopo da primeira versão

A primeira versão será uma landing page de página única, com navegação por âncoras.

### Incluído

- Header / navegação;
- Hero section;
- síntese institucional;
- problema central;
- o que fazemos;
- públicos atendidos;
- abordagem metodológica;
- seção Project.OS;
- serviços;
- educação e labs;
- autoridade e experiência;
- conteúdos futuros;
- FAQ;
- CTA final;
- footer;
- SEO básico;
- estrutura preparada para GEO / AI Visibility.

### Fora do escopo inicial

- back-end robusto;
- autenticação;
- banco de dados próprio;
- CMS;
- área logada;
- blog completo;
- dashboards reais;
- integrações complexas;
- métricas inventadas;
- depoimentos fictícios;
- cases não validados.

---

## 6. Stack técnica prevista

Stack recomendada para a primeira implementação:

- **Next.js**
- **TypeScript**
- **TailwindCSS**
- **App Router**
- **Vercel** para deploy futuro

Bibliotecas opcionais:

- Lucide Icons;
- shadcn/ui, se necessário;
- Framer Motion apenas para microinterações leves;
- Zod apenas se houver formulário customizado.

A diretriz técnica é manter a implementação simples, performática e escalável.

---

## 7. Como rodar localmente

A landing implementada fica em `website/`.

A porta local recomendada para este projeto é `3010`, para evitar conflito com outros projetos Next.js que normalmente usam `3000` ou `3001`.

```powershell
cd website
npm install
npm run dev:3010
```

Depois acesse:

```text
http://localhost:3010
```

Alternativa usando `127.0.0.1` explicitamente:

```powershell
npm run dev:local
```

Depois acesse:

```text
http://127.0.0.1:3010
```

Consulte `website/README.md` para troubleshooting de porta, `ERR_BLOCKED_BY_CLIENT` e configuração de Node/NPM.

---

## 8. SEO e GEO / AI Visibility

Desde a primeira versão, a landing deve ser preparada para mecanismos de busca tradicionais e para mecanismos de resposta baseados em IA.

Requisitos previstos:

- H1 único;
- headings semânticos;
- title tag e meta description;
- Open Graph;
- sitemap.xml;
- robots.txt;
- conteúdo textual real, não preso em imagens;
- FAQ indexável;
- schema JSON-LD para Organization, WebSite e FAQPage;
- respostas diretas e citáveis;
- definição clara da PCL e do Project.OS;
- linguagem objetiva sobre IA aplicada, arquitetura operacional, governança, startups e ecossistemas de inovação.

---

## 9. Project.OS

O **Project.OS** será apresentado como uma plataforma da PromptCore Labs.

Definição base:

> Project.OS é uma plataforma da PromptCore Labs para gestão inteligente de projetos, editais, evidências, indicadores e ecossistemas de inovação.

Na landing, o Project.OS deve funcionar como prova concreta da capacidade da PCL de transformar método, IA, dados e governança em produto digital.

---

## 10. Estrutura atual do repositório

```text
/
├─ docs/
│  ├─ 01-briefing-estrategico-promptcore-labs.md
│  ├─ 02-posicionamento-e-mensagem.md
│  ├─ 03-direcao-criativa.md
│  ├─ 04-branding-guide.md
│  ├─ 05-arquitetura-da-landing.md
│  ├─ 06-copywriting-da-landing.md
│  ├─ 07-requisitos-tecnicos-seo-geo.md
│  ├─ 08-prompt-final-implementacao.md
│  └─ 09-roadmap-e-evolucao.md
│
├─ website/
│  ├─ app/
│  ├─ components/
│  ├─ content/
│  ├─ lib/
│  ├─ styles/
│  ├─ package.json
│  └─ README.md
│
└─ README.md
```

O website foi implementado dentro de `website/`, mantendo a base preparada para expansão futura:

```text
/
├─ docs/
├─ website/
│  ├─ app/
│  ├─ components/
│  ├─ content/
│  ├─ lib/
│  ├─ public/
│  └─ styles/
├─ design/
├─ assets/
└─ README.md
```

---

## 11. Documentação estratégica

O pacote inicial de documentação está organizado da seguinte forma:

| Documento | Finalidade |
|---|---|
| `01-briefing-estrategico-promptcore-labs.md` | Define visão, contexto, público, promessa e requisitos iniciais. |
| `02-posicionamento-e-mensagem.md` | Consolida narrativa, one-liner, pitch, mensagens e vocabulário. |
| `03-direcao-criativa.md` | Define estilo visual, sensação da interface e princípios de design. |
| `04-branding-guide.md` | Consolida identidade verbal, visual, tom de voz, paleta e componentes. |
| `05-arquitetura-da-landing.md` | Define seções, ordem, objetivos, CTAs e estrutura da landing. |
| `06-copywriting-da-landing.md` | Traz a primeira redação completa da página, seção por seção. |
| `07-requisitos-tecnicos-seo-geo.md` | Define stack, performance, acessibilidade, SEO, GEO e dados estruturados. |
| `08-prompt-final-implementacao.md` | Prompt consolidado para implementação com Codex/Lovable ou ferramenta equivalente. |
| `09-roadmap-e-evolucao.md` | Planeja evolução futura do site, conteúdos, Project.OS, serviços e integrações. |

---

## 12. Próximo passo recomendado

Executar e validar a landing localmente a partir de `website/`:

```powershell
cd website
npm install
npm run dev:3010
```

Validações recomendadas:

```powershell
npm run typecheck
npm run build
```

---

## 13. Critérios de sucesso da primeira versão

A primeira landing será considerada bem-sucedida se conseguir:

- explicar a PCL em até cinco segundos;
- transmitir segurança e autoridade;
- diferenciar a PCL de uma agência genérica de IA;
- posicionar startups e ecossistemas de inovação como públicos centrais;
- apresentar o Project.OS como ativo estratégico;
- comunicar IA aplicada com contexto, governança e human-in-the-loop;
- ser responsiva;
- ser performática;
- ser indexável;
- estar preparada para SEO/GEO;
- gerar conversas qualificadas.

---

## 14. Princípio orientador

**Menos complexidade inicial. Mais clareza, autoridade, performance e capacidade de evolução.**

---

## 15. Portfólio PCL: motor transversal e verticais aplicadas

A PromptCore Labs deve evoluir sua narrativa pública a partir de uma arquitetura de portfólio com dois níveis complementares:

1. **Motor transversal:** plataformas, métodos e módulos reutilizáveis para estruturar processos, dados, documentos, captação, evidências, indicadores, automações, agentes de IA e governança.
2. **Verticais powered by PromptCore Labs:** aplicações dessa inteligência em nichos específicos, preservando identidade própria e conexão com o motor operacional da PCL.

Essa abordagem evita posicionar a PCL apenas como consultoria, agência de IA ou software house. A empresa passa a ser percebida como uma criadora de arquiteturas operacionais reutilizáveis, capazes de sustentar produtos, jornadas e verticais de alta complexidade.

### Project.OS

O **Project.OS** deve ser tratado como o motor transversal da PromptCore Labs.

Definição base:

> Project.OS é o motor operacional e cognitivo da PromptCore Labs para estruturar projetos, editais, financiamento, documentos, evidências, indicadores, agentes de IA e governança, transformando oportunidades complexas em operações financiáveis, auditáveis e mensuráveis.

O Project.OS não deve ser apresentado apenas como um produto isolado. Ele deve funcionar como infraestrutura metodológica e tecnológica para apoiar diferentes ecossistemas, como startups, parques tecnológicos, hubs de inovação, incubadoras, aceleradoras, universidades, secretarias públicas, entidades como SEBRAE, projetos culturais, projetos esportivos, iniciativas educacionais e programas institucionais.

Jornada transversal desejada:

```text
Oportunidade
→ Diagnóstico
→ Estruturação do projeto
→ Documentação
→ Elegibilidade
→ Captação / financiamento
→ Execução
→ Evidências
→ Indicadores
→ Prestação de contas
→ Impacto
→ Próxima rodada / nova oportunidade
```

Possíveis ecossistemas apoiados pelo Project.OS:

- startups em hubs, parques tecnológicos, incubadoras e aceleradoras;
- programas institucionais operados por universidades, secretarias, fundações, institutos e entidades de apoio;
- editais públicos e privados;
- jornadas de captação com investidores anjo, empresas patrocinadoras, fundos e órgãos de fomento;
- projetos culturais conectados à Lei Rouanet e outros mecanismos de incentivo;
- projetos esportivos conectados à Lei de Incentivo ao Esporte;
- iniciativas de educação, capacitação e desenvolvimento de talentos;
- futuras verticais setoriais powered by PromptCore Labs.

### Next Gen Sports

O **Next Gen Sports** deve ser tratado como a primeira vertical SportTech **powered by PromptCore Labs**.

Definição base:

> Next Gen Sports é uma vertical SportTech powered by PromptCore Labs criada para apoiar a formação, gestão, visibilidade e profissionalização de jovens atletas, conectando ligas, atletas, especialistas, patrocinadores, projetos incentivados e dados de performance em uma jornada estruturada de desenvolvimento.

A iniciativa nasceu para apoiar jovens atletas que ainda não contam com infraestrutura, preparo ou orientação adequados, conduzindo-os em uma jornada de profissionalização para que estejam mais preparados para oportunidades futuras no esporte.

O NGS aplica parte da inteligência do Project.OS ao ecossistema esportivo, especialmente em módulos de gestão de processos, captação, financiamento, documentação, evidências e governança. Ele não deve ser tratado apenas como um produto isolado nem como simples derivação do Project.OS, mas como uma vertical aplicada que pode se conectar ao motor transversal quando fizer sentido operacional.

Módulos e capacidades previstas para a vertical NGS:

- CRM de ligas esportivas para captação, cadastro, acompanhamento e evolução de atletas;
- CRM de atletas orientado à captação de patrocínio, profissionalização e gestão da jornada individual;
- páginas individuais de atletas, ao estilo perfil profissional público, para consulta por patrocinadores, ligas, equipes, parceiros e stakeholders;
- LMS gamificado com jornadas de desenvolvimento;
- Readiness Score para medir evolução, preparo e maturidade do atleta;
- fast track documental para estruturação de mídia kits;
- apoio a processos relacionados à Lei de Incentivo ao Esporte;
- marketplace de serviços especializados para conectar atletas a profissionais e parceiros do ecossistema;
- e-commerce de itens esportivos;
- base de dados para empresas, patrocinadores e agentes identificarem talentos e oportunidades;
- mecanismos de rastreabilidade para que patrocinadores, entidades públicas, ONGs, articuladores e stakeholders acompanhem projetos incentivados.

O projeto nasceu inicialmente com foco em esportes a motor, inspirado em modelos internacionais de prospecção e desenvolvimento de talentos, mas sua arquitetura pode evoluir para outras modalidades esportivas.

### Verticais candidatas futuras

Além do Next Gen Sports, a PromptCore Labs poderá avaliar outras verticais powered by PromptCore Labs, desde que exista complexidade operacional suficiente, múltiplos stakeholders, necessidade de evidências e potencial de uso do motor transversal do Project.OS.

Verticais candidatas:

- **Startups & Innovation Ecosystems:** jornadas para startups, hubs, parques tecnológicos, incubadoras, aceleradoras, investidores e entidades de apoio.
- **Institutional Projects & Public Funding:** editais, chamadas públicas, projetos institucionais, programas de fomento e prestação de contas.
- **Incentive Laws & Cultural Projects:** apoio a artistas, produtores culturais, instituições e patrocinadores em jornadas como Lei Rouanet e outros mecanismos de incentivo.
- **Sports & Athlete Development:** expansão da vertical esportiva a partir do NGS.
- **Education & Workforce Development:** programas de formação, capacitação profissional, mentorias, trilhas educacionais e desenvolvimento de talentos.
- **ESG / Impact Projects:** iniciativas sociais, ambientais, comunitárias e de impacto que exigem governança, evidências e mensuração.
- **Commerce / Creator Economy:** possíveis plataformas futuras para economia criativa, comércio digital, marketplaces ou comunidades de produtores.

### Critérios para inclusão na landing

- Explicar Project.OS como motor transversal, não apenas como produto isolado.
- Apresentar Next Gen Sports como primeira vertical SportTech powered by PromptCore Labs.
- Demonstrar que a PCL cria arquiteturas reutilizáveis e também aplica essas arquiteturas em mercados verticais.
- Evitar transformar a landing institucional em uma vitrine dispersa de produtos.
- Preservar a autonomia de marca das verticais quando isso fizer sentido estratégico.
- Evitar claims, métricas ou cases ainda não validados publicamente.
- Criar links, seções ou cards específicos apenas quando houver conteúdo mínimo consistente para cada iniciativa.

---

## 16. Backlog das próximas versões

Este backlog registra as próximas evoluções recomendadas para a landing page da PromptCore Labs após o MVP publicado.

### 16.1 Domínio próprio

**Objetivo:** conectar a landing a domínios institucionais da PromptCore Labs.

**Escopo previsto:**

- Conectar `promptcorelabs.com` à Cloudflare Pages.
- Conectar `promptcorelabs.com.br` quando o domínio estiver disponível/configurado.
- Definir domínio principal canônico.
- Configurar redirecionamento entre domínios, se aplicável.
- Atualizar `siteUrl`, canonical, sitemap, Open Graph e eventuais URLs absolutas.

**Critérios de aceite:**

- Domínio principal acessível via HTTPS.
- Redirecionamento configurado entre domínio alternativo e domínio principal.
- `sitemap.xml` e `robots.txt` refletindo a URL final.
- Metadata e Open Graph usando o domínio final.
- Nenhum link interno apontando para domínio provisório `.pages.dev`, exceto em documentação histórica.

### 16.2 E-mail oficial

**Objetivo:** substituir o fluxo provisório de contato por e-mail institucional da PromptCore Labs.

**Escopo previsto:**

- Criar `contato@promptcorelabs.com` e/ou `contato@promptcorelabs.com.br`.
- Definir qual e-mail será usado publicamente.
- Configurar SPF, DKIM e DMARC para reduzir risco de spam.
- Atualizar Web3Forms ou mecanismo de formulário para encaminhar ao e-mail oficial.
- Atualizar qualquer texto, link ou configuração que ainda aponte para e-mail provisório.

**Critérios de aceite:**

- E-mail oficial criado e testado para envio/recebimento.
- Formulário enviando mensagens para o e-mail oficial.
- Teste real recebido na caixa de entrada correta.
- SPF, DKIM e DMARC configurados no DNS.
- Nenhum e-mail pessoal exposto na landing.

### 16.3 Upgrade técnico Next.js / npm audit

**Objetivo:** tratar pendências de segurança e manutenção técnica sem comprometer a estabilidade da landing publicada.

**Escopo previsto:**

- Abrir PR separado para avaliar atualização do Next.js e dependências relacionadas.
- Rodar `npm audit` e documentar vulnerabilidades remanescentes.
- Evitar `npm audit fix --force` sem revisão.
- Avaliar menor upgrade seguro possível.
- Verificar impacto em static export, Tailwind, metadata, sitemap, robots, Open Graph e build na Cloudflare Pages.
- Investigar o aviso recorrente de SWC/lockfile.

**Critérios de aceite:**

- `npm install` concluindo sem erro.
- `npm run typecheck` passando.
- `npm run build` passando.
- `npm run pages:build` gerando `website/out/index.html`.
- `npm audit` reduzido ou com justificativa documentada para pendências remanescentes.
- Landing publicada sem regressão visual ou funcional.

### 16.4 Formulário definitivo / CRM

**Objetivo:** evoluir o formulário provisório para um fluxo definitivo de captação, qualificação e gestão de leads.

**Escopo previsto:**

- Avaliar solução definitiva: HubSpot Forms, Supabase, Cloudflare Worker, endpoint próprio, CRM ou integração futura com Project.OS.
- Definir campos mínimos de qualificação.
- Criar confirmação de envio mais elegante, preferencialmente sem depender de redirecionamento genérico.
- Registrar origem, página, campanha e parâmetros UTM.
- Definir política de privacidade e consentimento, se aplicável.
- Avaliar envio de notificação para e-mail e registro estruturado em base/CRM.

**Critérios de aceite:**

- Lead recebido em destino oficial.
- Dados estruturados disponíveis para acompanhamento comercial.
- Campo de e-mail validado.
- Proteção anti-spam ativa.
- Mensagem de sucesso clara para o visitante.
- Fluxo documentado para manutenção futura.

### 16.5 Analytics

**Objetivo:** instrumentar a landing para medir tráfego, origem, conversão e engajamento sem comprometer performance.

**Escopo previsto:**

- Definir ferramenta: Cloudflare Web Analytics, Google Analytics, Plausible, Umami ou alternativa equivalente.
- Monitorar visitas, origem, páginas, cliques em CTAs e envio de formulário.
- Criar eventos mínimos: clique em CTA principal, clique em Project.OS, submit do formulário, acesso por campanhas.
- Avaliar UTMs para LinkedIn, WhatsApp, eventos e prospecção direta.
- Documentar convenção de nomenclatura dos eventos.

**Critérios de aceite:**

- Script de analytics instalado sem quebrar static export.
- Eventos principais capturados.
- Dashboard acessível e validado.
- Sem impacto relevante em performance.
- Sem coleta excessiva de dados pessoais.

### 16.6 SEO/GEO pós-domínio

**Objetivo:** consolidar a presença da PromptCore Labs em mecanismos de busca e mecanismos de resposta baseados em IA após domínio próprio.

**Escopo previsto:**

- Atualizar canonical, sitemap, robots e metadata para o domínio final.
- Validar indexação no Google Search Console.
- Criar ou revisar `llms.txt`, se decidido como estratégia de AI Visibility.
- Expandir FAQ com perguntas estratégicas sobre PromptCore Labs, Project.OS, Next Gen Sports, IA aplicada, arquitetura operacional e governança cognitiva.
- Criar páginas ou seções futuras para conteúdos institucionais, artigos e estudos aplicados.
- Revisar Schema.org para Organization, WebSite, FAQPage e eventuais SoftwareApplication/Product quando houver maturidade.

**Critérios de aceite:**

- Domínio validado no Google Search Console.
- Sitemap enviado e processado.
- Página principal indexável e sem bloqueios indevidos.
- Open Graph testado em LinkedIn/WhatsApp.
- FAQ revisado para SEO/GEO.
- Conteúdo textual suficiente para explicar PCL, Project.OS e Next Gen Sports com clareza.

### 16.7 Branding, identidade visual e revisão estética

**Objetivo:** refinar a percepção visual da landing para que ela represente melhor a ambição institucional da PromptCore Labs.

**Contexto:** o MVP atual está funcional e publicado, mas ainda deve ser tratado como visualmente provisório. A versão atual ainda não possui logo definitivo, sistema de marca completo, imagens proprietárias, ilustrações, animações agradáveis ou direção visual madura o suficiente para uma presença institucional mais forte.

**Escopo previsto:**

- Realizar estudo de branding, marca, arquétipos, tom de voz, estilo visual e princípios de design.
- Definir logo, símbolo, tipografia, paleta, grid, iconografia, ilustrações e estilo de imagens.
- Revisar hero, seções institucionais, cards, diagramas, CTAs, footer e Open Graph.
- Avaliar microinterações e animações leves sem comprometer performance.
- Criar assets visuais proprietários para PromptCore Labs, Project.OS e Next Gen Sports.
- Atualizar o Brand Guide antes de mexer novamente na interface.
- Garantir que a landing deixe de parecer um MVP cru e avance para uma experiência mais premium, memorável e confiável.

**Critérios de aceite:**

- Logo e identidade visual definidos.
- Brand Guide atualizado.
- Landing com estética mais proprietária e menos genérica.
- Imagens, ilustrações ou diagramas coerentes com a marca.
- Animações leves e funcionais, sem excesso.
- Responsividade preservada.
- `npm run typecheck`, `npm run build` e `npm run pages:build` passando.

### 16.8 Arquitetura de portfólio PCL

**Objetivo:** refletir melhor na landing a lógica de motor transversal e verticais powered by PromptCore Labs.

**Escopo previsto:**

- Criar seção ou bloco visual sobre “Project.OS como motor transversal + verticais aplicadas”.
- Explicar que a PCL cria arquiteturas reutilizáveis, mas também aplica essas arquiteturas em mercados verticais.
- Posicionar Project.OS como motor de gestão, captação, financiamento, evidências, indicadores e governança.
- Apresentar Next Gen Sports como primeira vertical SportTech powered by PromptCore Labs.
- Indicar futuras verticais sem prometer produtos ainda inexistentes.
- Preservar clareza para visitantes não técnicos.

**Critérios de aceite:**

- Visitante entende que Project.OS é transversal.
- Visitante entende que NGS é uma vertical aplicada.
- A landing não fica dispersa nem excessivamente carregada.
- A narrativa preserva a autonomia de marca das verticais.
- Não há claims não validados.

### 16.9 Landing page do Project.OS

**Objetivo:** planejar uma landing page própria para o Project.OS como produto/plataforma transversal da PCL.

**Escopo previsto:**

- Definir posicionamento específico do Project.OS.
- Mapear públicos: startups, parques tecnológicos, hubs, incubadoras, aceleradoras, universidades, secretarias, entidades como SEBRAE, investidores, patrocinadores, órgãos de fomento e operadores institucionais.
- Estruturar narrativa da jornada: oportunidade, diagnóstico, elegibilidade, documentação, captação, execução, evidências, indicadores, prestação de contas e impacto.
- Definir módulos, telas, fluxos e diferenciais do produto.
- Criar copy, estrutura de seções, FAQs e CTAs específicos.
- Avaliar relação entre Project.OS, editais, fomento, leis de incentivo, projetos institucionais e verticais powered by PCL.

**Critérios de aceite:**

- One-liner e pitch do Project.OS definidos.
- Arquitetura da landing própria documentada.
- Módulos principais claros.
- Públicos e casos de uso priorizados.
- Relação com PromptCore Labs e verticais bem explicada.
- Prompt de implementação preparado para Codex ou ferramenta equivalente.

### 16.10 Landing page do Next Gen Sports

**Objetivo:** planejar uma landing page própria para o Next Gen Sports como primeira vertical SportTech powered by PromptCore Labs.

**Escopo previsto:**

- Definir posicionamento específico do NGS.
- Explicar a missão de apoiar jovens atletas sem infraestrutura, preparo ou orientação adequados.
- Mapear públicos: atletas, famílias, ligas, escolas, equipes, especialistas, patrocinadores, empresas, ONGs, articuladores públicos e projetos incentivados.
- Apresentar módulos: CRM de ligas, CRM de atletas e captação de patrocínio, páginas individuais de atletas, LMS gamificado, Readiness Score, fast track documental, mídia kits, Lei de Incentivo ao Esporte, marketplace, e-commerce e base de dados.
- Explicar a conexão com Project.OS nos fluxos de documentação, captação, financiamento, evidências e governança.
- Preservar a origem nos esportes a motor e a possibilidade de expansão para outras modalidades.
- Criar copy, arquitetura de seções, FAQs, CTAs e diferenciais da vertical.

**Critérios de aceite:**

- One-liner e pitch do NGS definidos.
- Arquitetura da landing própria documentada.
- Módulos e públicos claros.
- Relação com PromptCore Labs e Project.OS explicada sem confundir marcas.
- Narrativa de impacto e profissionalização de atletas bem estruturada.
- Prompt de implementação preparado para Codex ou ferramenta equivalente.

---

## 17. Status atual

A landing está em estado de **MVP publicado e operacional**, com valor funcional validado, mas ainda visualmente provisório.

Concluído:

- estratégia, posicionamento e copy base;
- landing institucional responsiva;
- refinamento visual leve;
- Open Graph com imagens estáticas;
- deploy em Cloudflare Pages com static export;
- formulário provisório funcional via Web3Forms;
- documentação inicial de operação e evolução.

Pendente para próximas versões:

- domínio próprio;
- e-mail oficial;
- upgrade técnico Next.js / npm audit;
- formulário definitivo / CRM;
- analytics;
- validação SEO/GEO;
- revisão de branding, marca, arquétipos, tom de voz e estilo visual;
- refinamento estético da landing institucional;
- arquitetura de portfólio PCL com Project.OS como motor transversal;
- inclusão institucional do Next Gen Sports como vertical powered by PromptCore Labs;
- planejamento das landing pages próprias do Project.OS e do Next Gen Sports.
