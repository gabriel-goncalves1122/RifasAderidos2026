// ============================================================================
// ARQUIVO: backend/functions/src/modules/types/models.ts
// ============================================================================

// ----------------------------------------------------------------------------
// CARGOS E PERFIS DO SISTEMA
// ----------------------------------------------------------------------------

export type CargoComissao =
  | "admin"
  | "presidencia"
  | "rh"
  | "tesouraria"
  | "marketing"
  | "eventos"
  | "secretaria"
  | "vice_secretaria"
  | "membro"
  | "aderido";

export type StatusCadastro = "ativo" | "pendente" | "inativo";

export type ModalidadeAdesao = "completo" | "meio";

// ----------------------------------------------------------------------------
// USUÁRIO / ADERIDO / MEMBRO DA COMISSÃO
// Coleção: usuarios
// ----------------------------------------------------------------------------

export interface FaixaRifas {
  inicio?: string;
  fim?: string;
}

export interface Usuario {
  // Identificação principal
  id?: string;
  id_aderido?: string;
  uid?: string | null;

  // Dados pessoais
  nome?: string;
  email: string | null;
  telefone?: string;
  cpf?: string;
  curso?: string;
  genero?: string;
  data_nascimento?: string;
  dataNascimento?: string;

  // Permissões e classificação
  cargo?: CargoComissao | string | null;
  role?: CargoComissao | string | null;
  modalidade_adesao?: ModalidadeAdesao;

  // Status operacional
  status?: StatusCadastro | string;
  status_cadastro?: StatusCadastro;

  // Dados comerciais
  posicao_adesao?: number;
  faixa_rifas?: FaixaRifas;
  meta_vendas?: number;
  total_arrecadado?: number;
  rifas_vendidas?: number;

  // Datas
  criado_em?: string;
  cadastrado_em?: string;
}

// ----------------------------------------------------------------------------
// COMPRADOR
// Coleção: compradores
// ----------------------------------------------------------------------------

export interface Comprador {
  id: string;
  nome: string;
  email?: string | null;
  telefone: string;
  criado_em: string;
}

// ----------------------------------------------------------------------------
// BILHETE / RIFA
// Coleção: bilhetes
// ----------------------------------------------------------------------------

export type StatusBilhete =
  | "disponivel"
  | "reservado"
  | "pendente"
  | "pago"
  | "recusado";

export interface Bilhete {
  numero: string;
  status: StatusBilhete;

  // Dados do vendedor/aderido
  vendedor_id?: string;
  vendedor_nome?: string;
  vendedor_cpf?: string;

  // Dados do comprador
  comprador_id?: string | null;
  comprador_nome?: string;
  comprador_email?: string | null;
  comprador_telefone?: string | null;

  // Datas do fluxo da venda
  data_reserva?: string | null;
  data_pagamento?: string | null;

  // Comprovante e auditoria
  comprovante_url?: string | null;
  log_automacao?: string | null;
  motivo_recusa?: string | null;
}

// ----------------------------------------------------------------------------
// PRÊMIO
// Coleção: premios
// ----------------------------------------------------------------------------

export interface Premio {
  id: string;
  colocacao: number;
  nome: string;
  descricao?: string;
  imagem_url?: string;
  ganhador_numero?: string;
  ganhador_nome?: string;
  ativo: boolean;
}

// ----------------------------------------------------------------------------
// CONFIGURAÇÕES DO SORTEIO
// Coleção: configuracoes/sorteio
// ----------------------------------------------------------------------------

export interface InfoSorteio {
  titulo: string;
  data: string;
  descricao: string;
}

// ----------------------------------------------------------------------------
// NOTIFICAÇÕES
// Coleção: notificacoes
// ----------------------------------------------------------------------------

export interface Notificacao {
  id: string;
  vendedor_id: string;
  titulo: string;
  mensagem: string;
  rifas: string[];
  lida: boolean;
  data_criacao: string;
}
