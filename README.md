# Demandas · José Klak

Quadro pessoal inspirado no fluxo visual do Trello. Interface estática compatível com GitHub Pages, com suporte opcional a login e sincronização pelo Supabase gratuito.

## Ativar sincronização

O projeto gratuito do Supabase está conectado e `cloud-config.js` está configurado com URL e chave publicável. Esquema, isolamento e gravação autenticada foram verificados no banco real. O usuário foi criado por José, que confirmou a publicação no GitHub Pages em `JoseKlak/trello2`. Consulte [SETUP_SUPABASE.md](SETUP_SUPABASE.md).

No modo nuvem, o Supabase Auth verifica e-mail e senha. O banco guarda um documento JSON por usuário, protegido por políticas de acesso (RLS). A gravação confere a revisão anterior para rejeitar alterações simultâneas que sobrescreveriam outro aparelho. Atualizações são consultadas a cada 15 segundos enquanto a página está visível, sem modal, campo em edição ou gravação pendente. Edições offline ficam em memória até conseguir salvar ou exportar um backup; o app avisa antes de sair com alterações não sincronizadas. Não é uma aplicação offline-first.

Backups do modo nuvem são JSON sem criptografia, para portabilidade. Backups antigos criptografados podem ser importados após o login, com a senha antiga. A restauração substitui o quadro da conta. Nenhuma migração local é feita sem confirmação. A sessão autenticada fica no armazenamento do navegador por até 24 horas desde o login. F5 restaura o acesso dentro desse prazo; a renovação dos tokens não prolonga a janela. Sair limpa a sessão salva. Se o navegador bloquear o armazenamento, o acesso permanece somente na página atual. A senha não é armazenada. O prazo é aplicado pela interface/armazenamento do cliente; não altera a configuração de sessões do servidor.

## Usar no modo local (enquanto a nuvem não estiver configurada)

No primeiro acesso, crie uma senha de pelo menos oito caracteres. A senha é específica daquele navegador, não é uma conta na internet. Os dados são criptografados com AES-GCM e uma chave derivada por PBKDF2/SHA-256 (310.000 iterações), e salvos em `localStorage`. Sem recuperação de senha. A senha e as demandas não são enviadas ao GitHub.

Não há sincronização automática: cada aparelho tem seu próprio quadro. Em Ferramentas, exporte um backup criptografado e restaure no outro aparelho com a senha do backup. A restauração substitui a base local. Limpar os dados do navegador apaga o quadro; guarde backups regularmente. Esta solução depende da integridade do código servido e do dispositivo e não substitui autenticação de servidor.

## Recursos

