// ============================================================================
// ARQUIVO: frontend/src/features/rifas/types/rifas.ts
// ============================================================================

export interface DadosCompradorRifa {
  nome: string;
  telefone: string;
  email: string;
}

export interface DadosFinalizarVenda extends DadosCompradorRifa {
  numerosRifas: string[];
  comprovante: File;
}

export interface DadosCorrigirRifas extends DadosCompradorRifa {
  numerosRifas: string[];
  comprovante: File;
}

export interface DadosCorrigirDadosRifas extends DadosCompradorRifa {
  numerosRifas: string[];
}

export interface ResultadoMinhasRifas {
  bilhetes?: unknown[];
}

export interface UploadComprovanteParams {
  arquivo: File;
  pasta: string;
  nomeBase: string;
  metadados?: Record<string, string>;
}

export interface EnviarVendaParams extends DadosCompradorRifa {
  numerosRifas: string[];
  comprovanteUrl: string;
}

export interface EnviarCorrecaoParams extends DadosCompradorRifa {
  numerosRifas: string[];
  comprovanteUrl: string;
}
