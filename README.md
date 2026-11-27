# Demandas · José Klak

Quadro pessoal inspirado no fluxo visual do Trello. Interface estática compatível com GitHub Pages, com suporte opcional a login e sincronização pelo Supabase gratuito.

## Ativar sincronização

O projeto gratuito do Supabase está conectado e `cloud-config.js` está configurado com URL e chave publicável. Esquema, isolamento e gravação autenticada foram verificados no banco real. O usuário foi criado por José, que confirmou a publicação no GitHub Pages em `JoseKlak/trello2`. Consulte [SETUP_SUPABASE.md](SETUP_SUPABASE.md).

No modo nuvem, o Supabase Auth verifica e-mail e senha. O banco guarda um documento JSON por usuário, protegido por políticas de acesso (RLS). A gravação confere a revisão anterior para rejeitar alterações simultâneas que sobrescreveriam outro aparelho. Atualizações são consultadas a cada 15 segundos enquanto a página está visível, sem modal, campo em edição ou gravação pendente. Edições offline ficam em memória até conseguir salvar ou exportar um backup; o app avisa antes de sair com alterações não sincronizadas. Não é uma aplicação offline-first.

Backups do modo nuvem são JSON sem criptografia, para portabilidade. Backups antigos criptografados podem ser importados após o login, com a senha antiga. A restauração substitui o quadro da conta. Nenhuma migração local é feita sem confirmação. A sessão autenticada fica somente em memória, exigindo novo login ao recarregar a página.

## Usar no modo local (enquanto a nuvem não estiver configurada)

No primeiro acesso, crie uma senha de pelo menos oito caracteres. A senha é específica daquele navegador, não é uma conta na internet. Os dados são criptografados com AES-GCM e uma chave derivada por PBKDF2/SHA-256 (310.000 iterações), e salvos em `localStorage`. Sem recuperação de senha. A senha e as demandas não são enviadas ao GitHub.

Não há sincronização automática: cada aparelho tem seu próprio quadro. Em Ferramentas, exporte um backup criptografado e restaure no outro aparelho com a senha do backup. A restauração substitui a base local. Limpar os dados do navegador apaga o quadro; guarde backups regularmente. Esta solução depende da integridade do código servido e do dispositivo e não substitui autenticação de servidor.

## Recursos

- Listas e cartões, edição de descrições e checklists; mover cartões arrastando ou pelo seletor de lista no celular.
- Arquivamento de uma lista com todos os cartões pelo menu da lista. O conteúdo e as horas são preservados; restaurar em Ferramentas → Listas arquivadas. Listas arquivadas deixam de aparecer no quadro e nos destinos para novos cartões, planejamento anual e transferência de pendências. Seus registros continuam nos relatórios e backups.
- Cadastro obrigatório de fábrica em cada atividade; conclusão e edição dos itens.
- Backlog global compartilhado por todas as listas marcadas como semanais.
- Geração idempotente das semanas de um ano, considerando segundas-feiras que pertencem ao ano, com cinco checklists diários.
- Transferência de pendências entre cartões, preservando o histórico de horas no cartão onde foram lançadas.
- Lançamentos manuais de minutos por data, fábrica e atividade; relatório filtrado e CSV.
- Importação de JSON de quadro ou cartão do Trello, prévia e associação obrigatória das fábricas. IDs de origem impedem reimportação. Backlogs semanais deduplicam por texto normalizado e fábrica.

Importação inicial inclui listas, cartões não arquivados, descrições e checklists. Não inclui anexos, comentários, etiquetas ou automações. Exportações do Trello não contêm necessariamente horas trabalhadas; a plataforma não inventa esses dados. Importações repetidas de um cartão já importado são ignoradas, inclusive alterações posteriores no Trello. Backlog compartilhado mostra a situação atual, sem fotografia histórica por semana.

## Desenvolvimento

Requer Node.js moderno (22+). `npm test` executa os testes; `npm start` serve em http://127.0.0.1:4189. Sem instalação de pacotes.

O cofre local está em `vault.js`; regras de negócio e conversão do Trello em `core.js`; acesso ao Supabase em `cloud.js`. O SDK do Supabase é carregado por CDN somente quando o projeto estiver configurado.

## Publicação em GitHub Pages

Em Settings → Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)`. Os arquivos públicos são apenas o código da interface. Nunca coloque um JSON exportado do Trello, backups, senhas ou tokens no repositório.

Este repositório usa exclusivamente a identidade José Klak. Não depende de nenhum domínio ou workspace externo.
