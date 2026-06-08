import { Bilhete, StatusBilhete } from "../../types/models";

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
}

export interface RifaResumoTransacao {
  numero: string;
  status?: StatusBilhete | string;
}

export interface BilheteComNumero extends Bilhete {
  numero: string;
}

export interface PixTransacao {
  id: string;
  pixOrderId?: string;
  pixChargeId?: string;
  referenceId: string;
  metodo: "PIX";
  statusPagamento: StatusPagamentoPix;
  statusConciliacao: StatusConciliacaoPix;
  valorBruto: number;
  valorPago: number;
  moeda: "BRL";
  descricao?: string;
  dataCriacao: string;
  dataPagamento?: string | null;
  compradorNome?: string;
  compradorEmail?: string | null;
  compradorTelefone?: string | null;
  aderido?: AderidoResumoTransacao;
  rifas?: RifaResumoTransacao[];
  quantidadeRifas?: number;
  vendaId?: string | null;
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

export interface ResultadoSincronizacaoPix {
  sucesso: true;
  sincronizado: false;
  mensagem: string;
}

export interface DadosAtualizacaoCompradorCompra {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export interface ResultadoReenvioEmailComprovante {
  comprador_id: string;
  email: string;
  rifas: string[];
  status: "aprovado";
}
