// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/secretaria/secretariaMapper.ts
// ============================================================================
import { DadosAtualizacaoAderido, DadosNovoAderido } from "./secretariaTypes";

export function normalizarEmail(email: string): string {
  return String(email).toLowerCase().trim();
}

export function normalizarTexto(valor?: string): string {
  return valor ? String(valor).trim() : "";
}

export function normalizarTextoMaiusculo(valor?: string): string {
  return valor ? String(valor).trim().toUpperCase() : "";
}

export function montarCamposAtualizacaoAderido(dados: DadosAtualizacaoAderido) {
  const campos: Record<string, unknown> = {
    atualizado_em: new Date().toISOString(),
  };

  // Atualiza somente campos recebidos para preservar documentos antigos do Firestore.
  if (dados.nome !== undefined)
    campos.nome = normalizarTextoMaiusculo(dados.nome);
  if (dados.email !== undefined) campos.email = normalizarEmail(dados.email);
  if (dados.telefone !== undefined)
    campos.telefone = normalizarTexto(dados.telefone);
  if (dados.cpf !== undefined) campos.cpf = normalizarTexto(dados.cpf);
  if (dados.curso !== undefined)
    campos.curso = normalizarTextoMaiusculo(dados.curso);
  if (dados.genero !== undefined) campos.genero = normalizarTexto(dados.genero);
  if (dados.data_nascimento !== undefined) {
    campos.data_nascimento = normalizarTexto(dados.data_nascimento);
  }
  if (dados.cargo !== undefined) campos.cargo = dados.cargo;

  if (dados.status_cadastro !== undefined) {
    campos.status_cadastro = dados.status_cadastro;

    // Mantém compatibilidade com documentos antigos que usam apenas "status".
    campos.status = dados.status_cadastro;
  }

  return campos;
}

export function normalizarDadosNovoAderido(dados: DadosNovoAderido) {
  return {
    email: normalizarEmail(dados.email),
    nome: normalizarTextoMaiusculo(dados.nome),
    curso: normalizarTextoMaiusculo(dados.curso),
    data_nascimento: normalizarTexto(dados.data_nascimento),
    telefone: normalizarTexto(dados.telefone),
    cargo: dados.cargo || "aderido",
    modalidade_adesao: dados.modalidade_adesao || "completo",
  };
}
