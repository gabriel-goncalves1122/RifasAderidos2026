// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/utils/checkoutUtils.ts
// ============================================================================

export function aplicarMascaraTelefone(valor: string) {
  const somenteNumeros = valor.replace(/\D/g, "").slice(0, 11);

  if (somenteNumeros.length <= 2) {
    return somenteNumeros;
  }

  if (somenteNumeros.length <= 7) {
    return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(2)}`;
  }

  if (somenteNumeros.length <= 10) {
    return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
      2,
      6,
    )}-${somenteNumeros.slice(6)}`;
  }

  return `(${somenteNumeros.slice(0, 2)}) ${somenteNumeros.slice(
    2,
    7,
  )}-${somenteNumeros.slice(7)}`;
}

export function calcularValorTotalRifas(numerosRifas: string[]) {
  return numerosRifas.length * 10;
}

export function formatarExpiracaoPix(data?: string | null) {
  if (!data) return "Expiração não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Expiração inválida";
  }

  return dataConvertida.toLocaleString("pt-BR");
}
