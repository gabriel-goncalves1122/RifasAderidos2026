// ============================================================================
// ARQUIVO: models.ts (A Definição de Dados do Sistema)
// ============================================================================

// ----------------------------------------------------------------------------
// DEFINIÇÕES DE CARGOS (RBAC - Role Based Access Control)
// ----------------------------------------------------------------------------
export type CargoComissao =
  | "presidencia"
  | "rh"
  | "tesouraria"
  | "marketing"
  | "eventos"
  | "secretaria"
  | "membro"; // Aluno aderido comum

// ----------------------------------------------------------------------------
// 1. USUÁRIO (O Aderido / Formando / Membro da Comissão)
// Coleção: 'usuarios'
// ----------------------------------------------------------------------------
export interface Usuario {
  cpf: string; // Chave primária de validação
  uid: string | null; // ID gerado pelo Firebase Auth
  nome: string;
  email: string | null;
  telefone: string;

  // O NOVO CAMPO DE HIERARQUIA
  cargo: CargoComissao;

  // Controle do Lote de 120 Rifas
  faixa_rifas: {
    inicio: string; // Ex: "0001"
    fim: string; // Ex: "0120"
  };

  // Financeiro (Resumo para o Dashboard)
  meta_vendas: number; // Geralmente R$ 1.200,00
  total_arrecadado: number; // Valor já aprovado pela Tesouraria
  rifas_vendidas: number; // Quantidade de bilhetes com status 'pago'

  // Máquina de Estados do Aluno
  status: "pendente" | "ativo" | "inativo";
  criado_em: string;
}

// ----------------------------------------------------------------------------
// 2. COMPRADOR (O Cliente que fez o PIX)
// Coleção: 'compradores'
// ----------------------------------------------------------------------------
export interface Comprador {
  id: string; // UID ou ID automático do Firestore
  nome: string;
  email?: string;
  telefone: string;
  criado_em: string;
}

// ----------------------------------------------------------------------------
// 3. NÚMERO (O Bilhete da Rifa)
// Coleção: 'bilhetes'
// ----------------------------------------------------------------------------
// 'pendente': O aderido enviou o comprovante, mas a Tesouraria ainda não olhou.
export type StatusBilhete = "disponivel" | "reservado" | "pendente" | "pago";

export interface Bilhete {
  numero: string; // Ex: "00054"
  status: StatusBilhete;

  vendedor_cpf: string; // CPF do aluno para rastreabilidade total
  comprador_id: string | null;

  // Timestamps de Auditoria
  data_reserva: string | null; // Quando foi selecionado no checkout
  data_pagamento: string | null; // Quando a Tesouraria clicou em "Aprovar"

  // Link do Firebase Storage com Metadados
  comprovante_url: string | null;
}

// ----------------------------------------------------------------------------
// 4. PRÊMIO
// Coleção: 'premios'
// ----------------------------------------------------------------------------
export interface Premio {
  id: string;
  ordem_sorteio: number;
  titulo: string;
  descricao: string;
  imagem_url?: string;
  data_sorteio?: string;
  ganhador_numero?: string;
  ganhador_nome?: string;
  ativo: boolean; // Para a Tesouraria poder ocultar/exibir prêmios
}
