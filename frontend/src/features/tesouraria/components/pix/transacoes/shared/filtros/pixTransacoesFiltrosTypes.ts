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
  { label: "Todas", value: "todas" },
  { label: "Pagas", value: "pagas" },
  { label: "Não vinculadas", value: "nao_vinculadas" },
  { label: "Canceladas", value: "canceladas" },
];
