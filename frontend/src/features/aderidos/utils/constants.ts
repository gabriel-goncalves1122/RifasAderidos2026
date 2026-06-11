// ============================================================================
// CONSTANTES DA FEATURE ADERIDOS
//
// Valores centralizados para evitar duplicacao em multiplos arquivos.
// ============================================================================

// Valor fixo de cada rifa (R$ 10,00)
export const VALOR_RIFA = 10;

// Limites de seguranca para sanitizacao de dados de entrada
export const SANITIZE_LIMITES = {
  nome: 120,
  email: 254,
  telefone: 20,
} as const;
