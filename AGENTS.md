# AGENTS.md — Sistema de Rifas

## Papel do agente

Você é um agente de engenharia de software trabalhando no projeto `sistema-rifas`.

O projeto possui:

- frontend em React + Vite + TypeScript + MUI + Firebase Web SDK;
- backend em Firebase Functions + Express + TypeScript + Firestore/Admin SDK.

Antes de editar qualquer arquivo, leia a estrutura atual do projeto, entenda o contexto da tarefa e proponha um plano curto.

## Regra principal

Faça mudanças pequenas, seguras e testáveis.

Não faça grandes refatorações sem explicar antes:

1. quais arquivos pretende alterar;
2. por que a mudança é necessária;
3. quais testes pretende rodar;
4. qual risco existe.

## Escopo padrão

A prioridade atual do projeto está no frontend, especialmente na área de tesouraria Pix/PagBank.

Não altere backend sem autorização explícita.

## Proibições globais

Não fazer sem autorização:

1. alterar backend;
2. criar endpoints reais PagBank;
3. alterar autenticação;
4. alterar regras do Firebase;
5. alterar `.env.local`;
6. versionar credenciais;
7. apagar arquivos legados definitivamente;
8. remover testes sem substituir por testes equivalentes;
9. criar integração direta do frontend com a API PagBank.

## Segurança

Nunca versionar:

```txt
.env
.env.local
.env.*.local
backend/banco-local
firebase-export
chave privada
service account
credentials
arquivos com secret
```

Antes de commit, verificar:

```bash
git status
```

## Cuidados com comandos no terminal

Ao criar arquivos com `cat`, use delimitadores claros.

Correto:

```bash
cat > caminho/do/arquivo.tsx <<'EOF'
conteúdo completo
EOF
```

Errado:

```txt
EOF;</Box>
EOF,return ...
```

Se um arquivo ficar corrompido por comando mal fechado, sobrescreva o arquivo inteiro.

Após criar ou sobrescrever arquivos, rode:

```bash
npm run build
```

ou, quando estiver no frontend:

```bash
cd frontend
npm run build
```

## Fluxo obrigatório de trabalho

Sempre siga este fluxo:

1. entender a tarefa;
2. identificar arquivos envolvidos;
3. propor plano curto;
4. alterar o mínimo necessário;
5. atualizar imports;
6. atualizar testes;
7. rodar ou sugerir testes;
8. rodar ou sugerir build;
9. listar o que mudou;
10. listar pendências.

## Arquitetura geral

Estrutura geral esperada:

```txt
sistema-rifas/
├── frontend/
├── backend/
└── AGENTS.md
```

O frontend segue arquitetura por feature.

O backend segue arquitetura por módulos.

## Comandos úteis

Frontend:

```bash
cd frontend
npm run dev -- --host 0.0.0.0
npm run test:run
npm run build
```

Backend/emuladores:

```bash
cd backend

firebase emulators:start \
  --project rifasaderidos2026 \
  --only firestore,auth,storage,functions \
  --import banco-local \
  --export-on-exit banco-local
```

## Git

Antes de commit:

```bash
git status
npm run build
```

Se a mudança for no frontend, também rode testes relacionados.

Exemplo de commit:

```bash
git commit -m "refactor(frontend): improve responsive treasury Pix views"
```

## Prioridade atual

A prioridade imediata é melhorar a experiência mobile da tesouraria Pix, mantendo desktop funcional e testes verdes.
