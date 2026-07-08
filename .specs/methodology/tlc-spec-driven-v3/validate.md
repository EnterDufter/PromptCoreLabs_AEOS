# TLC Spec-Driven v3 - VALIDATE

**Tipo**: Validacao da metodologia  
**Entrada**: `specify.md`, `design.md`, `tasks.md`, `execute.md` e templates instalados  
**Status**: Aprovado pelo usuario  
**Data**: 2026-06-30  

## 1. Objetivo

Definir os criterios de validacao da metodologia TLC Spec-Driven v3 e o checklist de conformidade para futuras iniciativas em `C:\PromptCore_Labs`.

## 2. Criterios de Validacao da Metodologia

| ID | Criterio | Aceite |
|---|---|---|
| TLC-VAL-001 | A metodologia possui cinco etapas. | Existem `specify.md`, `design.md`, `tasks.md`, `execute.md` e `validate.md`. |
| TLC-VAL-002 | A metodologia esta separada dos apps. | Artefatos metodologicos ficam em `.specs\methodology\tlc-spec-driven-v3\`. |
| TLC-VAL-003 | Templates existem para web. | `.specs\apps\web\_template\` contem cinco artefatos e README. |
| TLC-VAL-004 | Templates existem para mobile. | `.specs\apps\mobile\_template\` contem cinco artefatos e README. |
| TLC-VAL-005 | Templates existem para projects. | `.specs\projects\_template\` contem cinco artefatos, README e STATE. |
| TLC-VAL-006 | RAG existe. | `rag.md` registra decisoes, premissas e proximas integracoes. |
| TLC-VAL-007 | Nao ha codigo de aplicacao. | A instalacao nao cria `src`, componentes, apps ou runtime. |
| TLC-VAL-008 | Transicoes sao governadas. | Cada etapa declara pre-condicoes e aprovacao esperada. |

## 3. Checklist de Conformidade TLC-v3 Para Specs Futuras

- [ ] A iniciativa esta no caminho correto: `apps`, `projects` ou outro dominio aprovado.
- [ ] O slug e explicito e nao generico.
- [ ] `specify.md` existe antes de `design.md`.
- [ ] `specify.md` declara dentro e fora do escopo.
- [ ] Requisitos funcionais possuem IDs.
- [ ] Requisitos nao funcionais possuem IDs.
- [ ] Criterios de seguranca possuem IDs.
- [ ] Criterios de qualidade possuem IDs.
- [ ] Fontes de verdade foram declaradas.
- [ ] Premissas e incertezas foram registradas.
- [ ] `design.md` referencia a spec aprovada.
- [ ] `tasks.md` referencia o design aprovado.
- [ ] `execute.md` registra o que foi feito e evidencias.
- [ ] `validate.md` registra resultado, pendencias e aceite.
- [ ] Mudancas de escopo retornam para SPECIFY.
- [ ] Decisoes relevantes sao registradas em RAG ou STATE.

## 4. Regras de Auditoria

| ID | Regra | Aplicacao |
|---|---|---|
| TLC-AUD-001 | Sem etapa fantasma. | Nao aceitar tasks sem design aprovado. |
| TLC-AUD-002 | Sem escopo implicito. | Nao aceitar implementacao de requisito ausente da spec. |
| TLC-AUD-003 | Sem mistura de dominios. | Metodologia nao deve conter conteudo especifico de app. |
| TLC-AUD-004 | Sem perda de rastro. | Mover arquivos exige README ou registro equivalente. |
| TLC-AUD-005 | Sem segredo em texto. | Credenciais e tokens nao podem aparecer em specs. |
| TLC-AUD-006 | Sem aprovacao automatica. | Ferramentas e agentes nao aprovam gates sozinhos. |

## 5. Padroes de Qualidade

- Precisao de escopo.
- Simplicidade.
- Baixo acoplamento entre metodologia e projetos.
- Rastreabilidade por IDs.
- Criterios de aceite testaveis.
- Registro de decisoes.
- Compatibilidade com automacao futura.
- Linguagem clara e operacional.

## 6. Criterios de Aceite Para Specs Futuras

Uma spec futura sera aceita quando:

- estiver na pasta correta;
- usar o template adequado;
- declarar objetivo, escopo e nao-escopo;
- possuir requisitos com IDs e criterios de aceite;
- declarar arquitetura de dados quando houver dados;
- declarar seguranca e qualidade;
- registrar decisoes abertas;
- bloquear etapa seguinte ate aprovacao;
- nao misturar projetos ou apps diferentes.

## 7. Resultado Esperado de VALIDATE

Ao final de uma validacao, o auditor deve declarar um dos estados:

- `Aprovado`
- `Aprovado com ressalvas`
- `Reprovado - retornar para EXECUTE`
- `Reprovado - retornar para DESIGN`
- `Reprovado - retornar para SPECIFY`

## 8. Estado Atual

Documento de validacao aprovado pelo usuario para orientar auditorias futuras do fluxo TLC-v3.
