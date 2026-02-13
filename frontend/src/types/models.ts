// src/types/models.ts

// ==========================================
// 1. USUÁRIO (O Aderido / Formando)
// Coleção: 'usuarios'
// ==========================================
export interface Usuario {
  cpf: string; // CHAVE PRIMÁRIA de validação (Apenas números)
  uid: string | null; // null até o aluno validar o CPF e criar a senha
  nome: string;
  email: string | null; // null na Seed, preenchido na hora do cadastro
  telefone: string;

  // Controle do Lote de 120 Rifas
  faixa_rifas: {
    inicio: string; // Ex: "0001"
    fim: string; // Ex: "0120"
  };

  // Financeiro
  meta_vendas: number;
  total_arrecadado: number;
  rifas_vendidas: number;

  // Máquina de Estados do Aluno
  status: "pendente" | "ativo" | "inativo";
  criado_em: string;
}

// ==========================================
// 2. COMPRADOR (O Cliente do PIX)
// Coleção: 'compradores'
// ==========================================
export interface Comprador {
  id: string;
  nome: string;
  email?: string;
  telefone: string;
  cpf?: string; // Opcional para quem compra, mas útil para o PIX
  criado_em: string;
}

// ==========================================
// 3. NÚMERO (O Bilhete da Rifa)
// Coleção: 'bilhetes'
// ==========================================
export type StatusBilhete = "disponivel" | "reservado" | "em_analise" | "pago";

export interface Bilhete {
  numero: string;
  status: StatusBilhete;

  // O vendedor_id agora apontará para o CPF do aluno, garantindo um link inquebrável
  // mesmo antes do aluno ter um 'uid' do Firebase.
  vendedor_cpf: string;
  comprador_id: string | null;

  // Timestamps
  data_reserva: string | null;
  data_pagamento: string | null;

  // Auditoria PIX
  comprovante_url: string | null;
}

// ==========================================
// 4. PRÊMIO
// Coleção: 'premios'
// ==========================================
export interface Premio {
  id: string;
  ordem_sorteio: number;
  titulo: string;
  descricao: string;
  imagem_url?: string;
  data_sorteio?: string;
  ganhador_numero?: string;
  ganhador_nome?: string;
}
