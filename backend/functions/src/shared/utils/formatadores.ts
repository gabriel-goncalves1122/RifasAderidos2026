export function somenteNumeros(valor?: string | null): string {
  return String(valor || "").replace(/\D/g, "");
}
