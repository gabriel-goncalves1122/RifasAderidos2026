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

export function obterPrimeiroNomeAderido({
  nome,
  displayName,
  email,
}: DadosNomeAderido) {
  const primeiroNome = extrairPrimeiroNome(nome);

  if (primeiroNome) return primeiroNome;

  const primeiroDisplayName = extrairPrimeiroNome(displayName);

  if (primeiroDisplayName) return primeiroDisplayName;

  const emailNormalizado = email?.trim();

  if (emailNormalizado?.includes("@")) {
    return emailNormalizado.split("@")[0];
  }

  return "Aderido";
}
