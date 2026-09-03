import { formatarMoeda as formatarMoedaDesempenho } from "./formatadores";

export { formatarMoedaDesempenho };

export function formatarInteiroDesempenho(valor?: number | null) {
  const valorSeguro = Number.isFinite(valor) ? Number(valor) : 0;

  return valorSeguro.toLocaleString("pt-BR");
}

export function formatarValorEixoDesempenho(valor: number) {
  if (valor >= 1000) {
    return `R$ ${Math.round(valor / 1000)} mil`;
  }

  return `R$ ${valor}`;
}
