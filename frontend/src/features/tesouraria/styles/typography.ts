import { colors } from "./colors";

export const typography = {
  titulo: {
    color: colors.pretoEsverdeado,
    fontWeight: 950,
  },
  subtitulo: {
    color: colors.cinzaTexto,
    fontSize: "0.88rem",
    mt: 0.45,
  },
  label: {
    color: colors.cinzaTexto,
    fontSize: "0.72rem",
    fontWeight: 900,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  body: {
    color: colors.cinzaTexto,
    fontSize: "0.9rem",
  },
  bodyDestaque: {
    color: colors.pretoEsverdeado,
    fontWeight: 850,
    lineHeight: 1.2,
  },
  bodyPequeno: {
    color: colors.cinzaTexto,
    fontSize: "0.78rem",
  },
  valorMonetario: {
    color: colors.verdeEscuro,
    fontWeight: 950,
  },
  secaoTitulo: {
    color: colors.pretoEsverdeado,
    fontWeight: 900,
    fontSize: "0.92rem",
    mb: 1,
  },
};

export const chipStatus = (status: string) => {
  const s = status.trim().toLowerCase();

  if (s === "pago" || s === "aceita") {
    return {
      color: colors.branco,
      bgcolor: colors.verdeEscuro,
      border: `1px solid ${colors.verdeEscuro}`,
    };
  }

  if (s === "pendente" || s === "pendente_validacao") {
    return {
      color: colors.alertaTexto,
      bgcolor: colors.alertaSuave,
      border: "1px solid rgba(107, 78, 0, 0.25)",
    };
  }

  if (s === "recusado" || s === "negada") {
    return {
      color: colors.erroTexto,
      bgcolor: colors.erroSuave,
      border: "1px solid rgba(122, 31, 31, 0.22)",
    };
  }

  return {
    color: colors.cinzaTexto,
    bgcolor: colors.fundoSuave,
    border: "1px solid rgba(2, 27, 22, 0.10)",
  };
};
