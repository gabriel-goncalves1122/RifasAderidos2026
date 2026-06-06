import {
  EstadoAuditoriaIA,
  TransacaoAgrupada,
} from "./auditoriaTypes";

export function formatarMoedaTesouraria(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataAuditoria(data?: string | null) {
  if (!data) return "Data não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data inválida";
  }

  return dataConvertida.toLocaleString("pt-BR");
}

export function obterEstadoAuditoriaIA(
  transacao: TransacaoAgrupada,
): EstadoAuditoriaIA {
  const mensagem = transacao.ia_mensagem || transacao.log_automacao;

  const aprovada =
    transacao.ia_resultado === "APROVADO" || Boolean(mensagem?.includes("✅"));

  const divergente =
    transacao.ia_resultado === "DIVERGENTE" ||
    transacao.ia_resultado === "ERRO" ||
    Boolean(mensagem?.includes("⚠️")) ||
    Boolean(mensagem?.includes("❌"));

  return {
    mensagem,
    aprovada,
    divergente,
    possuiResultado: Boolean(mensagem || transacao.ia_resultado),
  };
}
