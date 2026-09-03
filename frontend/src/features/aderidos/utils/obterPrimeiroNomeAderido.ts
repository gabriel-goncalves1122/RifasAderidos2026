// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/utils/obterPrimeiroNomeAderido.ts
// ============================================================================
interface DadosNomeAderido {
  nome?: string | null;
  displayName?: string | null;
  email?: string | null;
}

function extrairPrimeiroNome(valor?: string | null) {
  const texto = valor?.trim();
  if (!texto) return "";

  return texto.split(/\s+/)[0];
}

function capitalizar(texto: string) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

export function obterPrimeiroNomeAderido({
  nome,
  displayName,
  email,
}: DadosNomeAderido) {
  const primeiroNome = extrairPrimeiroNome(nome);

  if (primeiroNome) return capitalizar(primeiroNome);

  const primeiroDisplayName = extrairPrimeiroNome(displayName);

  if (primeiroDisplayName) return capitalizar(primeiroDisplayName);

  const emailNormalizado = email?.trim();

  if (emailNormalizado?.includes("@")) {
    return emailNormalizado.split("@")[0];
  }

  return "Aderido";
}
