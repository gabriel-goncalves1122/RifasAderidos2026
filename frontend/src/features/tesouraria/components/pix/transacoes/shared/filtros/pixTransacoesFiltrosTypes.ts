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
  { label: "Histórico / Todas", value: "todas" },
  { label: "Com rifas", value: "com_rifas" },
  { label: "Pendentes do banco", value: "pendentes_banco" },
];
