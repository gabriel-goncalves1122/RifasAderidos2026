# AGENTS.md — Frontend

## Escopo

Este arquivo vale para tudo dentro de `frontend/`.

O frontend usa:

- React;
- Vite;
- TypeScript;
- MUI;
- Firebase Web SDK;
- Vitest;
- React Testing Library.

## Regra principal

O frontend deve ser organizado por feature.

Evite criar novas pastas genéricas como `controllers`.

Use:

```txt
hooks      → lógica de estado e integração de tela
services   → chamadas de API e integrações externas via backend
types      → tipos TypeScript
utils      → funções puras e formatadores
components → componentes visuais
pages      → composição de página
mocks      → dados temporários de desenvolvimento/teste
legacy     → código legado isolado
```

## Estrutura esperada

```txt
src/
├── app/
├── shared/
│   ├── components/
│   ├── config/
│   ├── hooks/
│   ├── services/
│   └── types/
├── features/
│   ├── aderidos/
│   ├── auth/
│   ├── premios/
│   ├── rifas/
│   ├── secretaria/
│   └── tesouraria/
└── views/
```

## Testes

Os testes devem espelhar a estrutura do `src`.

Exemplo:

```txt
src/features/tesouraria/components/pix/mobile/PixTransacaoCard.tsx
tests/features/tesouraria/components/pix/mobile/PixTransacaoCard.test.tsx
```

Use Vitest + React Testing Library.

Prefira:

```txt
getByText
getByRole
getByPlaceholderText
getByLabelText
queryByText
```

Evite depender de classe CSS gerada pelo MUI.

Para moeda formatada, use regex:

```ts
expect(screen.getByText(/R\$\s*30,00/)).toBeInTheDocument();
```

## MUI e visual

Usar o padrão visual atual do sistema:

```txt
Verde escuro: #063D31
Preto/esverdeado: #021B16
Cinza texto: #526760
Fundo suave: #F6F8F7
Verde claro: #EAF3EF
Branco: #FFFFFF
Alerta suave: #FFF7E0
Alerta texto: #6B4E00
Erro suave: #FDF0F0
Erro texto: #7A1F1F
```

Evite azul vibrante, roxo ou cores que não combinem com a identidade atual.

Componentes devem usar:

```txt
Paper elevation={0}
borda leve
borderRadius entre 2 e 4
sombra sutil quando fizer sentido
valores financeiros com fontWeight alto
textos auxiliares em cinza
```

## Mobile

Mobile não é desktop espremido.

Para mobile:

1. evitar tabelas;
2. usar cards;
3. usar ações fáceis de tocar;
4. truncar textos longos;
5. evitar excesso de informação;
6. priorizar leitura rápida;
7. usar filtros horizontais quando fizer sentido.

## MUI e JSDOM

Se precisar mockar `navigator.clipboard`, não use `Object.assign`.

Use:

```ts
Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});
```

## Comentários no código

Comente apenas o que ajuda manutenção:

- regra de negócio;
- decisão de arquitetura;
- fallback temporário;
- compatibilidade legada;
- integração;
- ponto não óbvio.

Não comente o óbvio linha a linha.

## Comandos

Rodar frontend:

```bash
npm run dev -- --host 0.0.0.0
```

Rodar testes:

```bash
npm run test:run
```

Rodar build:

```bash
npm run build
```

## Antes de finalizar tarefa frontend

Sempre sugerir ou rodar:

```bash
npm run build
```

Se alterou testes ou componentes:

```bash
npm run test:run -- caminho/dos/testes
```

## Arquivos de ambiente

Não alterar `.env.local` sem autorização.

Não versionar `.env.local`.

## Integrações

O frontend não deve chamar diretamente APIs sensíveis externas, como PagBank.

O frontend deve consumir o backend do sistema.
