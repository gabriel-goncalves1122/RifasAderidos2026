import { Bilhete, StatusBilhete } from "../../types/models";

export type StatusPagamentoPix =
  | "WAITING"
  | "PAID"
  | "AUTHORIZED"
  | "IN_ANALYSIS"
  | "DECLINED"
  | "CANCELED"
  | "ERROR";

export type StatusValidacaoPix = "aceita" | "negada";

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
  status?: StatusBilhete | string;
}

export interface BilheteComNumero extends Bilhete {
  numero: string;
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

  statusValidacao?: StatusValidacaoPix;
  observacao?: string;
}

export interface PixTransacoesResumo {
  totalRecebido: number;
  totalPendente: number;
  totalCancelado: number;
  totalErros: number;

  quantidadePagas: number;
  quantidadeAguardando: number;
  quantidadeCanceladas: number;
  quantidadeErros: number;
  totalTransacoes: number;

  ticketMedio: number;
}

export interface ResultadoSincronizacaoPix {
  sucesso: true;
  sincronizado: boolean;
  atualizados?: number;
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
