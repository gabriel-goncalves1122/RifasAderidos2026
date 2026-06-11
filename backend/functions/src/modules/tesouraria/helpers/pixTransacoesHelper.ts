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
  if (bilhete.pix_order_id) {
    return `pix-${bilhete.pix_order_id}`;
  }

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

export function statusPagamento(
  status: string,
  statusBanco?: string | null,
): StatusPagamentoPix {
  if (
    statusBanco &&
    ["WAITING", "PAID", "AUTHORIZED", "IN_ANALYSIS", "DECLINED", "CANCELED"]
      .includes(statusBanco)
  ) {
    return statusBanco as StatusPagamentoPix;
  }

  if (status === "pago") return "PAID";
  if (status === "recusado") return "DECLINED";
  if (status === "reservado") return "WAITING";
  if (status === "pendente") return "WAITING";

  return "WAITING";
}

export function statusConciliacao(
  bilhetes: BilheteComNumero[],
): StatusConciliacaoPix {
  const status = bilhetes[0]?.status;
  const statusBanco = bilhetes[0]?.status_pagamento_banco;

  if (statusBanco === "CANCELED") return "cancelada";

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
  const valorBruto = bilhetesOrdenados.reduce(
    (acc, bilhete) => acc + (bilhete.valor_bruto || VALOR_RIFA),
    0,
  );
  const pagamento = statusPagamento(base.status, base.status_pagamento_banco);
  const dataCriacao = primeiraDataValida(base.data_reserva, base.data_pagamento);
  const dataPagamento =
    ["PAID", "AUTHORIZED"].includes(pagamento)
      ? primeiraDataValida(base.data_pagamento, base.data_reserva)
      : null;
  const idNormalizado = normalizarId(chaveCompra(base) || numerosRifas.join("-"));
  const referenceId = `rifas-${numerosRifas.join("-")}`;
  const statusValidacao =
    base.status_validacao === "aceita" || base.status_validacao === "negada"
      ? base.status_validacao
      : undefined;

  return {
    id: idNormalizado || referenceId,
    pixOrderId: base.pix_order_id || undefined,
    pixChargeId: base.pix_charge_id || undefined,
    pixQrCodeId: base.pix_qr_code_id || undefined,
    referenceId,
    metodo: "PIX",
    statusPagamento: pagamento,
    statusConciliacao: statusConciliacao(bilhetesOrdenados),
    statusValidacao,
    valorBruto,
    valorPago:
      ["PAID", "AUTHORIZED"].includes(pagamento)
        ? bilhetesOrdenados.reduce(
            (acc, bilhete) => acc + (bilhete.valor_pago || bilhete.valor_bruto || VALOR_RIFA),
            0,
          )
        : 0,
    moeda: "BRL",
    descricao: `Rifas ${numerosRifas.join(", ")}`,
    dataCriacao,
    dataPagamento,
    dataExpiracao: base.data_expiracao || null,
    compradorNome: base.comprador_nome || "Pagador Não Identificado",
    compradorEmail: base.comprador_email || null,
    compradorDocumento: undefined,
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
    validadoEm: base.validado_em || null,
    validadoPor: base.validado_por || null,
    motivoNegacao: base.motivo_recusa || null,
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
  const aguardandoValidacao = transacoes.filter(
    (transacao) =>
      ["PAID", "AUTHORIZED"].includes(transacao.statusPagamento) &&
      !transacao.statusValidacao,
  );
  const aceitas = transacoes.filter(
    (transacao) => transacao.statusValidacao === "aceita",
  );
  const negadas = transacoes.filter(
    (transacao) => transacao.statusValidacao === "negada",
  );
  const semConfirmacaoBancaria = transacoes.filter(
    (transacao) => !["PAID", "AUTHORIZED"].includes(transacao.statusPagamento),
  );
  const comRifas = transacoes.filter((transacao) =>
    Boolean(transacao.rifas?.length),
  );
  const semVinculo = transacoes.filter(
    (transacao) => !transacao.vendaId || !transacao.aderido?.id,
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
    quantidadeAguardandoValidacao: aguardandoValidacao.length,
    quantidadeAceitas: aceitas.length,
    quantidadeNegadas: negadas.length,
    quantidadeSemConfirmacaoBancaria: semConfirmacaoBancaria.length,
    quantidadeComRifas: comRifas.length,
    quantidadeSemVinculo: semVinculo.length,
    ticketMedio: pagas.length > 0 ? totalRecebido / pagas.length : 0,
  };
}
