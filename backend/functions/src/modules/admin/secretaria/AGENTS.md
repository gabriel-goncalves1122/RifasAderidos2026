# AGENTS.md - Backend Secretaria

## Escopo
Este módulo lida com as operações de administração (CRUD) de Aderidos e membros da Comissão na Secretaria.

## Regras de Transação ACID (Firestore)
- **Criação (`POST /admin/aderidos`)**: A leitura do contador, reserva de bilhetes e gravação do aderido ocorrem **dentro da mesma transação (`runTransaction`)**.
  *Nota sobre TOCTOU (Time of check to time of use)*: Consultas (`.where()`) não são permitidas dentro de transações do Firestore. A checagem de e-mail único é feita antes da transação, mas a gravação final do usuário é transacional.
- **Edição (`PUT /admin/aderidos/:id`)**: A leitura do estado atual do aderido (`.get()`) e a atualização (`.update()`) ocorrem dentro da mesma transação para prevenir condições de corrida. Validações de mudança de status (`ativo` para `pendente` restrito) ocorrem em memória dentro do *handler* da transação.
- **Custom Claims**: A atualização das *custom claims* via Auth Admin SDK não participa das transações do Firestore. Deve sempre ser executada *após* o commit com sucesso da transação do banco.

## Contratos REST
Sempre exporte os contratos em `secretariaTypes.ts` (ex: `GetAderidosResponse`, `PostAderidoRequest`) e certifique-se de que o Frontend importe a estrutura exata.

## Erros e Validação
- Todas as rotas passam pelo middleware `validate(...)` que utiliza schemas do `Yup` em `schemas/secretariaSchemas.ts`.
- Lance exceções usando a classe global `AppError` e repasse via `next(error)` no Controller. O middleware global de erro padronizará o JSON de saída.
