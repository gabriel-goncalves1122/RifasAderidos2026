import { TipoNotificacaoRifa } from "../types/notificacoes";

export function normalizarTipoNotificacaoRifa(
  tipo?: string | null,
): TipoNotificacaoRifa {
  if (tipo === "rifa_liberada") return "rifa_liberada";
  if (tipo === "informativo") return "informativo";

  return "correcao_dados";
}

export function formatarDataNotificacao(data?: string | null) {
  if (!data) return "";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "";

  return dataConvertida.toLocaleDateString("pt-BR");
}
