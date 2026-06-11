// ============================================================================
// SANITIZADORES DE DADOS DE ENTRADA
//
// Funcoes para limpar e validar dados antes de enviar ao backend.
// O backend e a barreira principal de seguranca, mas o frontend
// nao deve enviar dados obviamente malformados (defense-in-depth).
// ============================================================================
import { SANITIZE_LIMITES } from "./constants";

export function sanitizarNome(valor: string): string {
  return valor.trim().slice(0, SANITIZE_LIMITES.nome);
}

export function sanitizarTelefone(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, SANITIZE_LIMITES.telefone);
}

export function sanitizarEmail(valor: string): string {
  const email = valor.trim().slice(0, SANITIZE_LIMITES.email);

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "";
  }

  return email;
}

export function sanitizarDadosCliente(dados: {
  nome: string;
  telefone: string;
  email?: string;
}) {
  return {
    nome: sanitizarNome(dados.nome),
    telefone: sanitizarTelefone(dados.telefone),
    email: sanitizarEmail(dados.email || ""),
  };
}
