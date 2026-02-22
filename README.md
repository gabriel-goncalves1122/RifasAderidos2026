# 🎟️ Portal da Comissão - Sistema de Gestão de Rifas

![Status](https://img.shields.io/badge/Status-Produção-success)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)

Plataforma web completa desenvolvida para automatizar a arrecadação financeira da comissão de formatura da Universidade Federal de Itajubá (UNIFEI). O sistema digitaliza o processo de venda de rifas, auditoria de pagamentos via PIX e fornece métricas de desempenho em tempo real.

---

## 🚀 Funcionalidades Principais

### 👤 Área do Aderido
* **Autenticação Segura:** Login protegido com Firebase Authentication.
* **Reserva de Rifas:** Seleção de números com bloqueio de concorrência em tempo real.
* **Checkout Integrado:** Modal de pagamento com QR Code dinâmico, cópia de chave PIX e upload de comprovante (imagem ou PDF).
* **Meus Bilhetes:** Visualização do status das compras (Pendente, Aprovado, Recusado).

### 💼 Painel da Tesouraria (Acesso Administrativo)
* **Auditoria de Pagamentos:** Tabela de aprovação rápida com visualizador de comprovantes em anexo.
* **Visão Gráfica (Dashboard):** Acompanhamento de metas de arrecadação, conversão de vendas e top vendedores.
* **Histórico Detalhado:** Registro imutável de todas as transações da comissão agrupadas por lote.
* **Exportação de Dados:** Geração de relatórios financeiros em Excel (CSV) com aplicação de filtros dinâmicos de busca.

---

## 🛠️ Arquitetura e Tecnologias

O projeto adota uma arquitetura *Serverless*, garantindo alta disponibilidade e custo de manutenção próximo a zero.

**Frontend (Client-Side):**
* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) - Construção rápida e otimizada da interface.
* [TypeScript](https://www.typescriptlang.org/) - Tipagem estática para maior segurança do código.
* [Material UI (MUI)](https://mui.com/) - Biblioteca de componentes visuais com design responsivo e paleta customizada (Verde Imperial e Dourado).
* [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) - Validação robusta de formulários.
* [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) - Suite de testes unitários e de integração (100% de cobertura nos componentes críticos).

**Backend (BaaS - Firebase):**
* **Firestore Database:** Banco de dados NoSQL em tempo real para controle de estado das rifas.
* **Cloud Functions:** Regras de negócio encapsuladas no backend (Node.js/TypeScript) para garantir a integridade das transações e evitar fraudes.
* **Cloud Storage:** Armazenamento seguro dos comprovantes de pagamento.
* **Hosting:** Distribuição do frontend via CDN global.

---

## 📱 Responsividade e UX
A interface foi projetada com foco em usabilidade móvel (*Mobile-First*). Tabelas de dados complexos (como o histórico de transações) adaptam-se para *Cards* interativos em telas menores, eliminando a necessidade de scroll horizontal, melhorando a acessibilidade e a experiência do utilizador.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js (v18 ou superior)
* CLI do Firebase (`npm install -g firebase-tools`)

### Instalação

1. Clone o repositório:
```bash
git clone [https://github.com/seu-usuario/sistema-rifas.git](https://github.com/seu-usuario/sistema-rifas.git)
