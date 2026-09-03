// ============================================================================
// ARQUIVO: frontend/src/features/auth/utils/formatadoresAuth.ts
// ============================================================================

export function somenteNumeros(valor?: string | null): string {
  return String(valor || "").replace(/\D/g, "");
}

export function formatarCpf(valor?: string | null): string {
  const cpf = somenteNumeros(valor).slice(0, 11);

  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) {
    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  }

  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(
    9,
  )}`;
}
