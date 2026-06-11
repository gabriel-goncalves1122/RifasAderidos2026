// ============================================================================
// UTILS DE CHECKOUT
//
// Utilitarios de formatacao e calculo usados pelos componentes de checkout.
// ============================================================================
import { VALOR_RIFA } from "../../../utils/constants";
import { formatarTelefone } from "../../../utils/mascaras";

export { formatarTelefone as aplicarMascaraTelefone } from "../../../utils/mascaras";

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
