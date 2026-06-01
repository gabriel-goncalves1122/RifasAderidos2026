// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/types/rifasTypes.ts
// ============================================================================

export interface DadosVenda {
  nome: string;
  telefone: string;
  email?: string;
  numerosRifas: string[];
  comprovanteUrl: string;
}

export interface DadosCorrecaoRifas {
  nome: string;
  telefone: string;
  email: string;
  comprovanteUrl: string;
}

export interface AderidoRifasContexto {
  idAderido: string;
  vendedorNome: string;
  vendedorCpf: string;
}
