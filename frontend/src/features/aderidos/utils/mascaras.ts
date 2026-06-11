// ============================================================================
// MASCARAS DE ENTRADA
//
// Funcoes para formatar campos enquanto o usuario digita.
// Aplicam mascaras visuais sem perder os dados originais.
// ============================================================================

export function formatarTelefone(valor: string) {
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

  if (apenasNumeros.length <= 2) {
    return apenasNumeros;
  }

  if (apenasNumeros.length <= 7) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }

  if (apenasNumeros.length <= 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
      2,
      6,
    )}-${apenasNumeros.slice(6)}`;
  }

  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
    2,
    7,
  )}-${apenasNumeros.slice(7)}`;
}
