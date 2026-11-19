# Ativar Supabase gratuito

Estado atual: código preparado; projeto remoto e usuário ainda não configurados. Não afirmar que a sincronização está ativa antes de executar as etapas e os testes abaixo.

1. Instalar e conectar a integração Supabase no ChatGPT, ou criar um projeto pelo [painel oficial](https://supabase.com/dashboard). Usar conta/organização de José Klak, plano Free, sem contratar plano pago. Não usar organização ou domínio com identidade proibida nas instruções do projeto.
2. Aplicar `supabase.sql` no SQL Editor do projeto. Ele cria uma tabela JSON por usuário, políticas RLS e uma função que verifica revisões antes de salvar.
3. Cadastrar o usuário de José em Authentication → Users pelo painel, usando e-mail e senha definidos pelo próprio usuário. A senha do painel Supabase é diferente da senha de acesso à plataforma. Não colocar senhas, chaves secretas ou service_role no código ou no chat. Não há tela de cadastro público na plataforma.
4. Preencher `cloud-config.js` com a URL `https://<referencia>.supabase.co` e a chave **publishable** (ou anon de projetos antigos). Essas informações são públicas por projeto; a proteção depende das políticas RLS, não de esconder a chave. Nunca usar chave secret/service_role.
5. Antes de publicar a configuração, verificar no projeto real: acesso sem autenticação não lê/escreve os dados; usuário A não lê ou modifica quadro do usuário B; primeira gravação cria revisão 1; uma gravação com revisão antiga é rejeitada; e-mail e senha corretos permitem abrir o quadro.
6. Publicar o código em `JoseKlak/trello2`, branch `main`, já usada no Pages. Entrar em dois navegadores, criar uma fábrica e uma atividade, e confirmar que o segundo recebe a atualização. Fazer alterações concorrentes para confirmar que aparece o aviso de conflito, sem sobrescrita automática.
7. Se houver dados locais antigos, entrar na conta nesse mesmo navegador e usar Ferramentas → Importar dados deste navegador. A senha antiga abre o cofre local, e a confirmação envia os dados à conta. Exportar uma cópia da nuvem antes de substituir um quadro já preenchido. Os dados locais antigos são preservados.

## Custo e limites

O projeto deve permanecer no plano Free. Conferir [preços oficiais](https://supabase.com/pricing) antes da criação: há limites de armazenamento/tráfego e pausa após inatividade. Não adicionar forma de pagamento ou fazer upgrade automaticamente. Manter backups exportados; a aplicação não depende de recursos pagos.

## Validação disponível sem conexão

`npm test` valida regras de importação, planejamento anual, criptografia local e o adaptador de nuvem com cliente simulado (leitura, revisão de gravação e conflito). Esses testes não substituem a validação das políticas SQL e a sincronização em um projeto real. A configuração permanece vazia até essa etapa.
