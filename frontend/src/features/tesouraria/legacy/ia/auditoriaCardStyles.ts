
const cores = {
  verdeEscuro: "#063D31",
  verdeProfundo: "#021B16",
  verdeSuave: "#EAF3EF",
  verdeBorda: "rgba(6, 61, 49, 0.18)",

  amareloFundo: "#FFF7E0",
  amareloTexto: "#6B4E00",
  amareloBorda: "rgba(143, 104, 0, 0.25)",

  vermelhoFundo: "#FDF0F0",
  vermelhoTexto: "#7A1F1F",
  vermelhoBorda: "rgba(122, 31, 31, 0.22)",

  cinzaTexto: "#526760",
  cinzaBorda: "rgba(2, 27, 22, 0.10)",
  fundoCard: "#FFFFFF",
  fundoBloco: "#F6F8F7",
};

export const auditoriaCardStyles = {
  card: {
    borderRadius: 3,
    border: `1px solid ${cores.cinzaBorda}`,
    bgcolor: cores.fundoCard,
    boxShadow: "0 10px 28px rgba(2, 27, 22, 0.08)",
    overflow: "hidden",
  },

  cardAprovado: {
    borderColor: cores.verdeBorda,
  },

  cardDivergente: {
    borderColor: cores.amareloBorda,
  },

  topo: {
    px: 2.25,
    py: 1.75,
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", sm: "center" },
    gap: 1.5,
    bgcolor: cores.fundoBloco,
    borderBottom: `1px solid ${cores.cinzaBorda}`,
  },

  dataReserva: {
    color: cores.cinzaTexto,
    fontSize: "0.78rem",
    fontWeight: 700,
  },

  conteudo: {
    p: 2.25,
  },

  gridInformacoes: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "1fr 1.1fr" },
    gap: 1.5,
  },

  blocoPrimario: {
    p: 1.75,
    borderRadius: 2.5,
    bgcolor: cores.verdeSuave,
    border: `1px solid ${cores.verdeBorda}`,
    height: "100%",
  },

  blocoSecundario: {
    p: 1.75,
    borderRadius: 2.5,
    bgcolor: cores.fundoBloco,
    border: `1px solid ${cores.cinzaBorda}`,
    height: "100%",
  },

  blocoTitulo: {
    color: cores.verdeEscuro,
    fontWeight: 900,
    fontSize: "0.72rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    mb: 1.25,
    display: "block",
  },

  label: {
    color: cores.cinzaTexto,
    fontSize: "0.73rem",
    lineHeight: 1.1,
  },

  valorPix: {
    color: cores.verdeProfundo,
    fontWeight: 950,
    fontSize: "1.35rem",
    lineHeight: 1.05,
  },

  textoForte: {
    color: cores.verdeProfundo,
    fontWeight: 850,
    fontSize: "0.92rem",
    lineHeight: 1.15,
  },

  chipNumero: {
    height: 22,
    borderRadius: 1.5,
    bgcolor: "#FFFFFF",
    color: cores.verdeEscuro,
    border: `1px solid ${cores.verdeBorda}`,
    fontWeight: 850,
    fontSize: "0.72rem",
  },

  actions: {
    px: 2.25,
    py: 1.75,
    bgcolor: cores.fundoBloco,
    borderTop: `1px solid ${cores.cinzaBorda}`,
  },

  actionsLinha: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    width: "100%",
    flexDirection: { xs: "column", sm: "row" },
    gap: 1.25,
  },

  grupoAcoes: {
    display: "flex",
    gap: 1,
    flexWrap: "wrap",
    justifyContent: { xs: "stretch", sm: "flex-end" },
  },

  botaoPrimario: {
    borderRadius: 2,
    bgcolor: cores.verdeEscuro,
    color: "#FFFFFF",
    fontWeight: 850,
    textTransform: "none",
    px: 2,
    "&:hover": {
      bgcolor: "#052F26",
    },
  },

  botaoSecundario: {
    borderRadius: 2,
    color: cores.verdeEscuro,
    borderColor: cores.verdeBorda,
    fontWeight: 850,
    textTransform: "none",
    px: 2,
    "&:hover": {
      borderColor: cores.verdeEscuro,
      bgcolor: cores.verdeSuave,
    },
  },

  botaoPerigo: {
    borderRadius: 2,
    fontWeight: 850,
    textTransform: "none",
    px: 2,
  },

  alertaIa: {
    mb: 2,
    borderRadius: 2,
    border: `1px solid ${cores.verdeBorda}`,
    bgcolor: cores.verdeSuave,
    color: cores.verdeProfundo,
    "& .MuiAlert-icon": {
      color: cores.verdeEscuro,
    },
    "& .MuiAlert-message": {
      fontSize: "0.86rem",
      lineHeight: 1.45,
    },
  },

  alertaIaDivergente: {
    border: `1px solid ${cores.amareloBorda}`,
    bgcolor: cores.amareloFundo,
    color: cores.amareloTexto,
    "& .MuiAlert-icon": {
      color: cores.amareloTexto,
    },
  },

  recusaContainer: {
    width: "100%",
    pt: 1.5,
  },

  recusaBox: {
    p: 1.5,
    borderRadius: 2,
    bgcolor: cores.vermelhoFundo,
    border: `1px solid ${cores.vermelhoBorda}`,
  },
};
