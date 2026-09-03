// ============================================================================
// UTILS: calcularResumoRifas
//
// Funcoes de negocio para calcular indicadores do resumo do painel:
// - Valor total arrecadado (rifas pagas * VALOR_RIFA)
// - Contagem de notificacoes nao lidas
// - Filtro de rifas por status
// ============================================================================
import { VALOR_RIFA } from "./constants";
import { NotificacaoAderido, RifaAderido } from "../types/painelAderido";

export function calcularValorArrecadado(rifas: RifaAderido[]) {
  return rifas.filter((rifa) => rifa.status === "pago").length * VALOR_RIFA;
}

export function contarNotificacoesNaoLidas(notificacoes: NotificacaoAderido[]) {
  return notificacoes.filter(
    (notificacao) => 
      !notificacao.lida && 
      (notificacao.tipo === "correcao_dados" || !notificacao.tipo)
  ).length;
}

export function filtrarRifasPorStatus(rifas: RifaAderido[], filtro: string) {
  if (filtro === "todas") return rifas;

  return rifas.filter((rifa) => rifa.status === filtro);
}
