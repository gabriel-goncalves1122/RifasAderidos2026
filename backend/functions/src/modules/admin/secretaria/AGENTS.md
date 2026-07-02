# AGENTS.md - Backend Secretaria

## Escopo
Este módulo lida com as operações de administração (CRUD) de Aderidos e membros da Comissão na Secretaria.
Também expõe os metadados dos Documentos da Secretaria, cujo arquivo binário fica
no Firebase Storage.

## Regras de Transação ACID (Firestore)
- **Criação (`POST /admin/aderidos`)**: A leitura do contador, reserva de bilhetes, índice de e-mail e gravação do aderido ocorrem **dentro da mesma transação (`runTransaction`)**.
  *Nota sobre TOCTOU (Time of check to time of use)*: consultas (`.where()`) continuam apenas como precheck legado. A garantia final de e-mail único usa `indices_usuarios_email/{hash}` lido e criado dentro da transação. Nunca escreva usuário/bilhetes antes de ler contador, índice, usuário futuro e bilhetes da faixa planejada.
  *Compatibilidade legada*: se `contadores/aderidos` não existir ou estiver incompleto, o service reconstrói um fallback a partir de `usuarios` e `bilhetes` antes da transação, relê o contador dentro da transação e inicializa/continua a faixa sem exigir criação manual no Firestore.
- **Edição (`PUT /admin/aderidos/:id`)**: A leitura do estado atual do aderido (`.get()`) e a atualização (`.update()`) ocorrem dentro da mesma transação para prevenir condições de corrida. Validações de mudança de status (`ativo` para `pendente` restrito) ocorrem em memória dentro do *handler* da transação.
- **Custom Claims**: A atualização das *custom claims* via Auth Admin SDK não participa das transações do Firestore. Deve sempre ser executada *após* o commit com sucesso da transação do banco.
- **Documentos (`/admin/documentos`)**: metadados ficam em `documentos_secretaria`.
  Criação/edição recebem multipart após autenticação e autorização. O arquivo é
  validado e gravado pelo Admin SDK; clientes web não acessam o Storage direto.
  Se o Firestore falhar depois do upload, remova o arquivo novo. Na substituição,
  remova o arquivo anterior apenas depois do commit dos metadados.

## Contratos REST
Sempre exporte os contratos em `secretariaTypes.ts` (ex: `GetAderidosResponse`, `PostAderidoRequest`) e certifique-se de que o Frontend importe a estrutura exata.
Para documentos, mantenha contratos específicos em `documentos/documentosSecretariaTypes.ts`.

Rotas ativas:
- `GET /admin/documentos`
- `POST /admin/documentos`
- `PUT /admin/documentos/:id`
- `GET /admin/documentos/:id/conteudo`

Essas rotas usam `validateToken + requireSecretariaOrAdmin`.

## Erros e Validação
- Todas as rotas passam pelo middleware `validate(...)` que utiliza schemas do `Yup` em `schemas/secretariaSchemas.ts`.
- Lance exceções usando a classe global `AppError` e repasse via `next(error)` no Controller. O middleware global de erro padronizará o JSON de saída.
- Schemas de documentos validam os metadados editáveis; o helper de upload
  valida MIME e tamanho do arquivo recebido.
- O parser multipart limita um arquivo a 25 MB. MIME, tamanho, autor e
  `storagePath` são derivados pelo backend e nunca confiados ao payload cliente.
