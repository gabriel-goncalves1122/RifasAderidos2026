# Status da Arquitetura Atual (Checkout Pix)

Com base no fluxo mapeado no arquivo `02-fluxo-checkout-pix.mermaid.md`, este documento detalha **exatamente como o nosso código está implementado hoje** para atender aos requisitos daquele diagrama e o que pode ser melhorado.

## 1. Onde estamos hoje (O que está funcionando)

A nossa arquitetura atual no frontend já abraçou totalmente a sobrevivência a reloads pesados (como quando o iOS fecha a aba do navegador porque o app do banco consumiu muita memória).

Isso foi construído com 4 pilares principais que já estão em produção:

### A. Persistência Descentralizada com TTL
Nós não temos um estado global central (como Redux ou Context API pesado). Em vez disso, cada hook cuida da sua própria persistência via `localStorage` com Tempo de Vida (TTL) de **35 minutos** usando o `storageWithTTL.ts`.
- `useRifasSelection` salva os números em `checkout_rifas_selecionadas`.
- `useModalStack` salva se o modal estava aberto em `checkout_modal_aberto`.
- `CheckoutModal` (componente) salva os dados digitados do usuário em `checkout_form_data`.
- `useCheckoutPixFlow` salva o QR Code / Copia-e-cola gerado em `checkout_cobranca_pix`.

**Por que isso é bom?** Ao voltar do app do banco e a página recarregar, o componente re-lê o storage e monta a tela exatamente de onde o usuário parou. O timer recomeça o polling com o backend automaticamente.

### B. Resiliência do Polling
O `useCheckoutPixFlow` possui um loop de `setInterval` (`POLLING_INTERVAL_MS = 10_000`) que consulta o endpoint GET `/tesouraria/checkout/pix/{id}` incessantemente até:
1. O backend retornar "pago".
2. O backend retornar "cancelado" ou "expirado".
3. Atingir 180 tentativas (30 minutos exatos, `POLLING_MAX_RETRIES = 180`).

### C. A Fonte da Verdade do Backend e os Webhooks
O backend do Firebase (`checkoutPixWebhookHelper.ts`) é a verdadeira fonte da verdade. 
Se o usuário cancelar o pagamento direto no app do banco (ou não pagar após 30 min), o Mercado Pago envia um Webhook. O backend limpa a trava (`liberarBilhetesNaTransacao`) e converte as rifas para "disponíveis" de novo.

Quando o frontend fizer o próximo polling de 10s, ele receberá o status `cancelado`, acionará a limpeza local `removeItem(STORAGE_KEY_COBRANCA)` e invalidará o cache de rifas na tela.

### D. A Gambiarra de Sobrevivência (Fix Recente)
Nós implementamos o `onResetPix` com o botão **"Tentar Novamente"**. Isso resolve o problema crítico onde o backend cancelava a rifa silenciosamente via Webhook, mas o frontend continuava tentando mostrar o pagamento antigo congelado. Agora, se o status vier `cancelado`, o usuário clica em "Tentar Novamente" e o estado reseta, permitindo que o usuário interaja novamente.

---

## 2. Pontos de Dor na Arquitetura Atual (Oportunidades de Refatoração)

Embora funcional e resiliente, o código sofre de problemas estruturais que deixam a manutenção complexa e deram a sensação de "enxugar gelo":

1. **Fragmentação de Hooks e "Prop Drilling":**
   O `usePainelAderidoController` virou um "Deus". Ele chama dados, seleção, checkout e modais ao mesmo tempo e precisa ficar repassando funções de callback de um hook para o outro.
   *Exemplo:* O `useCheckoutFlow` precisa receber as funções `fecharCheckout`, `limparSelecao` e `invalidarDadosPainel` que vieram de 3 hooks diferentes.

2. **Dupla Persistência (Conflito de Lógica):**
   Descobrimos que existem **dois** arquivos lidando com cache de checkout:
   - `utils/storageWithTTL.ts` (Usado pelos hooks recentes, descentralizado).
   - `utils/checkoutCacheUtils.ts` (Criado numa versão anterior, usando a chave `@SistemaRifas:checkout_ativo`).
   *(Temos código fantasma que precisaremos limpar para não dar conflito).*

3. **Copiar e Colar iOS:**
   Devido às restrições de segurança estritas da Apple, o Safari do iOS exige que o evento de cópia para a área de transferência (`document.execCommand('copy')`) venha *direto, na mesma call stack de forma síncrona* do evento de clique. Como nosso processo lida com reloads pesados e callbacks assíncronos que perdem o foco da thread original, há o risco de falhar silenciosamente no iPhone.

## 3. O Que Devemos Fazer Para Consolidar?

Se formos refatorar visando máxima estabilidade:
- [ ] **Limpeza de Arquivos Zumbis:** Apagar as rotinas legadas de cache como `checkoutCacheUtils.ts` que só geram ruído.
- [ ] **Unificação do Estado:** Centralizar os "pedaços" de LocalStorage dentro do `useCheckoutPixFlow`. Ao invés de o formulário salvar os dados em um lugar e o hook em outro, criarmos um único Objeto `CheckoutState` salvo em uma única chave no storage com as rifas, a cobrança e os dados.
- [ ] **Corrigir o Copy-Paste do iOS nativamente:** Implementar um input visível na tela que já tem o Pix selecionado, onde o botão de copiar seja 100% síncrono.
