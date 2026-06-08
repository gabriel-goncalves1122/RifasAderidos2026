// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/utils/rifasStatus.ts
// ============================================================================
import { FiltroRifasAderido } from "../types/painelAderido";

export interface ConfigStatusRifa {
  label: string;
  descricao: string;
  bg: string;
  color: string;
  border: string;
  hoverBg: string;
  selecionavel: boolean;
  abreDetalhes: boolean;
}

export const STATUS_RIFA_CONFIG: Record<
  Exclude<FiltroRifasAderido, "todas">,
  ConfigStatusRifa
> = {
  disponivel: {
    label: "Disponível",
    descricao: "Pode ser selecionada para venda.",
    bg: "#FFFFFF",
    color: "#0B2F24",
    border: "#AFC7BD",
    hoverBg: "#F1F6F3",
    selecionavel: true,
    abreDetalhes: false,
  },

  reservado: {
    label: "Reservada",
    descricao: "Reservada temporariamente.",
    bg: "#F4ECD6",
    color: "#5F4817",
    border: "#C7A95A",
    hoverBg: "#EFE3C2",
    selecionavel: false,
    abreDetalhes: false,
  },

  pendente: {
    label: "Em análise",
    descricao: "Aguardando conferência da tesouraria.",
    bg: "#FFF4D8",
    color: "#6B4A00",
    border: "#CBA64D",
    hoverBg: "#FFE9AD",
    selecionavel: false,
    abreDetalhes: false,
  },

  pago: {
    label: "Paga",
    descricao: "Venda aprovada pela tesouraria.",
    bg: "#DDEDE5",
    color: "#12412D",
    border: "#7FB195",
    hoverBg: "#CFE4D8",
    selecionavel: false,
    abreDetalhes: true,
  },

  recusado: {
    label: "Negada",
    descricao: "Pagamento recusado e precisa de correção.",
    bg: "#F2DADA",
    color: "#5D1D1D",
    border: "#C98A8A",
    hoverBg: "#EBCACA",
    selecionavel: false,
    abreDetalhes: false,
  },
};

export function obterConfigStatusRifa(status?: string): ConfigStatusRifa {
  const statusSeguro = status as Exclude<FiltroRifasAderido, "todas">;

  // Garante fallback seguro para dados antigos ou inconsistentes do NoSQL.
  return STATUS_RIFA_CONFIG[statusSeguro] || STATUS_RIFA_CONFIG.disponivel;
}
