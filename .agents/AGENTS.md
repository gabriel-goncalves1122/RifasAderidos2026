# AGENTS.md - Sistema De Rifas (Guia Global)

## 1. Papel Do Agente e Escopo Padrão
Você é um agente de engenharia autônomo trabalhando no projeto `sistema-rifas`. 
O projeto possui um **Frontend** (React, Vite, TypeScript, MUI, Firebase Web SDK) e um **Backend** (Firebase Functions v2, Express, TypeScript, Firestore/Admin SDK).

Faça mudanças pequenas, seguras e testáveis. Para refatorações amplas, explique antes os arquivos afetados, a necessidade, os testes e os riscos.

> [!IMPORTANT]  
> **LEI DE CONTEXTO LOCAL (OBRIGATÓRIO):** 
> Este é o guia global. O sistema é escalável e cada módulo possui suas peculiaridades. **Sempre que você for alterar arquivos dentro de um módulo ou feature específica (ex: `frontend/src/features/tesouraria` ou `backend/functions/src/modules/admin`), VOCÊ DEVE OBRIGATORIAMENTE usar a ferramenta `view_file` para ler o arquivo `AGENTS.md` que está dentro daquele diretório antes de fazer qualquer mudança de código.** Os guias de módulo complementam este guia global.

## 2. Leis Globais de Arquitetura (Inquebráveis)

### 2.1 Garantias Transacionais (ACID)
Operações financeiras (reservas de rifas, webhooks Pix, aprovações, recusas, devoluções) DEVEM usar `runTransaction` do Firestore.
- **TOCTOU:** Faça a leitura dos documentos DENTRO da transação, nunca fora. 
- Não use `set`/`update` individuais separados sem transação em fluxos que envolvam mais de um documento dependente.

### 2.2 Contrato Entre Camadas e Schema
- O backend DEVE exportar os tipos TypeScript de request e response. O frontend consome esses mesmos tipos. Nunca quebre um contrato usado no frontend.
- **CamelCase em APIs:** O backend deve retornar DTOs em `camelCase` para o frontend, enquanto as chaves locais e schemas do Firestore permanecem em `snake_case`. A conversão deve ocorrer na camada de serviços do backend, na borda da API.
- **Sincronia de Mocks:** Qualquer alteração em um DTO ou contrato de API exige a atualização simultânea e imediata de todos os `mocks` utilizados nos testes do Frontend que consomem esse contrato. Mocks desatualizados quebram testes silenciosamente.
- Utilize `validate` (com Yup) nos roteadores do Express do Backend.
- Prefira `interface` exportada a `any` em parâmetros.

### 2.3 Barrel Policy
- Cada feature pode ter UM único `index.ts` na raiz, exportando apenas o componente ou hook público.
- Subpastas (`components/`, `hooks/`, `utils/`, `services/`, `types/`) NÃO devem ter barrels. Todos os imports internos são por caminho direto.

### 2.4 Utilitários e Design Compartilhado
- Funções de uso genérico (`formatarMoeda`, `formatarData`, `sanitizarNome`) DEVEM ficar em `shared/utils/`. Não duplique formatadores entre features locais.
- Tokens de design, temas e motion compartilhados DEVEM migrar para `shared/tokens/`.

### 2.5 Interface Mobile (Safe Areas)
- Componentes fixos, Sidebars, Drawers e Headers no mobile DEVEM implementar recuos dinâmicos para contornar notches e barras do sistema. Utilize `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)` nos `sx` (ex: `pt: { xs: "max(16px, env(safe-area-inset-top))", sm: 3 }`).

### 2.6 Separação de Preocupações de Estado (Financeiro vs Cadastral)
- O status principal da rifa (ex: `pago`, `recusado`) é puramente transacional. Demandas puramente cadastrais (ex: refazer upload, corrigir nome) devem usar flags auxiliares, como `correcao_pendente`.
- Nunca sobreponha ou apague o status de `pago` de uma transação validada por conta de erros cadastrais.
- **Somente Compradores:** Edições cadastrais (nome, email, telefone) devem priorizar a coleção `compradores` como fonte de verdade. A propagação para os documentos desnormalizados (`bilhetes`) é de responsabilidade do backend via transação.

