
export type DecisaoAuditoria = "aprovar" | "rejeitar";

export type ResultadoAuditoriaIA = "APROVADO" | "DIVERGENTE" | "ERRO" | string;

export interface TransacaoAgrupada {
  comprovanteUrl: string | null;
  vendedorCpf: string;
  vendedorNome: string;
  compradorNome: string;
  compradorTelefone?: string;
  dataReserva: string | null;
  log_automacao?: string;
  ia_resultado?: ResultadoAuditoriaIA;
  ia_mensagem?: string;
  bilhetes: string[];
  valorTotal: number;
}

export interface EstadoAuditoriaIA {
  mensagem?: string;
  aprovada: boolean;
  divergente: boolean;
  possuiResultado: boolean;
}
