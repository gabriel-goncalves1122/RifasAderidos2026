
export type DecisaoAuditoria = "aprovar" | "rejeitar";

export type ResultadoAuditoriaIA = "APROVADO" | "DIVERGENTE" | "ERRO" | string;

export interface TransacaoAgrupada {
  comprovante_url: string | null;
  vendedor_cpf: string;
  vendedor_nome: string;
  comprador_nome: string;
  comprador_telefone?: string;
  data_reserva: string | null;
  log_automacao?: string;
  ia_resultado?: ResultadoAuditoriaIA;
  ia_mensagem?: string;
  bilhetes: string[];
  valor_total: number;
}

export interface EstadoAuditoriaIA {
  mensagem?: string;
  aprovada: boolean;
  divergente: boolean;
  possuiResultado: boolean;
}
