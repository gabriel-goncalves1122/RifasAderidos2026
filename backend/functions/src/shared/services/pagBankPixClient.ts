// ============================================================================
// ARQUIVO: backend/functions/src/shared/services/pagBankPixClient.ts
// ============================================================================
import axios from "axios";

interface CriarPedidoPixParams {
  referenceId: string;
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
  numerosRifas: string[];
  valorCentavos: number;
  expirationDate: string;
}

function somenteNumeros(valor?: string | null) {
  return String(valor || "").replace(/\D/g, "");
}

function obterBaseUrl() {
  return (
    process.env.PAGBANK_API_BASE_URL || "https://sandbox.api.pagseguro.com"
  ).replace(/\/+$/, "");
}

function obterTokenApi() {
  const token = process.env.PAGBANK_API_TOKEN;

  if (!token) {
    throw new Error("PAGBANK_NOT_CONFIGURED");
  }

  return token;
}

function obterNotificationUrls() {
  const baseUrl = process.env.API_PUBLIC_BASE_URL?.replace(/\/+$/, "");

  return baseUrl ? [`${baseUrl}/rifas/checkout/pix/webhook`] : undefined;
}

function montarTelefonePagador(telefone: string) {
  const numeros = somenteNumeros(telefone);

  if (numeros.length < 10) return undefined;

  return [
    {
      country: "55",
      area: numeros.slice(0, 2),
      number: numeros.slice(2),
      type: "MOBILE",
    },
  ];
}

export class PagBankPixClient {
  static async criarPedidoPix(params: CriarPedidoPixParams) {
    const payload: Record<string, any> = {
      reference_id: params.referenceId,
      customer: {
        name: params.nome,
        email: params.email || undefined,
        tax_id: params.documento || undefined,
        phones: montarTelefonePagador(params.telefone),
      },
      items: [
        {
          reference_id: params.referenceId,
          name: `Rifas ${params.numerosRifas.join(", ")}`,
          quantity: 1,
          unit_amount: params.valorCentavos,
        },
      ],
      qr_codes: [
        {
          amount: {
            value: params.valorCentavos,
          },
          expiration_date: params.expirationDate,
        },
      ],
      notification_urls: obterNotificationUrls(),
    };

    const resposta = await axios.post(`${obterBaseUrl()}/orders`, payload, {
      headers: {
        Authorization: `Bearer ${obterTokenApi()}`,
        "Content-Type": "application/json",
      },
    });

    return resposta.data;
  }

  static async consultarPedido(orderId: string) {
    const resposta = await axios.get(`${obterBaseUrl()}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${obterTokenApi()}`,
        "Content-Type": "application/json",
      },
    });

    return resposta.data;
  }
}

