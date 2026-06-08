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
  { label: "Para validar", value: "para_validar" },
  { label: "Com rifas", value: "com_rifas" },
  { label: "Sem vínculo", value: "sem_vinculo" },
  { label: "Pendentes do banco", value: "pendentes_banco" },
];
