import { colors } from "./colors";

export const components = {
  botaoNovoPremio: {
    borderRadius: 2,
    fontWeight: 850,
    textTransform: "none" as const,
    bgcolor: colors.verdeEscuro,
    "&:hover": {
      bgcolor: colors.verdeEscuroHover,
    },
  },
  botaoSecundario: {
    color: colors.verdeEscuro,
    fontWeight: 850,
    textTransform: "none" as const,
  },
  botaoCancelar: {
    color: colors.cinzaTexto,
    fontWeight: 700,
    textTransform: "none" as const,
  },
  botaoExcluir: {
    color: colors.erroTexto,
    fontWeight: 850,
    textTransform: "none" as const,
  },
  iconeEditar: {
    position: "absolute" as const,
    top: 8,
    right: 8,
    bgcolor: "rgba(255,255,255,0.85)",
    zIndex: 2,
    "&:hover": {
      bgcolor: colors.verdeClaro,
    },
  },
} as const;
