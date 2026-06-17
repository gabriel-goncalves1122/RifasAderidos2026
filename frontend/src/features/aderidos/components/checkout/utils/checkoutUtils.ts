// ============================================================================
// UTILS DE CHECKOUT
//
// Utilitarios de formatacao e calculo usados pelos componentes de checkout.
// ============================================================================
import { VALOR_RIFA } from "../../../utils/constants";
import { formatarTelefone } from "@/shared/utils/formatadores";

export { formatarTelefone as aplicarMascaraTelefone } from "@/shared/utils/formatadores";

export function calcularValorTotalRifas(numerosRifas: string[]) {
  return numerosRifas.length * VALOR_RIFA;
}

export function formatarExpiracaoPix(data?: string | null) {
  if (!data) return "Expiração não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Expiração inválida";
  }

  return dataConvertida.toLocaleString("pt-BR");
}