- Listas e cartões, edição de descrições e checklists; mover cartões arrastando ou pelo seletor de lista no celular.
- O arraste dos cartões salva a posição dentro da lista e entre listas, com indicador de inserção e rolagem nas listas longas. Alt + ↑/↓ reordena o cartão focado pelo teclado. A consulta de atualizações da nuvem aguarda o término do arraste.
- Menu ··· no cartão e no cabeçalho de cada checklist, com exclusão mediante confirmação. As horas registradas permanecem no histórico. No backlog compartilhado, a remoção oculta somente naquele cartão, com opção de exibi-lo novamente pelo menu do cartão. Checklists têm espaçamento e divisórias para facilitar a leitura; a ordenação por fábrica fica no menu do checklist.
- Na criação de cartões, escolher título e template. O template Semana usa o backlog compartilhado e cinco checklists vazios no padrão `DD/MM/AA - segunda` até sexta. A semana é sugerida pelas datas do título (ano explícito ou o ano selecionado no campo de data), com prévia e ajuste da segunda-feira. Sem datas no título, sugere a próxima segunda-feira. Cartões antigos mantêm seus nomes originais.
- A janela de criação é compacta. O placeholder do título acompanha a segunda-feira selecionada; aceitar usando o botão → ou ArrowRight no campo vazio. Uma sugestão já aceita acompanha mudanças posteriores de semana; texto personalizado não é sobrescrito. Ao salvar itens ou horas, o cartão retorna à posição rolada, e a posição das listas do quadro é preservada ao atualizar seus dados.
- Gerenciar templates em Ferramentas → Gerenciar templates: nomes de checklists fixos, opção de dias com datas automáticas e backlog compartilhado. Templates são salvos na conta. Editar/remover um template não altera os cartões já criados.
- Arquivamento de uma lista com todos os cartões pelo menu da lista. O conteúdo e as horas são preservados; restaurar em Ferramentas → Listas arquivadas. Listas arquivadas deixam de aparecer no quadro e nos destinos para novos cartões, planejamento anual e transferência de pendências. Seus registros continuam nos relatórios e backups.
- Cadastro obrigatório de fábrica em cada atividade; conclusão e edição dos itens.
- Backlog global compartilhado por todas as listas marcadas como semanais.
- Geração idempotente das semanas de um ano, considerando segundas-feiras que pertencem ao ano, com cinco checklists diários.
- Transferência de pendências entre cartões, preservando o histórico de horas no cartão onde foram lançadas.
- Lançamentos manuais de minutos por data, fábrica e atividade; relatório filtrado e CSV.
- Formulário de tempo sem campo de observação; observações antigas são preservadas nos registros.
- Tempo opcional na criação/edição da atividade, com formulários compactos. O campo recebe horas decimais (1,5 = 1h30), e mantém internamente os registros em minutos. Ele representa o total da atividade: alterar o valor substitui o tempo anterior, sem acumular. O formulário de tempo preenche o total atual e permite usar 0 para zerar. Se existirem vários lançamentos antigos, salvar no formulário de tempo os consolida em um único total na data selecionada; eles não são alterados automaticamente ao carregar o quadro. Editar apenas o texto da atividade mantém os lançamentos existentes.
- Backlog oculta automaticamente somente itens com conclusão e SeSuite marcados. Mostrar/Ocultar concluídas abre o histórico; Retomar desmarca ambos e preserva horas e os ciclos de conclusão/reabertura. Novos checks registram completedAt, closedAt e completionHistory. Datas antigas ausentes são apresentadas como desconhecidas. O texto de qualquer atividade só aparece riscado com ambos os checks marcados.
- Em atividades com tempo, o botão Texto para o SeSuite reúne as atividades concluídas da mesma fábrica e dia, incluindo itens sem horas individuais. A data vem do checklist, com ano explícito ou da semana; sem checklist diário, usa o lançamento de tempo. O texto possui data e tópicos, remove o prefixo da fábrica e permite revisar, copiar ou baixar TXT. Não inventa ações nem envia ao SeSuite.
- Check discreto SeSuite em cada atividade para registrar manualmente se suas horas já foram apontadas no sistema da empresa. É independente da conclusão e do registro local de tempo; começa desmarcado nas atividades antigas. Não envia dados ao SeSuite. O estado é preservado na sincronização, backups, edição e transferência de pendências.
- Itens ordenados por fábrica por padrão. Arrastar pela alça ⠿ muda a posição ou transfere para outro checklist do cartão; a ordem de destino passa a ser manual e fica salva. O menu Ordenar por fábrica restaura a ordenação automática. O arraste usa o mesmo indicador de inserção dos cartões, com a imagem do item, e permite soltar também em checklists vazios. O título permite edição direta por clique, com Salvar/Cancelar e Enter/Esc; o lápis mantém a edição completa. A alça suporta mouse e toque; no teclado, ↑/↓ reordena e PageUp/PageDown transfere para o checklist anterior/seguinte. IDs, conclusão, SeSuite e lançamentos de horas são preservados. Movimentos de/para o backlog alteram a lista compartilhada.
- Títulos de atividades aparecem como Fábrica - título, usando a fábrica associada e evitando prefixos conhecidos duplicados. Ao editar, o campo recebe somente o texto da atividade; a fábrica é selecionada separadamente.
- Cadastros podem guardar nomes anteriores em `aliases`. A leitura dos títulos e a sugestão de fábrica na importação reconhecem esses nomes, preservando o vínculo após renomear uma unidade com sua cidade.
- Novos cartões do template padrão Semana incluem na quarta-feira Safeeds - Programação proxima semana. Se necessário, o cadastro Safeeds é criado ao gerar o cartão. A geração anual também inclui essa rotina nos cartões novos; cartões existentes e templates personalizados não recebem a tarefa automaticamente.
- Importação de JSON de quadro ou cartão do Trello, prévia e associação obrigatória das fábricas. IDs de origem impedem reimportação. Backlogs semanais deduplicam por texto normalizado e fábrica.

Importação inicial inclui listas, cartões não arquivados, descrições e checklists. Não inclui anexos, comentários, etiquetas ou automações. Exportações do Trello não contêm necessariamente horas trabalhadas; a plataforma não inventa esses dados. Importações repetidas de um cartão já importado são ignoradas, inclusive alterações posteriores no Trello. Backlog compartilhado mostra a situação atual, sem fotografia histórica por semana.

## Desenvolvimento

Requer Node.js moderno (22+). `npm test` executa os testes; `npm start` serve em http://127.0.0.1:4189. Sem instalação de pacotes.

O cofre local está em `vault.js`; regras de negócio e conversão do Trello em `core.js`; acesso ao Supabase em `cloud.js`. O SDK do Supabase é carregado por CDN somente quando o projeto estiver configurado.

## Publicação em GitHub Pages

Em Settings → Pages, selecione Deploy from a branch, branch `main`, pasta `/ (root)`. Os arquivos públicos são apenas o código da interface. Nunca coloque um JSON exportado do Trello, backups, senhas ou tokens no repositório.

Este repositório usa exclusivamente a identidade José Klak. Não depende de nenhum domínio ou workspace externo.
