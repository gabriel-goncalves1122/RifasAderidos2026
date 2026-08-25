#!/usr/bin/env node

function lerArg(nome, padrao) {
  const indice = process.argv.indexOf(`--${nome}`);

  if (indice === -1) return padrao;

  return process.argv[indice + 1] || padrao;
}

async function main() {
  const url = lerArg(
    "url",
    "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/checkout/pix/webhook",
  );
  
  // No Mercado Pago, o webhook envia apenas um ID de pagamento.
  // O backend deve usar esse ID para consultar o endpoint oficial.
  // IMPORTANTE: Para testar localmente esse script sem mock, o ID
  // deve ser de um pagamento válido na sua conta do Mercado Pago Sandbox.
  const paymentId = lerArg("id", "1234567890");

  const payload = {
    action: "payment.updated",
    api_version: "v1",
    data: {
      id: paymentId
    },
    date_created: new Date().toISOString(),
    live_mode: false,
    type: "payment",
    user_id: 123456
  };
  
  const rawBody = JSON.stringify(payload);
  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: rawBody,
  });
  const texto = await resposta.text();

  console.log(`POST ${url}`);
  console.log(`Status HTTP: ${resposta.status}`);
  console.log(texto);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
