// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/utils/checkoutUtils.ts
// ============================================================================

export const CHAVE_PIX_COMISSAO = "comissao0026@gmail.com";

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
