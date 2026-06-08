// ============================================================================
// ARQUIVO: backend/functions/src/modules/tesouraria/helpers/pixTransacoesHelper.ts
// ============================================================================
import {
  BilheteComNumero,
  PixTransacao,
  PixTransacoesResumo,
  StatusConciliacaoPix,
  StatusPagamentoPix,
} from "../types/tesourariaTypes";

const VALOR_RIFA = 10;

export function valorDataSeguro(data?: string | null) {
  const timestamp = new Date(data || "").getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function primeiraDataValida(...datas: Array<string | null | undefined>) {
  const dataValida = datas.find((data) => valorDataSeguro(data) > 0);

  return dataValida || new Date(0).toISOString();
}

export function normalizarId(valor: string) {
  return valor
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function chaveCompra(bilhete: BilheteComNumero) {
  if (bilhete.comprovante_url) {
    return `comprovante-${bilhete.comprovante_url}`;
  }

  if (bilhete.comprador_id) {
    return `comprador-${bilhete.comprador_id}`;
  }

  const comprador = bilhete.comprador_nome || "sem-comprador";
  const reserva = bilhete.data_reserva || "sem-data";

  return `manual-${comprador}-${reserva}-${bilhete.status}`;
}

export function statusPagamento(status: string): StatusPagamentoPix {
  if (status === "pago") return "PAID";
  if (status === "recusado") return "DECLINED";
  if (status === "pendente") return "WAITING";

  return "WAITING";
}

export function statusConciliacao(
  bilhetes: BilheteComNumero[],
): StatusConciliacaoPix {
  const status = bilhetes[0]?.status;

  if (status === "pago") {
    return bilhetes.some((bilhete) => !bilhete.vendedor_id)
      ? "nao_identificada"
      : "conciliada";
  }

  if (status === "recusado") return "divergente";

  return "pendente";
}

export function montarPixTransacao(
  bilhetes: BilheteComNumero[],
): PixTransacao {
  const bilhetesOrdenados = [...bilhetes].sort((a, b) =>
    a.numero.localeCompare(b.numero, "pt-BR", { numeric: true }),
  );
  const base = bilhetesOrdenados[0];
  const numerosRifas = bilhetesOrdenados.map((bilhete) => bilhete.numero);
  const quantidadeRifas = bilhetesOrdenados.length;
  const valorBruto = quantidadeRifas * VALOR_RIFA;
  const pagamento = statusPagamento(base.status);
  const dataCriacao = primeiraDataValida(base.data_reserva, base.data_pagamento);
  const dataPagamento =
    pagamento === "PAID"
      ? primeiraDataValida(base.data_pagamento, base.data_reserva)
      : null;
  const idNormalizado = normalizarId(chaveCompra(base) || numerosRifas.join("-"));
  const referenceId = `rifas-${numerosRifas.join("-")}`;

  return {
    id: idNormalizado || referenceId,
    referenceId,
    metodo: "PIX",
    statusPagamento: pagamento,
    statusConciliacao: statusConciliacao(bilhetesOrdenados),
    valorBruto,
    valorPago: pagamento === "PAID" ? valorBruto : 0,
    moeda: "BRL",
    descricao: `Rifas ${numerosRifas.join(", ")}`,
    dataCriacao,
    dataPagamento,
    compradorNome: base.comprador_nome || "Pagador Não Identificado",
    compradorEmail: base.comprador_email || null,
    compradorTelefone: base.comprador_telefone || null,
    aderido: {
      id: base.vendedor_id,
      nome: base.vendedor_nome || "Sem aderido vinculado",
      cpf: base.vendedor_cpf || undefined,
    },
    rifas: bilhetesOrdenados.map((bilhete) => ({
      numero: bilhete.numero,
      status: bilhete.status,
    })),
    quantidadeRifas,
    vendaId: base.comprador_id || null,
    observacao:
      pagamento === "DECLINED"
        ? base.motivo_recusa || "Comprovante recusado pela tesouraria."
        : undefined,
  };
}

export function calcularResumoPixTransacoes(
  transacoes: PixTransacao[],
): PixTransacoesResumo {
  const pagas = transacoes.filter(
    (transacao) => transacao.statusPagamento === "PAID",
  );
  const aguardando = transacoes.filter(
    (transacao) => transacao.statusPagamento === "WAITING",
  );
  const canceladas = transacoes.filter((transacao) =>
    ["CANCELED", "DECLINED"].includes(transacao.statusPagamento),
  );
  const naoIdentificadas = transacoes.filter(
    (transacao) => transacao.statusConciliacao === "nao_identificada",
  );
  const divergentes = transacoes.filter(
    (transacao) => transacao.statusConciliacao === "divergente",
  );
  const totalRecebido = pagas.reduce(
    (acc, transacao) => acc + transacao.valorPago,
    0,
  );
  const totalPendente = aguardando.reduce(
    (acc, transacao) => acc + transacao.valorBruto,
    0,
  );
  const totalCancelado = canceladas.reduce(
    (acc, transacao) => acc + transacao.valorBruto,
    0,
  );
  const totalDivergente = [...naoIdentificadas, ...divergentes].reduce(
    (acc, transacao) => acc + (transacao.valorPago || transacao.valorBruto),
    0,
  );

  return {
    totalRecebido,
    totalPendente,
    totalCancelado,
    totalDivergente,
    quantidadePagas: pagas.length,
    quantidadeAguardando: aguardando.length,
    quantidadeCanceladas: canceladas.length,
    quantidadeNaoIdentificadas: naoIdentificadas.length,
    ticketMedio: pagas.length > 0 ? totalRecebido / pagas.length : 0,
  };
}
