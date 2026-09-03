import { colors } from "./colors";
import { SxProps, Theme } from "@mui/material";

export const surfaces = {
  card: {
    bgcolor: colors.branco,
    border: `1px solid ${colors.borda}`,
    borderRadius: 2,
    boxShadow: `0 14px 34px ${colors.sombra}`,
  },
  cardSecundario: {
    bgcolor: colors.fundoSuave,
    border: `1.5px dashed ${colors.borda}`,
    borderRadius: 2,
  },
  cartaoResumo: (featured?: boolean): SxProps<Theme> => ({
    bgcolor: featured ? colors.verdeEscuro : colors.branco,
    color: featured ? colors.branco : colors.pretoEsverdeado,
    border: featured ? "none" : `1px solid ${colors.borda}`,
    borderRadius: 2,
    boxShadow: featured
      ? `0 14px 34px rgba(6, 61, 49, 0.24)`
      : `0 14px 34px ${colors.sombra}`,
    transition: "transform 200ms ease, box-shadow 200ms ease",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: featured
        ? `0 16px 40px rgba(6, 61, 49, 0.32)`
        : `0 16px 40px rgba(2, 27, 22, 0.12)`,
    },
  }),
} as const;
