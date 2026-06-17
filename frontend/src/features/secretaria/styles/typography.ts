import { secretariaColors } from "./colors";

export const secretariaTypography = {
  eyebrow: {
    color: secretariaColors.cinzaTexto,
    fontSize: "0.76rem",
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  valorResumo: {
    color: secretariaColors.pretoEsverdeado,
    fontSize: "1.45rem",
    fontWeight: 950,
    lineHeight: 1.1,
  },
  textoAuxiliar: {
    color: secretariaColors.cinzaTexto,
    fontSize: "0.84rem",
    lineHeight: 1.35,
  },
} as const;
