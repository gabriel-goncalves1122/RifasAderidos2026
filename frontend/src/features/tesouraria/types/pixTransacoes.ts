
export type StatusPagamentoPix =
  | "WAITING"
  | "PAID"
  | "AUTHORIZED"
  | "IN_ANALYSIS"
  | "DECLINED"
  | "CANCELED";

export type StatusConciliacaoPix =
  | "pendente"
  | "conciliada"
  | "nao_identificada"
  | "divergente"
  | "cancelada";

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
  pixChargeId?: string;
  referenceId: string;
  codigoAutenticacao?: string;
  nsu?: string;

  metodo: "PIX";
  statusPagamento: StatusPagamentoPix;
  statusConciliacao: StatusConciliacaoPix;

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
  vendaId?: string | null;

  qrCodeTexto?: string;
  qrCodeImagemUrl?: string;

  observacao?: string;
}

export interface PixTransacoesResumo {
  totalRecebido: number;
  totalPendente: number;
  totalCancelado: number;
  totalDivergente: number;

  quantidadePagas: number;
  quantidadeAguardando: number;
  quantidadeCanceladas: number;
  quantidadeNaoIdentificadas: number;

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
  | "pagas"
  | "nao_vinculadas"
  | "canceladas";

export interface PixTransacoesFiltros {
  status: FiltroRapidoTransacoesPix;
  busca: string;
}
