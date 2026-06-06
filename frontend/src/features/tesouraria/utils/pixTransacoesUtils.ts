
import {
  PixTransacoesFiltros,
  PixTransacoesResumo,
  PixTransacoesSerieTemporal,
  StatusConciliacaoPix,
  StatusPagamentoPix,
  PixTransacao,
} from "../types/pixTransacoes";

export const RESUMO_PIX_TRANSACOES_VAZIO: PixTransacoesResumo = {
  totalRecebido: 0,
  totalPendente: 0,
  totalCancelado: 0,
  totalDivergente: 0,
  quantidadePagas: 0,
  quantidadeAguardando: 0,
  quantidadeCanceladas: 0,
  quantidadeNaoIdentificadas: 0,
  ticketMedio: 0,
};

function somenteNumeros(valor?: string | null) {
  return String(valor || "").replace(/\D/g, "");
}

function campoContemTermo(
  valor: string | undefined | null,
  termo: string,
  termoNumerico: string,
) {
  const texto = String(valor || "").toLowerCase();

  return (
    texto.includes(termo) ||
    (termoNumerico.length > 0 && somenteNumeros(texto).includes(termoNumerico))
  );
}

function atendeFiltroRapido(
  transacao: PixTransacao,
  status: PixTransacoesFiltros["status"],
) {
  if (status === "todas") return true;
  if (status === "pagas") return transacao.statusPagamento === "PAID";
  if (status === "nao_vinculadas") {
    return transacao.statusConciliacao === "nao_identificada";
  }
  if (status === "canceladas") {
    return ["CANCELED", "DECLINED"].includes(transacao.statusPagamento);
  }

  return true;
}

export function formatarMoedaPix(valor?: number | null) {
  const valorSeguro = Number.isFinite(valor) ? Number(valor) : 0;

  return valorSeguro.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataPix(data?: string | null) {
  if (!data) return "Data não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data inválida";
  }

  return dataConvertida.toLocaleString("pt-BR");
}

export function obterLabelStatusPagamento(status: StatusPagamentoPix) {
  const labels: Record<StatusPagamentoPix, string> = {
    WAITING: "Aguardando",
    PAID: "Pago",
    AUTHORIZED: "Autorizado",
    IN_ANALYSIS: "Em análise",
    DECLINED: "Negado",
    CANCELED: "Cancelado",
  };

  return labels[status] || status;
}

export function obterLabelStatusConciliacao(
  status: StatusConciliacaoPix,
) {
  const labels: Record<StatusConciliacaoPix, string> = {
    pendente: "Pendente",
    conciliada: "Conciliada",
    nao_identificada: "Não identificada",
    divergente: "Divergente",
    cancelada: "Cancelada",
  };

  return labels[status] || status;
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

  const canceladas = transacoes.filter(
    (transacao) => transacao.statusPagamento === "CANCELED",
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

export function filtrarPixTransacoes(
  transacoes: PixTransacao[],
  filtros: PixTransacoesFiltros,
) {
  const termo = filtros.busca.trim().toLowerCase();
  const termoNumerico = somenteNumeros(termo);

  return transacoes.filter((transacao) => {
    const camposBusca = [
      transacao.descricao,
      transacao.compradorNome,
      transacao.compradorEmail,
      transacao.compradorDocumento,
      transacao.compradorTelefone,
      transacao.aderido?.nome,
      transacao.aderido?.cpf,
      transacao.referenceId,
      transacao.pixOrderId,
      transacao.pixChargeId,
      ...(transacao.rifas || []).map((rifa) => rifa.numero),
    ];

    const buscaValida =
      !termo ||
      camposBusca.some((campo) => campoContemTermo(campo, termo, termoNumerico));

    return buscaValida && atendeFiltroRapido(transacao, filtros.status);
  });
}

export function montarPixTransacoesSerieTemporal(
  transacoes: PixTransacao[],
): PixTransacoesSerieTemporal[] {
  const agrupado = transacoes.reduce<Record<string, PixTransacoesSerieTemporal>>(
    (acc, transacao) => {
      const dataBase = transacao.dataPagamento || transacao.dataCriacao;

      const data = new Date(dataBase).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!acc[data]) {
        acc[data] = {
          data,
          recebido: 0,
          pendente: 0,
          quantidadePagas: 0,
        };
      }

      if (transacao.statusPagamento === "PAID") {
        acc[data].recebido += transacao.valorPago;
        acc[data].quantidadePagas += 1;
      }

      if (transacao.statusPagamento === "WAITING") {
        acc[data].pendente += transacao.valorBruto;
      }

      return acc;
    },
    {},
  );

  return Object.values(agrupado);
}
