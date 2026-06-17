#!/usr/bin/env node

const { createHmac } = require("crypto");

function lerArg(nome, padrao) {
  const indice = process.argv.indexOf(`--${nome}`);

  if (indice === -1) return padrao;

  return process.argv[indice + 1] || padrao;
}

function assinatura(rawBody, token) {
  return createHmac("sha256", token).update(rawBody, "utf8").digest("base64");
}

async function main() {
  const url = lerArg(
    "url",
    "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/checkout/pix/webhook",
  );
  const orderId = lerArg("order", "ORDE_TESTE_001");
  const status = lerArg("status", "PAID");
  const referenceId = lerArg("reference", "");
  const token = process.env.PAGBANK_WEBHOOK_TOKEN || "dev-token";
  const payload = {
    id: orderId,
    reference_id: referenceId || undefined,
    charges: [
      {
        id: lerArg("charge", "CHAR_TESTE_001"),
        status,
        amount: {
          value: Number(lerArg("valor", "1000")),
        },
        paid_at: status === "PAID" ? new Date().toISOString() : undefined,
        payment_response:
          status === "DECLINED" || status === "CANCELED"
            ? { message: lerArg("motivo", "Pagamento não confirmado pelo banco.") }
            : undefined,
      },
    ],
  };
  const rawBody = JSON.stringify(payload);
  const resposta = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-pagbank-signature": assinatura(rawBody, token),
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
