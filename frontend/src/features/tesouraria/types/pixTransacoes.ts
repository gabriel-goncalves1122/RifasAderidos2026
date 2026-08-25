
export type StatusPagamentoPix =
  | "WAITING"
  | "PAID"
  | "AUTHORIZED"
  | "IN_ANALYSIS"
  | "DECLINED"
  | "CANCELED";

export interface AderidoResumoTransacao {
  id?: string;
  nome: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  modalidade_adesao?: "completo" | "meio";
  cargo?: string;
}

export interface RifaResumoTransacao {
  numero: string;
  status?: string;
}

export interface PixTransacao {
  id: string;

  pixOrderId?: string;
  codigoAutenticacao?: string;
  nsu?: string;

  metodo: "PIX";
  statusPagamento: StatusPagamentoPix;

  valorBruto: number;
  valorPago: number;
  valorEstornado?: number;
  moeda: "BRL";

  descricao?: string;
  dataCriacao: string;
  dataPagamento?: string | null;
  dataExpiracao?: string | null;

  compradorNome?: string;
  compradorEmail?: string;
  compradorDocumento?: string;
  compradorTelefone?: string;

  aderido?: AderidoResumoTransacao;
  rifas?: RifaResumoTransacao[];
  quantidadeRifas?: number;
  compradorId?: string | null;

  qrCodeTexto?: string;
  qrCodeImagemUrl?: string;

  observacao?: string;
}

export interface PixTransacoesResumo {
  totalRecebido: number;
  totalPendente: number;
  totalCancelado: number;

  quantidadePagas: number;
  quantidadeAguardando: number;
  quantidadeCanceladas: number;
  quantidadeComRifas: number;

  ticketMedio: number;
}

export interface PixTransacoesSerieTemporal {
  data: string;
  recebido: number;
  pendente: number;
  quantidadePagas: number;
}

export type FiltroRapidoTransacoesPix =
  | "todas"
  | "com_rifas"
  | "pendentes_banco";

export interface PixTransacoesFiltros {
  status: FiltroRapidoTransacoesPix;
  busca: string;
}
