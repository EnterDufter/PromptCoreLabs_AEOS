# PromptCore Labs Website

Landing page institucional da PromptCore Labs, criada com Next.js, TypeScript, TailwindCSS e App Router.

---

## Rodando localmente

A porta local recomendada para este projeto é `3010`. Isso evita conflito com outros projetos Next.js que normalmente usam `3000` ou `3001`.

No PowerShell:

```powershell
cd C:\PromptCore_Labs\PromptCoreLabs_Landing_Page\website
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

---

## Scripts

```bash
npm run dev
npm run dev:3010
npm run dev:local
npm run build
npm run pages:build
npm run typecheck
npm run lint
```

### Scripts principais

- `npm run dev`: inicia o Next.js na porta padrão.
- `npm run dev:3010`: inicia o Next.js na porta `3010`.
- `npm run dev:local`: inicia o Next.js em `127.0.0.1:3010`.
- `npm run build`: gera o build de produção.
- `npm run pages:build`: gera o export estático para Cloudflare Pages em `out/`.
- `npm run typecheck`: executa `tsc --noEmit`.
- `npm run lint`: executa o lint configurado no projeto.

---

## Deploy na Cloudflare Pages

Este projeto é uma landing Next.js localizada dentro de `website/`. Para Cloudflare Pages, configure o projeto como Pages com publicação estática, não como Worker.

Configuração recomendada no dashboard da Cloudflare:

- Project type: `Pages`
- Root directory: `website`
- Build command: `npm run pages:build`
- Output directory: `out`

O comando `npm run pages:build` executa `next build` com `output: "export"` em `next.config.js`, gerando os arquivos estáticos em `out/`.

Não use `npx wrangler deploy`, Workers, `@cloudflare/next-on-pages` ou `@opennextjs/cloudflare` neste projeto neste momento. O projeto Cloudflare anterior `landingpagepcl`, criado como Worker, deve ser ignorado ou removido depois.

---

## Troubleshooting

### O navegador interno do Codex não abre a página

Se `localhost:3010` não abrir no navegador interno do Codex, teste em um navegador externo, como Chrome ou Edge.

Acesse manualmente:

```text
http://localhost:3010
```

ou:

```text
http://127.0.0.1:3010
```

### Erro `ERR_BLOCKED_BY_CLIENT`

Esse erro normalmente não indica problema no código da landing. Ele costuma estar relacionado ao navegador, extensão, bloqueador, antivírus ou ambiente de preview.

Tente:

- abrir em janela anônima;
- desativar extensões de bloqueio para `localhost`;
- testar em outro navegador;
- usar `http://127.0.0.1:3010` em vez de `localhost`;
- rodar o projeto fora do preview interno do Codex.

### Porta 3010 ocupada

Para verificar se a porta `3010` está ocupada no PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3010 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,State,OwningProcess
```

Para identificar o processo:

```powershell
Get-Process -Id <PID>
```

Para encerrar o processo, apenas se for seguro:

```powershell
Stop-Process -Id <PID> -Force
```

Se preferir usar outra porta temporariamente:

```powershell
npm run dev -- -p 3011
```

Depois acesse:

```text
http://localhost:3011
```

### `npm` não é reconhecido no PowerShell

Verifique se Node.js e NPM estão instalados e disponíveis no PATH:

```powershell
node -v
npm -v
where node
where npm
```

Se `node` ou `npm` não forem reconhecidos, instale ou reinstale o Node.js LTS, marque a opção para adicionar ao PATH e reabra o terminal.

---

## Estrutura

- `app/`: App Router, metadados, sitemap e robots.
- `components/`: layout, seções, UI reutilizável e JSON-LD.
- `content/`: textos e listas estruturadas da landing.
- `lib/`: metadados, schemas e utilitários.
- `styles/`: Tailwind e estilos globais.

---

## Pendência técnica: auditoria de dependências

- O projeto usa npm e deve versionar `package-lock.json` para instalações reproduzíveis.
- `npm audit` reporta vulnerabilidades relacionadas principalmente ao Next.js e dependências indiretas.
- A correção automática sugerida exige upgrade major de Next.js.
- Não aplicar `npm audit fix --force` automaticamente.
- A atualização do Next.js deve ser feita em PR separado, com validação de build, typecheck, responsividade, metadata, sitemap, robots, JSON-LD e formulário.
- Até a atualização, manter acompanhamento da pendência antes de produção pública.

---

## Pendências reais

- Definir domínio final e atualizar `siteUrl` em `lib/metadata.ts`.
- Substituir `mailto` por integração real de formulário quando CRM, HubSpot, Supabase ou outro destino forem definidos.
- Adicionar logo final e imagem Open Graph quando a identidade visual estiver fechada.
