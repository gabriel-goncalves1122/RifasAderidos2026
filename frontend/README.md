# 💻 Sistema de Rifas - Frontend

Este é o módulo Frontend do sistema de gestão de rifas da Comissão. Foi construído com foco em performance e manutenibilidade utilizando React, Vite e TypeScript.

## 🚀 Tecnologias

- **Framework:** React + Vite
- **Linguagem:** TypeScript
- **Estilização:** Material UI (MUI)
- **Gerenciamento de Estado:** React Query
- **Roteamento:** React Router DOM

## 📁 Estrutura Principal (`src/features`)

A arquitetura do projeto segue a separação por *features* (Contextos delimitados), promovendo maior isolamento e facilidade de manutenção:

- `aderidos/`: Interface voltada aos compradores. Contém a lógica de reserva, checkout PIX (PagBank/MercadoPago) e visualização de bilhetes.
- `tesouraria/`: Painel administrativo. Focado na auditoria de compras, visualização de relatórios, gráficos de desempenho e conciliação de transações.
- `secretaria/`: Gestão de documentos, cadastros gerais e controle de acesso.
- `auth/`: Lógica global de autenticação e proteção de rotas com Firebase.

## 🛠️ Como Executar Localmente

Certifique-se de estar na raiz do repositório antes de rodar os comandos ou navegue até esta pasta (`/frontend`).

```bash
# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev

# Rodar testes unitários
npm run test
```

> **Nota:** Para o funcionamento completo do fluxo de reservas, é recomendável rodar os emuladores do Firebase no backend simultaneamente.
