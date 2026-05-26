// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/utils/formatadoresAderido.ts
// ============================================================================

export function formatarMoedaBR(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

export function formatarDataHoraBR(data?: string | null) {
  if (!data) return "Data não registrada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    return "Data inválida";
  }

  return dataConvertida.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
