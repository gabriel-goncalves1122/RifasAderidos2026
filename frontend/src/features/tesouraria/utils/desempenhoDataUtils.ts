
import {
  AderidoMetricaDesempenho,
  DesempenhoDados,
  ReceitaPorDiaDesempenho,
  ResumoGeralDesempenho,
  TransacaoDesempenho,
} from "../types/desempenho";

export const RESUMO_GERAL_DESEMPENHO_VAZIO: ResumoGeralDesempenho = {
  totalArrecadado: 0,
  rifasPagas: 0,
  aderidosAtivos: 0,
};

function statusNormalizado(status?: string) {
  return String(status || "").trim().toLowerCase();
}

function montarReceitaPorDia(transacoes: TransacaoDesempenho[]) {
  const agrupado = transacoes.reduce<Record<string, ReceitaPorDiaDesempenho>>(
    (acc, transacao) => {
      if (statusNormalizado(transacao.status) !== "pago") return acc;

      const dataConvertida = new Date(transacao.dataReserva);

      if (Number.isNaN(dataConvertida.getTime())) return acc;

      const chave = dataConvertida.toISOString().slice(0, 10);
      const data = dataConvertida.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!acc[chave]) {
        acc[chave] = {
          data,
          dataOrdenacao: dataConvertida.getTime(),
          valor: 0,
        };
      }

      acc[chave].valor += transacao.valor;

      return acc;
    },
    {},
  );

  return Object.values(agrupado).sort(
    (a, b) => a.dataOrdenacao - b.dataOrdenacao,
  );
}

function montarStatus(transacoes: TransacaoDesempenho[]) {
  const pagas = transacoes.filter(
    (transacao) => statusNormalizado(transacao.status) === "pago",
  ).length;
  const pendentes = transacoes.filter(
    (transacao) => statusNormalizado(transacao.status) === "pendente",
  ).length;

  return {
    pagas,
    pendentes,
    total: pagas + pendentes,
    barras: [
      { label: "Pagas", valor: pagas, cor: "#0B7A61" },
      { label: "Pendentes", valor: pendentes, cor: "#C48A16" },
    ],
  };
}

function montarMetas(aderidos: AderidoMetricaDesempenho[]) {
  const bateramMeta = aderidos.filter(
    (aderido) => aderido.arrecadado >= aderido.meta,
  ).length;
  const abaixoMeta = Math.max(aderidos.length - bateramMeta, 0);

  return {
    bateramMeta,
    abaixoMeta,
    total: aderidos.length,
    barras: [
      { label: "Na meta", valor: bateramMeta, cor: "#0B7A61" },
      { label: "Abaixo", valor: abaixoMeta, cor: "#526760" },
    ],
  };
}

export function montarDadosDesempenho({
  resumoGeral,
  aderidos,
  historicoTransacoes,
}: {
  resumoGeral: ResumoGeralDesempenho;
  aderidos: AderidoMetricaDesempenho[];
  historicoTransacoes: TransacaoDesempenho[];
}): DesempenhoDados {
  return {
    resumoGeral,
    receitaPorDia: montarReceitaPorDia(historicoTransacoes),
    status: montarStatus(historicoTransacoes),
    metas: montarMetas(aderidos),
  };
}