### 2.7 Performance e Processamento de Dados Pesados
- Agregações complexas e lógicas pesadas (como agrupar rifas por comprador em grandes volumes) DEVEM ser feitas no servidor. O frontend deve receber os dados já mastigados, reduzindo travamentos e otimizando a responsividade.

## 3. Padrões de Componentização e Manipulação de Objetos (UI)

### 3.1 Objetos Imutáveis e Única Fonte de Verdade
- Componentes visuais **nunca** mutam objetos (ex: não podem fazer `compra.status = 'pago'`). Todo objeto derivado da API é estritamente *read-only*.
- A atualização da interface após uma ação (como aprovar pagamento) deve ocorrer pela re-validação da query original (ex: via React Query/SWR ou recarregamento do state no controller), garantindo que a fonte da verdade venha do servidor.

### 3.2 Renderização Pura (Smart vs Dumb Components)
- **Smart Components (Páginas e Views Principais):** Usam Controllers/Hooks para buscar dados.
- **Dumb Components (Cards, Rows, Dialogs, Detalhes):** Recebem o **Objeto de Domínio inteiro** como prop (ex: `compra: TransacaoTesouraria`) e callbacks tipados (ex: `onEditar: (id: string) => void`). 
- Proibido espalhar *destructuring* excessivo (passar 20 props string/number isoladas para um Card) quando o componente logicamente representa o Objeto inteiro.
- Proibido injetar requisições de API dentro de Cards de listagem.

### 3.3 Isolamento de Lógica de UI vs Negócio
- Funções que ditam "qual cor exibir com base no status", "qual ícone usar" ou "como formatar a moeda" pertencem à camada de `utils/` ou `styles/`. Componentes não devem possuir blocos `switch/case` longos no meio do JSX para decidir cores.

### 3.4 Ações e Callbacks (Inversão de Controle)
- Componentes de listagem não decidem o que acontece ao clicar num botão "Aceitar". Eles apenas emitem o evento de clique contendo o ID do objeto.
- O `Controller` do escopo maior intercepta a ação, chama o `Service` apropriado, lida com o estado de *loading* (bloqueando múltiplos cliques) e dispara os *toasts* de sucesso/erro.
- Ações destrutivas (excluir, negar) devem sempre possuir *feedback* visual prévio (Confirmação) e posterior (Toast).

## 4. Proibições e Segurança

> [!CAUTION]  
> **Não realizar sem autorização explícita do usuário:**
> - Alterar sistema de autenticação.
> - Alterar `firestore.rules` ou `storage.rules`.
> - Modificar `.env`, `.env.local` ou chaves de *runtime config*.
> - Versionar credenciais, secrets ou arquivos `.json` de chaves. (Se encontrar credencial local, não abra nem copie o conteúdo, salvo necessidade extrema).
> - Criar integrações diretas do frontend com APIs externas sensíveis (ex: Mercado Pago).
> - Apagar arquivos legados definitivamente sem um plano aprovado.
> - Remover testes sem criar cobertura equivalente.

Emails de *super-admin* não devem ser "hardcoded" no código; consuma a variável local ou o banco.

## 5. Fluxo de Trabalho e Comandos

Antes de iniciar, entenda a tarefa, altere o mínimo necessário e não reverta mudanças de outros fluxos de trabalho sem permissão.

**Comandos base na raiz (rodar em terminais paralelos):**
```bash
npm run dev:vite
npm run dev:vite:network
npm run dev:backend:local
```

**Rodando Testes:**
```bash
npm test
npm --prefix frontend run test:run
npm --prefix backend/functions test
```
