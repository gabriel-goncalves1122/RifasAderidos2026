// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/utils/calcularResumoRifas.ts
// ============================================================================
import { NotificacaoAderido, RifaAderido } from "../types/painelAderido";

const VALOR_RIFA = 10;

export function calcularValorArrecadado(rifas: RifaAderido[]) {
  // A tela do aderido considera arrecadado apenas o que já foi aprovado.
  return rifas.filter((rifa) => rifa.status === "pago").length * VALOR_RIFA;
}

export function contarNotificacoesNaoLidas(notificacoes: NotificacaoAderido[]) {
  return notificacoes.filter((notificacao) => !notificacao.lida).length;
}

export function filtrarRifasPorStatus(rifas: RifaAderido[], filtro: string) {
  if (filtro === "todas") return rifas;

  return rifas.filter((rifa) => rifa.status === filtro);
}
