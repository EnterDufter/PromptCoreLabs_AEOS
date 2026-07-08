# AGENTS.md

## Missão do projeto

Construir a landing page institucional premium da NextGen Sports, uma plataforma SportTech para desenvolvimento de talentos esportivos emergentes, começando por automobilismo/kartismo.

O projeto deve posicionar a NextGen Sports como estrutura de carreira, performance, dados, mídia, parcerias, ativações e governança, evitando qualquer leitura de pedido amador de patrocínio.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- React
- Estrutura em `src/app`

## Regras de implementação

- Usar o diretório atual como raiz do projeto.
- Não criar subpastas como `my-app`, `frontend` ou `client`.
- Preservar `src/`, `public/`, `docs/`, `.codex/`, `AGENTS.md`, `README.md` e `package.json`.
- Se um arquivo existir vazio, preencher.
- Se um arquivo tiver conteúdo, complementar sem destruir.
- Centralizar textos reutilizáveis em `src/data/landingContent.ts`.
- Manter seções em `src/sections` e componentes em `src/components`.
- Preferir soluções simples, estáveis e profissionais.

## Direção visual

Estética "engineering dossier premium":
- fundo off-white ou cinza técnico;
- grid sutil;
- azul petróleo, grafite e ciano moderado;
- linhas finas;
- cartões técnicos;
- aparência de blueprint executivo;
- tipografia moderna e legível.

Evitar visual gamer, neon excessivo, e-sports, infantil, startup genérica, brilhos exagerados e promessas infladas.

## Restrições de conteúdo

- Não inventar métricas.
- Não inventar patrocinadores.
- Não inventar depoimentos.
- Não inventar pilotos, resultados ou cases.
- Não prometer performance garantida.
- Comunicar parceria, método e valor institucional.

## Estrutura de pastas

```text
src/
  app/
  components/
  data/
  sections/
  styles/
docs/
public/
.codex/
```

## Critérios de conclusão

- `npm run build` sem erros.
- `npm run lint` sem erros bloqueantes.
- Landing page responsiva.
- Conteúdo alinhado ao posicionamento NextGen Sports.
- Documentação preenchida e coerente.

## Comandos úteis

```bash
npm install
npm run dev
npm run build
npm run lint
npm run start
```

## Orientação crítica

Quando faltar informação, use linguagem conservadora. Não preencher lacunas com dados fictícios. Se algo depender de validação real, marcar como etapa futura ou necessidade de definição.
