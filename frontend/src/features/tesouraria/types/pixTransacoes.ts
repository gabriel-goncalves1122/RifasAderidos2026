
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

export type StatusValidacaoPix =
  | "sem_confirmacao_bancaria"
  | "pendente_validacao"
  | "aceita"
  | "negada";

export type AcaoValidacaoPix = "aceitar" | "negar";

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
  statusValidacao?: StatusValidacaoPix;

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
  validadoEm?: string | null;
  validadoPor?: string | null;
  motivoNegacao?: string | null;
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
  quantidadeAguardandoValidacao: number;
  quantidadeAceitas: number;
  quantidadeNegadas: number;
  quantidadeSemConfirmacaoBancaria: number;
  quantidadeComRifas: number;
  quantidadeSemVinculo: number;

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
  | "para_validar"
  | "com_rifas"
  | "sem_vinculo"
  | "pendentes_banco";

export interface PixTransacoesFiltros {
  status: FiltroRapidoTransacoesPix;
  busca: string;
}
