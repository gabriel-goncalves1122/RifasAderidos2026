# AGENTS.md - Secretaria

## Escopo

Este guia vale para `frontend/src/features/secretaria`. A feature reúne as
subáreas Membros e Documentos.

## Estrutura

```txt
secretaria/
├── AGENTS.md
├── index.ts
├── SecretariaView.tsx
├── styles/                  # tokens compartilhados por membros/documentos
├── membros/
│   ├── AGENTS.md
│   ├── MembrosSecretariaView.tsx
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── mappers/
│   ├── types/
│   └── utils/
├── documentos/
│   ├── AGENTS.md
│   ├── DocumentosSecretariaView.tsx
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── constants/
│   ├── types/
│   └── utils/
└── legacy/
    ├── components/
    └── hooks/
```

Somente `index.ts` na raiz pode ser barrel. Subpastas usam imports diretos.

## Navegação

- `Aderidos / Documentos` pertence ao `DashboardHeader`, no mesmo nível de
  `Minhas Rifas / Prêmios` e das tabs da Tesouraria.
- `SecretariaView` recebe `abaAtual` e apenas escolhe a subfeature ativa.
- Não duplique a navegação principal dentro da Secretaria.
- `Aderidos / Comissão` é uma navegação interna exclusiva de Membros.

## Dados E Segurança

- Componentes não chamam backend ou Firebase diretamente.
- Membros usam `membros/services/secretariaService.ts` com `fetchAPI`.
- Documentos enviam arquivo e metadados por multipart para `/admin/documentos`.
- O frontend não grava nem lê `documentos_secretaria` diretamente no Storage.
- Código em `legacy/` não pode voltar ao fluxo principal sem decisão explícita.

## Testes

Espelhe as subfeatures em `tests/features/secretaria/membros`, `documentos` e
`legacy`. Rode:

```bash
cd frontend
npm run test:run -- tests/app tests/features/secretaria
npm run build
```
