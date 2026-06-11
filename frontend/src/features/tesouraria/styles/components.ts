import { colors } from "./colors";

export const components = {
  botaoPrimario: {
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
  botaoAceitar: {
    minWidth: 104,
    borderRadius: 1.75,
    color: colors.verdeEscuro,
    bgcolor: colors.verdeClaro,
    border: "1px solid rgba(6, 61, 49, 0.18)",
    fontWeight: 850,
    textTransform: "none" as const,
    "&:hover": {
      bgcolor: colors.verdeHover,
    },
  },
  botaoNegar: {
    minWidth: 96,
    borderRadius: 1.75,
    color: colors.erroTexto,
    bgcolor: colors.erroSuave,
    border: "1px solid rgba(122, 31, 31, 0.18)",
    fontWeight: 850,
    textTransform: "none" as const,
    "&:hover": {
      bgcolor: "#F9E4E4",
    },
  },
  chipVerde: {
    height: 24,
    borderRadius: 1.5,
    bgcolor: colors.verdeClaro,
    color: colors.verdeEscuro,
    border: "1px solid rgba(6, 61, 49, 0.18)",
    fontWeight: 850,
  },
  chipBilhete: {
    bgcolor: colors.verdeClaro,
    color: colors.verdeEscuro,
    fontWeight: 850,
  },
  alertaWarning: {
    borderRadius: 2,
    bgcolor: colors.alertaSuave,
    color: colors.alertaTexto,
    "& .MuiAlert-icon": {
      color: colors.alertaTexto,
    },
  },
  alertaErro: {
    borderRadius: 2,
  },
  tabelaCabecalho: {
    bgcolor: colors.fundoSuave,
    "& th": {
      color: colors.cinzaTexto,
      fontWeight: 900,
      fontSize: "0.72rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
      py: 1.45,
      borderColor: "rgba(2, 27, 22, 0.08)",
    },
  },
  linhaTabela: {
    "& td": {
      borderColor: "rgba(2, 27, 22, 0.08)",
      verticalAlign: "middle" as const,
      py: 1.45,
    },
    "&:hover": {
      bgcolor: colors.fundoDialogActions,
    },
  },
  labelVerde: {
    display: "inline-flex",
    px: 1,
    py: 0.5,
    borderRadius: 2,
    bgcolor: colors.verdeClaro,
    color: colors.verdeEscuro,
    fontWeight: 950,
  },
};
