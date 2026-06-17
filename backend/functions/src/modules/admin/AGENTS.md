# AGENTS.md - Modulo Admin

## Escopo

Este modulo agrupa as rotas administrativas do sistema: secretaria e compac.

Ele cobre:
- CRUD de aderidos (secretaria);
- importacao de aderidos por CSV;
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

## Secretaria

Responsabilidades:
- listar, adicionar, editar e desativar aderidos;
- importar aderidos em lote por CSV;
- cada operacao valida email, nome e cargo.

Nao exponha dados sensiveis (email completo em logs, tokens) nos retornos.

## Compac

Responsabilidades:
- gestao de comissoes e pagamentos da comissao.
- (detalhes especificos quando houver mais documentacao)

## Rotas

```
GET    /admin/aderidos
POST   /admin/aderidos
PUT    /admin/aderidos/:id
DELETE /admin/aderidos/:id
POST   /admin/aderidos/importar
GET    /admin/compac
...
```

## Testes

Testes ficam em `backend/functions/tests/admin`.

Siga `backend/functions/tests/AGENTS.md`.
