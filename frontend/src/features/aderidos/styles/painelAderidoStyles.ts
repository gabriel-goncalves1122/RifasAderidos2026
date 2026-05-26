// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/styles/painelAderidoStyles.ts
// ============================================================================
import { SxProps, Theme } from "@mui/material";

export const painelAderidoStyles: Record<string, SxProps<Theme>> = {
  root: {
    width: "100%",
    maxWidth: 980,
    mx: "auto",
    px: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    py: {
      xs: 2.5,
      md: 4,
    },
  },

  // ============================================================================
  // CARRINHO FIXO INFERIOR
  // ============================================================================
  carrinhoFixoArea: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
    px: {
      xs: 2,
      sm: 3,
    },
    pt: 2,
    pb: {
      xs: "calc(env(safe-area-inset-bottom) + 14px)",
      sm: 2.5,
    },
    background:
      "linear-gradient(180deg, rgba(246, 249, 247, 0) 0%, rgba(246, 249, 247, 0.82) 42%, rgba(246, 249, 247, 1) 100%)",
    pointerEvents: "none",
  },

  carrinhoFixoCard: {
    width: "100%",
    maxWidth: 760,
    mx: "auto",
    p: {
      xs: 1.25,
      sm: 1.5,
    },
    borderRadius: {
      xs: "26px",
      sm: "30px",
    },
    bgcolor: "rgba(255, 255, 255, 0.96)",
    border: "1.5px solid rgba(196, 154, 44, 0.64)",
    boxShadow:
      "0 18px 44px rgba(5, 46, 35, 0.18), 0 2px 8px rgba(196, 154, 44, 0.12)",
    backdropFilter: "blur(10px)",
    pointerEvents: "auto",
  },

  carrinhoFixoConteudo: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr auto",
      sm: "1fr auto",
    },
    alignItems: "center",
    gap: {
      xs: 1.25,
      sm: 2,
    },
  },

  carrinhoResumoArea: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: {
      xs: 1.15,
      sm: 1.35,
    },
  },

  carrinhoQuantidadeChip: {
    width: {
      xs: 44,
      sm: 48,
    },
    height: {
      xs: 44,
      sm: 48,
    },
    flexShrink: 0,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#052E23",
    color: "#FFFFFF",
    fontWeight: 950,
    fontSize: {
      xs: "1rem",
      sm: "1.08rem",
    },
    boxShadow: "0 8px 18px rgba(5, 46, 35, 0.20)",
  },

  carrinhoTextoArea: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  carrinhoFixoTitulo: {
    color: "#53615D",
    fontWeight: 850,
    lineHeight: 1.15,
    fontSize: {
      xs: "0.86rem",
      sm: "0.95rem",
    },
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  carrinhoFixoDescricao: {
    mt: 0.15,
    color: "#061F18",
    fontWeight: 950,
    letterSpacing: "-0.035em",
    fontSize: {
      xs: "1.45rem",
      sm: "1.7rem",
    },
    lineHeight: 1.05,
    whiteSpace: "nowrap",
  },

  carrinhoFixoBotao: {
    minHeight: {
      xs: 52,
      sm: 54,
    },
    minWidth: {
      xs: 124,
      sm: 170,
    },
    borderRadius: 999,
    px: {
      xs: 1.7,
      sm: 2.6,
    },
    bgcolor: "#C49A2C",
    color: "#FFFFFF",
    fontWeight: 950,
    fontSize: {
      xs: "0.95rem",
      sm: "1rem",
    },
    textTransform: "none",
    boxShadow: "0 10px 22px rgba(196, 154, 44, 0.28)",

    "& .MuiButton-startIcon": {
      mr: {
        xs: 0.7,
        sm: 1,
      },
    },

    "&:hover": {
      bgcolor: "#AD8622",
      boxShadow: "0 14px 28px rgba(196, 154, 44, 0.34)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      transform: "translateY(0)",
    },
  },

  blocoVendasHeader: {
    mb: 2.25,
  },

  blocoVendasTituloLinha: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 0.9,
    pl: {
      xs: 0.25,
      sm: 0.5,
    },
  },

  blocoVendasTitulo: {
    fontWeight: 900,
    color: "#021B16",
    lineHeight: 1.1,
    letterSpacing: "-0.035em",
    fontSize: {
      xs: "1.45rem",
      sm: "1.75rem",
    },
  },

  blocoVendasDescricao: {
    color: "#536962",
    lineHeight: 1.45,
    maxWidth: 520,
    fontSize: {
      xs: "0.95rem",
      sm: "1rem",
    },
    pl: {
      xs: 0.25,
      sm: 0.5,
    },
  },
  filtrosContainer: {
    width: "100%",
    overflowX: "auto",
    pb: 1,
    mb: 2.5,
    gap: 1,

    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  filtroChip: {
    height: 38,
    px: 0.8,
    borderRadius: "999px",
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(5, 46, 35, 0.14)",
    color: "#173B32",
    fontWeight: 850,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 10px rgba(2, 27, 22, 0.035)",

    "& .MuiChip-label": {
      px: 1.55,
    },

    "&:hover": {
      bgcolor: "#F4FAF7",
      borderColor: "rgba(5, 46, 35, 0.22)",
    },
  },

  filtroChipAtivo: {
    bgcolor: "#052E23",
    color: "#FFFFFF",
    borderColor: "#052E23",
    boxShadow: "0 8px 16px rgba(5, 46, 35, 0.16)",

    "&:hover": {
      bgcolor: "#031F18",
      borderColor: "#031F18",
    },
  },
  gridRifasWrapper: {
    maxHeight: {
      xs: "48vh",
      sm: 480,
      md: 540,
    },
    minHeight: {
      xs: 340,
      sm: 380,
    },
    overflowY: "auto",
    overflowX: "hidden",

    px: {
      xs: 0,
      sm: 0.25,
    },
    py: {
      xs: 0.25,
      sm: 0.5,
    },
    pr: {
      xs: 0.4,
      sm: 0.75,
    },

    bgcolor: "transparent",
    border: "none",
    boxShadow: "none",

    scrollbarWidth: "thin",
    scrollbarColor: "rgba(5, 46, 35, 0.24) transparent",

    "&::-webkit-scrollbar": {
      width: 6,
    },

    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },

    "&::-webkit-scrollbar-thumb": {
      background: "rgba(5, 46, 35, 0.24)",
      borderRadius: 999,
    },
  },

  gridRifas: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(4, minmax(68px, 1fr))",
      sm: "repeat(auto-fill, minmax(86px, 1fr))",
      md: "repeat(auto-fill, minmax(92px, 1fr))",
    },
    gap: {
      xs: 1.35,
      sm: 1.55,
    },
  },

  rifaButton: {
    minHeight: {
      xs: 48,
      sm: 50,
    },
    width: "100%",
    borderRadius: "13px",
    px: {
      xs: 1,
      sm: 1.25,
    },
    border: "1.7px solid",
    fontWeight: 900,
    fontSize: {
      xs: "0.88rem",
      sm: "0.96rem",
    },
    lineHeight: 1,
    letterSpacing: "0.015em",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition:
      "transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease, border-color 140ms ease",

    "&:focus-visible": {
      outline: "3px solid rgba(6, 61, 49, 0.22)",
      outlineOffset: 2,
    },

    "&.Mui-disabled": {
      opacity: 1,
    },
  },

  blocoVendasCard: {
    mt: {
      xs: 3.5,
      sm: 4,
    },
    p: 0,
    borderRadius: 0,
    bgcolor: "transparent",
    border: "none",
    boxShadow: "none",
  },

  blocoVendasArea: {
    mt: {
      xs: 3.5,
      sm: 4,
    },
  },

  // ============================================================================
  // CARD DE RIFAS
  // ============================================================================

  // ============================================================================
  // GRID DAS RIFAS
  // ============================================================================

  resumoContainer: {
    mb: {
      xs: 3,
      sm: 3.5,
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
    letterSpacing: "-0.035em",
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
    borderRadius: "50%",
    bgcolor: "#FFFFFF",
    color: "#052E23",
    border: "1px solid rgba(5, 46, 35, 0.10)",
    boxShadow: "0 8px 24px rgba(5, 46, 35, 0.10)",

    "&:hover": {
      bgcolor: "#F4FAF7",
      borderColor: "rgba(5, 46, 35, 0.20)",
    },
  },

  resumoCompactoCard: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "1fr auto 1fr",
    },
    gap: {
      xs: 2,
      sm: 2.5,
    },
    alignItems: "stretch",
    p: {
      xs: 2.4,
      sm: 2.8,
    },
    borderRadius: {
      xs: 4,
      sm: 5,
    },
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(5, 46, 35, 0.08)",
    boxShadow: "0 14px 34px rgba(5, 46, 35, 0.065)",
  },

  resumoCompactoItem: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 0.75,
    p: {
      xs: 0.25,
      sm: 0.5,
    },
  },

  resumoDivisor: {
    display: {
      xs: "none",
      sm: "block",
    },
    width: "1px",
    bgcolor: "rgba(5, 46, 35, 0.10)",
  },

  resumoIconBox: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#EAF3EF",
    color: "#052E23",
    flexShrink: 0,
  },

  resumoCardLabel: {
    color: "#536962",
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    fontSize: {
      xs: "0.7rem",
      sm: "0.74rem",
    },
    lineHeight: 1.25,
  },

  resumoCardValor: {
    fontWeight: 950,
    color: "#052E23",
    letterSpacing: "-0.045em",
    fontSize: {
      xs: "1.9rem",
      sm: "2.2rem",
    },
    lineHeight: 1,
    whiteSpace: "nowrap",
  },

  resumoCardDescricao: {
    color: "#536962",
    lineHeight: 1.45,
    fontSize: {
      xs: "0.88rem",
      sm: "0.92rem",
    },
  },

  pendenciaBotao: {
    mt: 0.4,
    color: "#8A2A2A",
    borderColor: "rgba(138, 42, 42, 0.30)",
    fontWeight: 850,
    textTransform: "none",
    borderRadius: 999,
    px: 1.8,
    py: 0.55,
    minHeight: 34,

    "&:hover": {
      borderColor: "#8A2A2A",
      bgcolor: "rgba(138, 42, 42, 0.055)",
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
    borderRadius: "14px",
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
    borderRadius: "22px",
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
    borderRadius: "12px",
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

  legendaChip: {
    height: 28,
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "0.78rem",

    "& .MuiChip-label": {
      px: 1.1,
    },
  },

  vendaResumoFixo: {
    position: "sticky",
    bottom: 0,
    zIndex: 5,
    mt: 2,
    p: {
      xs: 1.5,
      sm: 2,
    },
    borderRadius: "18px",
    bgcolor: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(2, 27, 22, 0.12)",
    boxShadow: "0 -8px 26px rgba(2, 27, 22, 0.1)",
    backdropFilter: "blur(10px)",
  },

  vendaResumoContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  },

  vendaResumoTitulo: {
    fontWeight: 900,
    color: "#021B16",
    lineHeight: 1.15,
  },

  vendaResumoDescricao: {
    color: "#526760",
    fontSize: "0.9rem",
    mt: 0.25,
  },

  vendaResumoBotao: {
    borderRadius: "12px",
    px: {
      xs: 2,
      sm: 3,
    },
    py: 1.1,
    fontWeight: 900,
    textTransform: "none",
    bgcolor: "#063D31",

    "&:hover": {
      bgcolor: "#052F26",
    },
  },
};
