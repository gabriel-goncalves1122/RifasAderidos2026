import type { FiltroRifasAderido, RifaAderido } from "../types/painelAderido";

export type ContadoresRifas = Record<FiltroRifasAderido, number>;

export interface FiltroRifasConfig {
  label: string;
  value: FiltroRifasAderido;
  bg: string;
  color: string;
  border: string;
  hoverBg: string;
}

export interface FiltroRifasOpcao extends FiltroRifasConfig {
  total: number;
}

export const FILTROS_RIFAS_CONFIG: Record<FiltroRifasAderido, FiltroRifasConfig> = {
  todas: {
    label: "Todas",
    value: "todas",
    bg: "#063D31",
    color: "#FFFFFF",
    border: "#063D31",
    hoverBg: "#021B16",
  },
  disponivel: {
    label: "Disponíveis",
    value: "disponivel",
    bg: "#EAF7F1",
    color: "#064532",
    border: "#8DBEAD",
    hoverBg: "#DDF1E9",
  },
  reservado: {
    label: "Reservadas",
    value: "reservado",
    bg: "#F3F4F6",
    color: "#374151",
    border: "#BFC5CC",
    hoverBg: "#E8EAEE",
  },
  pendente: {
    label: "Em análise",
    value: "pendente",
    bg: "#FFF4D8",
    color: "#6B4A00",
    border: "#CBA64D",
    hoverBg: "#FFE9AD",
  },
  pago: {
    label: "Pagas",
    value: "pago",
    bg: "#E7F6EE",
    color: "#0B5136",
    border: "#5DAE83",
    hoverBg: "#D8EFE4",
  },
  recusado: {
    label: "Negadas",
    value: "recusado",
    bg: "#FAD6D6",
    color: "#8E1F1F",
    border: "#C84F4F",
    hoverBg: "#F2C3C3",
  },
};

const ORDEM_FILTROS: FiltroRifasAderido[] = [
  "todas",
  "disponivel",
  "pendente",
  "pago",
  "recusado",
  "reservado",
];

function criarContadoresVazios(): ContadoresRifas {
  return {
    todas: 0,
    disponivel: 0,
    reservado: 0,
    pendente: 0,
    pago: 0,
    recusado: 0,
  };
}

function obterStatusContabil(status?: string): FiltroRifasAderido | null {
  if (
    status === "disponivel" ||
    status === "reservado" ||
    status === "pendente" ||
    status === "pago" ||
    status === "recusado"
  ) {
    return status;
  }

  return null;
}

export function calcularContadoresRifas(rifas: RifaAderido[]): ContadoresRifas {
  const contadores = criarContadoresVazios();

  rifas.forEach((rifa) => {
    contadores.todas += 1;

    const status = obterStatusContabil(rifa.status);
    if (status) {
      contadores[status] += 1;
    }
  });

  return contadores;
}

export function montarOpcoesFiltroRifas(
  contadores: ContadoresRifas,
  filtroAtual: FiltroRifasAderido,
): FiltroRifasOpcao[] {
  return ORDEM_FILTROS
    .filter((value) => {
      if (value !== "reservado") return true;

      return contadores.reservado > 0 || filtroAtual === "reservado";
    })
    .map((value) => ({
      ...FILTROS_RIFAS_CONFIG[value],
      total: contadores[value],
    }));
}
