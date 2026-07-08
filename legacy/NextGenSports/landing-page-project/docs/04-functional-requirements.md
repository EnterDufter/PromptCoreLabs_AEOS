# Requisitos Funcionais

## Requisitos técnicos

- Next.js com App Router.
- TypeScript em modo estrito.
- Tailwind CSS para estilos.
- Conteúdo centralizado em `src/data/landingContent.ts`.
- Seções independentes em `src/sections`.
- Componentes reutilizáveis em `src/components`.

## Responsividade

- Layout funcional em mobile, tablet e desktop.
- CTAs empilhados em telas pequenas.
- Cards em uma coluna no mobile e grade progressiva em telas maiores.
- Textos sem sobreposição ou corte.

## Acessibilidade

- HTML semântico.
- Contraste suficiente entre texto e fundo.
- Foco futuro em estados visíveis para navegação por teclado.
- Links com texto claro.

## Performance

- Evitar bibliotecas desnecessárias.
- Usar CSS e componentes leves.
- Carregar fontes com `next/font`.
- Manter imagens otimizadas quando forem adicionadas.

## Manutenção

- Não duplicar copy em múltiplos componentes.
- Não inventar dados.
- Preservar a estrutura de pastas definida.
- Complementar documentação quando a estratégia mudar.
