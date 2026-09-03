
export type StatusAuditoriaCompras =
  | "todas"
  | "pago"
  | "pendente"
  | "recusado"
  | "disponivel";

export type FiltroComprovante = "todos" | "com" | "sem";

export interface AuditoriaComprasFiltros {
  busca: string;
  status: StatusAuditoriaCompras;
  dataInicio: string;
  dataFim: string;
}

export interface TransacaoTesouraria {
  id: string;
  dataReserva: string | null;
  dataPagamento: string | null;
  vendedorId?: string;
  vendedorNome: string;
  vendedorCpf: string;
  compradorId: string | null;
  compradorNome: string;
  compradorEmail: string;
  compradorTelefone: string;
  status: string;
  comprovanteUrl: string | null;
  bilhetes: string[];
  valorTotal: number;
}

export interface ResumoAuditoriaCompras {
  totalCompras: number;
  totalRifas: number;
  valorTotal: number;
  pagas: number;
  pendentes: number;
  recusadas: number;
}
