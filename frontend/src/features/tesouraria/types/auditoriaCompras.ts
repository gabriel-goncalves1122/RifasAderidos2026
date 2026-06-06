
export type StatusAuditoriaCompras =
  | "todas"
  | "pago"
  | "pendente"
  | "recusado"
  | "disponivel";

export type FiltroComprovante = "todos" | "com" | "sem";

export interface AuditoriaComprasFiltros {
  termoBusca: string;
  status: StatusAuditoriaCompras;
  dataInicio: string;
  dataFim: string;
  comprovante: FiltroComprovante;
}

export interface TransacaoAuditoriaComprasBase {
  numero?: string;
  numero_rifa?: string;
  status?: string;
  vendedor_id?: string;
  vendedor_nome?: string;
  vendedor_cpf?: string;
  comprador_id?: string | null;
  comprador_nome?: string;
  comprador_email?: string | null;
  comprador_telefone?: string | null;
  data_reserva?: string | null;
  data_pagamento?: string | null;
  comprovante_url?: string | null;
  valor?: number;
}

export interface CompraAuditavel {
  id: string;
  data_reserva: string | null;
  data_pagamento: string | null;
  vendedor_id?: string;
  vendedor_nome: string;
  vendedor_cpf: string;
  comprador_id: string | null;
  comprador_nome: string;
  comprador_email: string;
  comprador_telefone: string;
  status: string;
  comprovante_url: string | null;
  bilhetes: string[];
  valor_total: number;
}

export interface ResumoAuditoriaCompras {
  totalCompras: number;
  totalRifas: number;
  valorTotal: number;
  pagas: number;
  pendentes: number;
  recusadas: number;
}
