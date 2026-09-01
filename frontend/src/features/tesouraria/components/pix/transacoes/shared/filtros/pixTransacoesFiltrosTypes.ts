import {
  FiltroRapidoTransacoesPix,
  PixTransacoesFiltros,
} from "../../../../../types/pixTransacoes";

export interface PixTransacoesFiltrosProps {
  filtros: PixTransacoesFiltros;
  onChangeFiltros: (filtros: PixTransacoesFiltros) => void;
}

export const FILTROS_PIX: Array<{
  label: string;
  value: FiltroRapidoTransacoesPix;
}> = [
  { label: "Novas", value: "novas" },
  { label: "Recusadas", value: "recusadas" },
  { label: "Aguardando Pagamento", value: "aguardando_pagamento" },
];
