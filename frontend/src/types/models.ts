// ============================================================================
// ARQUIVO: models.ts (A Definição de Dados do Sistema)
// ============================================================================

// ----------------------------------------------------------------------------
// DEFINIÇÕES DE CARGOS (RBAC - Role Based Access Control)
// ----------------------------------------------------------------------------
export type CargoComissao =
  | "admin" // <-- Adicionado para permissão de Super Admin (Chave Mestra)
  | "presidencia"
  | "rh"
  | "tesouraria"
  | "marketing"
  | "eventos"
  | "secretaria"
  | "membro"
  | "aderido"; // <-- Adicionado para alinhar com a lógica do Frontend

// ----------------------------------------------------------------------------
// 1. USUÁRIO (O Aderido / Formando / Membro da Comissão)
// Coleção: 'usuarios'
// ----------------------------------------------------------------------------
export interface Usuario {
  id?: string; // ID do documento no Firebase (ex: ADERIDO_001)
  id_aderido?: string; // Identificador interno usado para relações
  cpf: string; // Chave primária de validação
  uid: string | null; // ID gerado pelo Firebase Auth
  nome: string;
  email: string | null;
  telefone: string;

  cargo: CargoComissao;

  faixa_rifas: {
    inicio: string; // Ex: "0001"
    fim: string; // Ex: "0120"
  };

  meta_vendas: number; // Geralmente R$ 1.200,00
  total_arrecadado: number; // Valor já aprovado pela Tesouraria
  rifas_vendidas: number; // Quantidade de bilhetes com status 'pago'

  status: "pendente" | "ativo" | "inativo";
  criado_em: string;
}

// ----------------------------------------------------------------------------
// 2. COMPRADOR (O Cliente que fez o PIX)
// Coleção: 'compradores'
// ----------------------------------------------------------------------------
export interface Comprador {
  id: string;
  nome: string;
  email?: string | null;
  telefone: string;
  criado_em: string;
}

// ----------------------------------------------------------------------------
// 3. NÚMERO (O Bilhete da Rifa)
// Coleção: 'bilhetes'
// ----------------------------------------------------------------------------

// AQUI ESTÁ A CORREÇÃO: Adicionado o "recusado" à lista de tipos permitidos!
export type StatusBilhete =
  | "disponivel"
  | "reservado"
  | "pendente"
  | "pago"
  | "recusado";

export interface Bilhete {
  numero: string;
  status: StatusBilhete;

  vendedor_cpf: string;
  vendedor_id?: string; // Usado para disparar as notificações para a pessoa certa
  vendedor_nome?: string;

  comprador_id: string | null;
  comprador_nome?: string;
  comprador_email?: string | null; // Usado para enviar o recibo por e-mail

  data_reserva: string | null;
  data_pagamento: string | null;
  comprovante_url: string | null;

  log_automacao?: string; // Parecer da Inteligência Artificial
  motivo_recusa?: string | null; // Motivo preenchido pela tesouraria ao rejeitar
}

// ----------------------------------------------------------------------------
// 4. PRÊMIO
// Coleção: 'premios'
// ----------------------------------------------------------------------------
export interface Premio {
  id: string;
  colocacao: number; // Posição (1º Lugar, 2º Lugar, etc.)
  nome: string; // O que é o prêmio
  descricao?: string;
  imagem_url?: string;
  ganhador_numero?: string;
  ganhador_nome?: string;
  ativo: boolean; // Para a Tesouraria poder ocultar/exibir
}

// ----------------------------------------------------------------------------
// 5. CONFIGURAÇÕES DO SORTEIO
// Coleção: 'configuracoes' -> Doc: 'sorteio'
// ----------------------------------------------------------------------------
export interface InfoSorteio {
  titulo: string;
  data: string;
  descricao: string;
}

// ----------------------------------------------------------------------------
// 6. NOTIFICAÇÕES (Alertas para os Aderidos)
// Coleção: 'notificacoes'
// ----------------------------------------------------------------------------
export interface Notificacao {
  id: string;
  vendedor_id: string; // Dono da notificação
  titulo: string;
  mensagem: string;
  rifas: string[]; // Bilhetes associados à notificação
  lida: boolean;
  data_criacao: string;
}
