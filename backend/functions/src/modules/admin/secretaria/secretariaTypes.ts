// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaTypes.ts
// ============================================================================
import { CargoComissao } from "../../types/models";

export type ModalidadeAdesao = "completo" | "meio";

export type StatusCadastroSecretaria = "pendente" | "ativo" | "inativo";

export interface DadosNovoAderido {
  email: string;
  nome?: string;
  curso?: string;
  dataNascimento?: string;
  telefone?: string;
  cargo?: CargoComissao;
  modalidade_adesao?: ModalidadeAdesao;
}

export interface DadosAtualizacaoAderido {
  nome?: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  curso?: string;
  genero?: string;
  data_nascimento?: string;
  cargo?: CargoComissao;
  status_cadastro?: StatusCadastroSecretaria;
}
