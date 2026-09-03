# AGENTS.md - Modulo Admin

## Escopo

Este modulo agrupa as rotas administrativas do sistema: secretaria e compac.

Ele cobre:
- CRUD de aderidos (secretaria);
- importacao de aderidos por CSV;
- gestao de documentos da secretaria (upload multipart);
- gestao de compac;
- endpoints administrativos gerais.

## Estrutura

```
modules/admin/
├── AGENTS.md
├── adminController.ts
├── adminRoutes.ts
├── adminService.ts
├── secretaria/
│   ├── secretariaController.ts
│   ├── secretariaService.ts
│   └── helpers/
├── compac/
│   ├── compacController.ts
│   └── compacService.ts
└── types/
    └── adminTypes.ts
```

## Secretaria: Aderidos

- **Criação (`POST /admin/aderidos`)**: A leitura do contador, reserva de bilhetes, índice de e-mail e gravação do aderido ocorrem **dentro da mesma transação (`runTransaction`)**. A garantia de e-mail único usa `indices_usuarios_email/{hash}` dentro da transação.
- **Edição (`PUT /admin/aderidos/:id`)**: A leitura e a atualização ocorrem dentro da mesma transação para prevenir condições de corrida. Validações de mudança de status (`ativo` para `pendente`) ocorrem em memória.
- **Custom Claims**: A atualização das *custom claims* via Auth Admin SDK deve sempre ser executada *após* o commit com sucesso da transação do banco.

## Secretaria: Documentos

- **Metadados**: Gravados no Firestore (`documentos_secretaria`), enquanto o binário fica no Firebase Storage.
- **Upload (`/admin/documentos`)**: Recebe multipart após autenticação e autorização (`requireSecretariaOrAdmin`). O arquivo é validado e gravado pelo Admin SDK; clientes web não acessam o Storage direto. Limite de 25MB. MIME, tamanho, autor e `storagePath` são controlados pelo backend.
- Se o Firestore falhar após o upload, o arquivo novo é removido. Na substituição, remova o arquivo anterior apenas depois do commit.

## Compac

Responsabilidades:
- gestao de comissoes e pagamentos da comissao.
- (detalhes especificos quando houver mais documentacao)

## Rotas Ativas

```
GET    /admin/aderidos
POST   /admin/aderidos
PUT    /admin/aderidos/:id
DELETE /admin/aderidos/:id
POST   /admin/aderidos/importar

GET    /admin/documentos
POST   /admin/documentos
PUT    /admin/documentos/:id
GET    /admin/documentos/:id/conteudo

GET    /admin/compac
...
```

Todas passam por validação `Yup` (`validateToken + requireSecretariaOrAdmin` para docs).

## Erros e Validação

- Lance exceções usando `AppError` e repasse via `next(error)` no Controller.
- Nao exponha dados sensiveis (email completo em logs, tokens) nos retornos.

## Contratos REST

Sempre exporte os contratos em `secretariaTypes.ts` ou `documentosSecretariaTypes.ts` e certifique-se de que o Frontend importe a estrutura exata.

## Testes

Testes ficam em `backend/functions/tests/admin`. Siga `backend/functions/tests/AGENTS.md`.
