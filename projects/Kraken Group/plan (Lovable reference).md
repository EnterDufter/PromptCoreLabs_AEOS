# Plano: subir o projeto Kraken Group ao vivo

## Escopo assumido
- Publicar o site em uma URL do Lovable.
- Sincronizar o código com o repositório `PromptCoreLabs/kraken_group`.
- Habilitar backend para captura real dos leads do quiz (hoje os dados só vão para `localStorage`).
- Usar domínio Lovable gratuito por enquanto.

## Passos

1. **Habilitar Lovable Cloud**
   - Ativar o backend integrado (banco de dados + autenticação) no projeto.
   - Explicar que isso dá acesso a tabelas, server functions e armazenamento sem necessidade de configuração externa.

2. **Criar tabela de leads no banco**
   - Criar uma tabela `public.kraken_leads` para persistir os dados do quiz.
   - Incluir campos: nome, empresa, e-mail, WhatsApp, gargalo, respostas do quiz, pontuação, classificação de risco, fonte da conversão, data, user agent.
   - Aplicar GRANTs e RLS para que leads sejam inseridos anonimamente (público), mas lidos apenas por usuários autenticados.

3. **Criar server function para salvar lead**
   - Substituir o `localStorage` e o `console.log` do `Quiz.tsx` por uma chamada a uma `createServerFn`.
   - A server function insere o lead na tabela do banco via cliente publicável do Supabase.
   - Validação de entrada com Zod.

4. **Ajustar metadados e SEO**
   - Atualizar `src/routes/__root.tsx` para remover o título genérico “Lovable App” e usar metadados da Kraken Group como padrão de fallback.
   - Garantir que `src/routes/index.tsx` já tenha título, descrição, og:title, og:description, og:type e twitter:card (já está feito).

5. **Sincronizar com o GitHub**
   - Conectar o projeto ao repositório `PromptCoreLabs/kraken_group` pelo painel de configurações do Lovable.
   - Commitar o estado atual do projeto.

6. **Publicar o site**
   - Executar o fluxo de publicação do Lovable.
   - Validar que a URL pública carrega corretamente e que o quiz salva os leads no banco.

## O que não será feito agora
- Domínio próprio (pode ser configurado depois em Project Settings → Domains).
- Painel administrativo para visualizar os leads (a persistência no banco fica disponível via Lovable Cloud/Supabase).
- Envio de notificações por e-mail/WhatsApp (a princípio os leads ficam no banco).

## Resultado esperado
- Site público na URL `https://<slug>.lovable.app`.
- Código sincronizado em `PromptCoreLabs/kraken_group`.
- Quiz de diagnóstico salvando leads realmente em banco de dados.
