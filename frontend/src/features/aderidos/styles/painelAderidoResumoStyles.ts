import { SxProps, Theme } from "@mui/material";

export const painelAderidoResumoStyles: Record<string, SxProps<Theme>> = {
  resumoContainer: {
    mb: {
      xs: 3,
      sm: 3.5,
    },
  },

  aderidoHeader: {
    mb: {
      xs: 2.25,
      md: 3,
    },
    px: {
      xs: 1.25,
      sm: 0,
    },
    gap: 1.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  aderidoHeaderConteudo: {
    pl: {
      xs: 1.35,
      md: 1.75,
    },
    borderLeft: {
      xs: "4px solid #0B7A61",
      md: "5px solid #0B7A61",
    },
    minWidth: 0,
    maxWidth: {
      xs: "100%",
      md: 720,
    },
    gap: 0.65,
  },

  aderidoHeaderEyebrow: {
    color: "#0B7A61",
    fontWeight: 950,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: {
      xs: "0.7rem",
      md: "0.75rem",
    },
    lineHeight: 1.2,
  },

  aderidoHeaderTitulo: {
    color: "#021B16",
    fontWeight: 950,
    letterSpacing: 0,
    lineHeight: 1.08,
    fontSize: {
      xs: "1.38rem",
      sm: "1.55rem",
      md: "1.72rem",
    },
    overflowWrap: "anywhere",
  },

  aderidoHeaderDescricao: {
    color: "#EAF3EF",
    mt: 1,
    lineHeight: 1.45,
    maxWidth: 560,
    fontSize: {
      xs: "0.92rem",
      sm: "0.98rem",
    },
  },

  resumoHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "start",
    gap: 2,
    mb: 2.25,
  },

  saudacaoTitulo: {
    fontWeight: 900,
    color: "#061F18",
    letterSpacing: 0,
    fontSize: {
      xs: "1.45rem",
      sm: "1.75rem",
    },
    lineHeight: 1.15,
  },

  saudacaoSubtitulo: {
    color: "#425951",
    mt: 0.75,
    lineHeight: 1.5,
    maxWidth: 520,
    fontSize: {
      xs: "0.95rem",
      sm: "1rem",
    },
  },

  notificacaoButton: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 2,
    bgcolor: "#FFFFFF",
    color: "#063D31",
    border: "1px solid rgba(6, 61, 49, 0.10)",
    boxShadow: "0 8px 24px rgba(2, 27, 22, 0.12)",

    "&:hover": {
      bgcolor: "#EAF3EF",
      borderColor: "rgba(6, 61, 49, 0.20)",
    },
  },

  resumoCompactoCard: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
    },
    gap: {
      xs: 1.35,
      sm: 1.5,
    },
    alignItems: "stretch",
    p: 0,
    borderRadius: {
      xs: 2,
      sm: 2.25,
    },
    bgcolor: "transparent",
    border: "none",
    boxShadow: "none",
  },

  resumoCompactoItem: {
    minWidth: 0,
    minHeight: 158,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.4,
    p: {
      xs: 2,
      sm: 2.25,
    },
    borderRadius: {
      xs: 2,
      sm: 2.25,
    },
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(6, 61, 49, 0.10)",
    boxShadow: "0 14px 34px rgba(2, 27, 22, 0.055)",
    overflow: "hidden",
    position: "relative",

    "&::after": {
      content: '""',
      position: "absolute",
      right: -24,
      top: -28,
      width: 96,
      height: 96,
      borderRadius: "50%",
      background: "rgba(234, 243, 239, 0.78)",
      pointerEvents: "none",
    },
  },

  resumoDivisor: {
    display: "none",
  },

  resumoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#EAF3EF",
    color: "#063D31",
    flexShrink: 0,
    position: "relative",
    zIndex: 1,
  },

  resumoIconBoxAlerta: {
    bgcolor: "#FFF4D8",
    color: "#6B4A00",
  },

  resumoIconBoxOk: {
    bgcolor: "#EAF7EF",
    color: "#0B5136",
  },

  resumoCardLabel: {
    color: "#536962",
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: {
      xs: "0.68rem",
      sm: "0.72rem",
    },
    lineHeight: 1.25,
  },

  resumoCardValor: {
    fontWeight: 950,
    color: "#063D31",
    letterSpacing: 0,
    fontSize: {
      xs: "1.85rem",
      sm: "2.08rem",
    },
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  resumoCardDescricao: {
    color: "#536962",
    lineHeight: 1.35,
    fontSize: {
      xs: "0.86rem",
      sm: "0.9rem",
    },
  },

  resumoMetaLinha: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    minWidth: 0,
    position: "relative",
    zIndex: 1,
  },

  resumoConteudoLinha: {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 0.65,
    position: "relative",
    zIndex: 1,
  },

  pendenciaBotao: {
    mt: 0.2,
    color: "#6B4A00",
    borderColor: "rgba(203, 166, 77, 0.55)",
    fontWeight: 850,
    textTransform: "none",
    borderRadius: 2,
    px: 1.8,
    py: 0.55,
    minHeight: 34,
    bgcolor: "rgba(255, 244, 216, 0.52)",

    "&:hover": {
      borderColor: "#A88123",
      bgcolor: "#FFF4D8",
    },
  },

  saudacaoDescricao: {
    mt: 0.75,
    color: "#4A5F59",
    lineHeight: 1.45,
    maxWidth: 460,
  },

  botaoNotificacoes: {
    width: 44,
    height: 44,
    borderRadius: 2,
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(2, 27, 22, 0.08)",
    boxShadow: "0 8px 22px rgba(2, 27, 22, 0.08)",
    color: "#0B2F24",

    "&:hover": {
      bgcolor: "#F3F7F5",
    },
  },

  resumoCard: {
    mb: 3,
    p: {
      xs: 2.25,
      sm: 2.75,
    },
    borderRadius: 2.25,
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(2, 27, 22, 0.08)",
    boxShadow: "0 14px 36px rgba(2, 27, 22, 0.08)",
  },

  resumoGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr 1fr",
      sm: "1fr 1fr",
    },
    gap: {
      xs: 2,
      sm: 3,
    },
    alignItems: "stretch",
  },

  resumoItem: {
    minWidth: 0,
  },

  resumoLabel: {
    fontSize: "0.72rem",
    fontWeight: 900,
    color: "#60736D",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    mb: 0.7,
  },

  resumoValor: {
    fontWeight: 950,
    color: "#002E26",
    lineHeight: 1,
    fontSize: {
      xs: "1.75rem",
      sm: "2.1rem",
    },
  },

  resumoDescricao: {
    mt: 1,
    color: "#4E625C",
    fontSize: "0.9rem",
    lineHeight: 1.35,
  },

  pendenciaValor: {
    fontWeight: 950,
    color: "#8E1F1F",
    lineHeight: 1,
    fontSize: {
      xs: "1.75rem",
      sm: "2.1rem",
    },
  },

  botaoCorrigirPendencia: {
    mt: 1.35,
    borderRadius: 2,
    px: 1.7,
    py: 0.55,
    fontWeight: 800,
    textTransform: "none",
    borderColor: "rgba(142, 31, 31, 0.35)",
    color: "#8E1F1F",

    "&:hover": {
      borderColor: "#8E1F1F",
      bgcolor: "rgba(142, 31, 31, 0.06)",
    },
  },
};
