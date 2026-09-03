# ⚙️ Sistema de Rifas - Backend (Cloud Functions)

Este é o módulo Backend do sistema de gestão de rifas, operando de forma *Serverless* com **Firebase Cloud Functions (v2)**.

## 🚀 Tecnologias e Arquitetura

- **Ambiente:** Node.js 22 + TypeScript
- **Framework:** Express (para APIs e Webhooks)
- **Banco de Dados:** Cloud Firestore (NoSQL)
- **Autenticação:** Firebase Admin SDK (Validação de tokens via Middleware)

A arquitetura adota serviços modulares encapsulados no diretório `src/modules/`, garantindo que regras de negócio complexas de diferentes escopos não se misturem.

## 📁 Estrutura Principal (`src/modules`)

- `tesouraria/`: Módulo crítico focado na geração e conciliação de pagamentos. Inclui webhooks seguros para o Pix (PagBank/Mercado Pago) e *crons* (tarefas agendadas) que liberam números de bilhetes cujas reservas expiraram.
- `aderidos/`: Operações de leitura/escrita relativas aos próprios compradores (atualização de perfis, consulta segura de rifas do usuário).
- `admin/`: Funções privilegiadas (Auditoria manual, relatórios consolidados).

## ⚠️ Scripts Temporários e Testes

Scripts soltos de desenvolvimento, testes pontuais e migrações (como *clear_tickets* ou simuladores de pagamento) foram movidos e devem permanecer na pasta isolada `scripts/scratch/` (ignorada pelo Git). **Nunca suba chaves privadas (.json) ou dados sensíveis.**

## 🛠️ Como Executar Localmente

Utilizamos os **Emuladores do Firebase** para rodar o Firestore, Storage e Functions localmente sem afetar a produção.

```bash
# Na raiz de /backend/functions, instale as dependências
npm install

# Build e Iniciar os emuladores (Recomendado)
npm run dev:emulators

# Rodar os testes unitários
npm run test:unit
```

Ao rodar os emuladores, um banco de dados local será provisionado. Acesse a Firebase Emulator UI na porta `4000` (`http://localhost:4000`).

## 🔐 Variáveis de Ambiente e Segredos (Produção)

No ambiente de produção (Cloud Functions), **NÃO** fazemos deploy de arquivos `.env` contendo credenciais críticas (como tokens do Mercado Pago e senhas SMTP). 

Utilizamos o **Google Cloud Secret Manager** integrado ao Firebase. Para injetar ou atualizar segredos de produção, utilize a CLI do Firebase:

```bash
# Definir um novo segredo (o terminal pedirá o valor)
firebase functions:secrets:set MERCADOPAGO_ACCESS_TOKEN

# Listar segredos disponíveis
firebase functions:secrets:get

# Acessar um segredo no código:
# const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
```

> **Nota:** Certifique-se de que a conta de serviço do Firebase possui permissão de leitura no Secret Manager.
