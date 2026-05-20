// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/utils/formatadoresSecretaria.ts
// ============================================================================

export function somenteNumeros(valor?: string | number | null): string {
  return String(valor || "").replace(/\D/g, "");
}

export function formatarTelefone(valor?: string | number | null): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 6)
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) {
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

export function formatarCpf(valor?: string | number | null): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  }

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
}
