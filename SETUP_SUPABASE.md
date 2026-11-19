# Ativar Supabase gratuito

Estado atual: projeto remoto `pnwlbqmovmwltvaptejn` conectado no plano Free; esquema aplicado e políticas de acesso verificadas. A configuração com chave publicável está pronta localmente. Falta José definir sua senha de usuário no Supabase e confirmar o destino de hospedagem desta plataforma antes de publicar a ativação.

1. Integração já conectada. Projeto existente e saudável na organização pessoal de José, plano Free. Não é necessário criar outro projeto.
2. Aplicar `supabase.sql` no SQL Editor do projeto. Ele cria uma tabela JSON por usuário, políticas RLS e uma função que verifica revisões antes de salvar.
3. Cadastrar o usuário de José em Authentication → Users pelo painel, usando e-mail e senha definidos pelo próprio usuário. A senha do painel Supabase é diferente da senha de acesso à plataforma. Não colocar senhas, chaves secretas ou service_role no código ou no chat. Não há tela de cadastro público na plataforma.
4. Preencher `cloud-config.js` com a URL `https://<referencia>.supabase.co` e a chave **publishable** (ou anon de projetos antigos). Essas informações são públicas por projeto; a proteção depende das políticas RLS, não de esconder a chave. Nunca usar chave secret/service_role.
5. Antes de publicar a configuração, verificar no projeto real: acesso sem autenticação não lê/escreve os dados; usuário A não lê ou modifica quadro do usuário B; primeira gravação cria revisão 1; uma gravação com revisão antiga é rejeitada; e-mail e senha corretos permitem abrir o quadro.
6. Publicar o código em `JoseKlak/trello2`, branch `main`, já usada no Pages. Entrar em dois navegadores, criar uma fábrica e uma atividade, e confirmar que o segundo recebe a atualização. Fazer alterações concorrentes para confirmar que aparece o aviso de conflito, sem sobrescrita automática.
7. Se houver dados locais antigos, entrar na conta nesse mesmo navegador e usar Ferramentas → Importar dados deste navegador. A senha antiga abre o cofre local, e a confirmação envia os dados à conta. Exportar uma cópia da nuvem antes de substituir um quadro já preenchido. Os dados locais antigos são preservados.

## Custo e limites

O projeto deve permanecer no plano Free. Conferir [preços oficiais](https://supabase.com/pricing) antes da criação: há limites de armazenamento/tráfego e pausa após inatividade. Não adicionar forma de pagamento ou fazer upgrade automaticamente. Manter backups exportados; a aplicação não depende de recursos pagos.

## Validação realizada

`npm test`: oito testes passaram (importação, planejamento anual, criptografia local e adaptador de nuvem com cliente simulado). No banco real, foi executada uma transação de teste com dois usuários descartáveis: criação, gravação com revisão, rejeição de revisão antiga e isolamento entre usuários. A transação foi revertida; nenhum usuário ou quadro de teste permaneceu. A API real retornou HTTP 401 ao tentar ler sem login; o verificador de segurança do Supabase não apontou alertas. O SDK fixado em 2.119.2 carregou e a tela de login foi conferida no navegador. Falta o teste ponta a ponta em dois aparelhos após José definir sua senha e o destino de publicação.
