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

export function aplicarMascaraCpfCnpj(valor: string) {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 14);

  if (apenasNumeros.length <= 11) {
    if (apenasNumeros.length <= 3) return apenasNumeros;
    if (apenasNumeros.length <= 6) {
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
    }
    if (apenasNumeros.length <= 9) {
      return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(
        3,
        6,
      )}.${apenasNumeros.slice(6)}`;
    }
    return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(
      3,
      6,
    )}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9, 11)}`;
  } else {
    // CNPJ: 99.999.999/9999-99
    if (apenasNumeros.length <= 12) {
      return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(
        2,
        5,
      )}.${apenasNumeros.slice(5, 8)}/${apenasNumeros.slice(8)}`;
    }
    return `${apenasNumeros.slice(0, 2)}.${apenasNumeros.slice(
      2,
      5,
    )}.${apenasNumeros.slice(5, 8)}/${apenasNumeros.slice(
      8,
      12,
    )}-${apenasNumeros.slice(12, 14)}`;
  }
}

export function formatarExpiracaoPix(data?: string | null) {
  if (!data) return "Expiração não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Expiração inválida";
  }

  return dataConvertida.toLocaleString("pt-BR");
}
