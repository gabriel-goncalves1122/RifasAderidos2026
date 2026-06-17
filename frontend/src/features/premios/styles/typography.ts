import { colors } from "./colors";

export const typography = {
  secaoTitulo: {
    color: colors.pretoEsverdeado,
    fontWeight: 900,
    fontSize: { xs: "1.2rem", sm: "1.45rem" },
    borderLeft: `4px solid ${colors.verdeForte}`,
    pl: 2,
  },
  colocacao: {
    color: colors.verdeForteEscuro,
    fontWeight: 900,
    fontSize: "0.72rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    display: "block",
    lineHeight: 1.2,
  },
  bannerTitulo: {
    color: colors.pretoEsverdeado,
    fontWeight: 950,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
    fontSize: { xs: "1.8rem", md: "2.6rem" },
    lineHeight: 1.08,
  },
  bannerData: {
    color: "rgba(2,27,22,0.85)",
    fontWeight: 700,
    fontSize: { xs: "0.95rem", md: "1.1rem" },
    display: "flex",
    alignItems: "center",
    gap: 0.75,
  },
  bannerDescricao: {
    color: "rgba(2,27,22,0.8)",
    fontSize: "1rem",
    maxWidth: 640,
    lineHeight: 1.5,
  },
  cardTitulo: {
    color: colors.verdeEscuro,
    fontWeight: 900,
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
} as const;
