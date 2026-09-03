// ============================================================================
// VALIDADORES RUNTIME DE DADOS DA API
//
// O TypeScript com "as" apenas esconde o tipo, nao valida.
// Estas funcoes garantem que o formato minimo esperado existe,
// impedindo que dados malformados ou inesperados propaguem pela UI.
// ============================================================================
import {
  NotificacaoAderido,
  RifaAderido,
} from "../types/painelAderido";

export function validarRifaAderido(dados: unknown): dados is RifaAderido {
  if (!dados || typeof dados !== "object") return false;
  const obj = dados as Record<string, unknown>;
  return typeof obj.numero === "string" && typeof obj.status === "string";
}

export function validarNotificacaoAderido(
  dados: unknown,
): dados is NotificacaoAderido {
  if (!dados || typeof dados !== "object") return false;
  const obj = dados as Record<string, unknown>;
  return typeof obj.id === "string";
}

export function filtrarApenasRifasValidas(dados: unknown): RifaAderido[] {
  if (!Array.isArray(dados)) return [];
  return dados.filter(validarRifaAderido);
}

export function filtrarApenasNotificacoesValidas(
  dados: unknown,
): NotificacaoAderido[] {
  if (!Array.isArray(dados)) return [];
  return dados.filter(validarNotificacaoAderido);
}
