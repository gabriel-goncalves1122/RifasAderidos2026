import { AuditoriaComprasFiltros } from "../../../types/auditoriaCompras";

export interface AuditoriaComprasFiltrosProps {
  filtros: AuditoriaComprasFiltros;
  filtrosAtivos: boolean;
  possuiResultados: boolean;
  onChangeFiltros: (filtros: AuditoriaComprasFiltros) => void;
  onLimparFiltros: () => void;
  onExportarCsv: () => void;
}
