import { SxProps, Theme } from "@mui/material";

import {
  aderidosColors,
  aderidosMotion,
  reduceMotionSx,
  typographyScale,
} from "../tokens";

const focusVisibleSx = {
  "&:focus-visible": {
    outline: "4px solid rgba(6, 61, 49, 0.24)",
    outlineOffset: "2px",
  },
};

export const painelAderidoSurfaceStyles: Record<string, SxProps<Theme>> = {
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
      xs: `4px solid ${aderidosColors.greenBright}`,
      md: `5px solid ${aderidosColors.greenBright}`,
    },
    minWidth: 0,
    maxWidth: {
      xs: "100%",
      md: 720,
    },
    gap: 0.65,
  },

  aderidoHeaderEyebrow: {
    color: aderidosColors.greenBright,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: {
      xs: "0.7rem",
      md: "0.75rem",
    },
    lineHeight: 1.2,
  },

  aderidoHeaderTitulo: {
    color: aderidosColors.greenBlack,
    fontWeight: 900,
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
    color: aderidosColors.greenSoft,
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
    ...typographyScale.pageTitle,
    color: "#061F18",
    letterSpacing: 0,
  },

  saudacaoSubtitulo: {
    ...typographyScale.bodyBase,
    color: "#425951",
    mt: 0.75,
    maxWidth: 520,
  },

  notificacaoButton: {
    width: 46,
    height: 46,
    flexShrink: 0,
    borderRadius: 2,
    bgcolor: aderidosColors.white,
    color: aderidosColors.greenDark,
    border: "1px solid rgba(6, 61, 49, 0.10)",
    boxShadow: "0 8px 24px rgba(2, 27, 22, 0.12)",
    transition: `background-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, border-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
    ...focusVisibleSx,
    ...reduceMotionSx,

    "&:hover": {
      bgcolor: aderidosColors.greenSoft,
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
    minHeight: 170,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 1.4,
    p: 3,
    borderRadius: {
      xs: 2,
      sm: 2.25,
    },
    bgcolor: aderidosColors.white,
    border: "2px solid rgba(6, 61, 49, 0.10)",
    boxShadow: "0 14px 34px rgba(2, 27, 22, 0.055)",
    overflow: "hidden",
    position: "relative",
    transition: `border-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, transform ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
    ...reduceMotionSx,

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

    "&:hover": {
      borderColor: "rgba(6,61,49,0.20)",
      boxShadow: "0 10px 28px rgba(2,27,22,0.10)",
      transform: "translateY(-2px)",
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
    bgcolor: aderidosColors.greenSoft,
    color: aderidosColors.greenDark,
    flexShrink: 0,
    position: "relative",
    zIndex: 1,
  },

  resumoIconBoxAlerta: {
    bgcolor: aderidosColors.warningSoft,
    color: aderidosColors.warningStrong,
  },

  resumoIconBoxOk: {
    bgcolor: "#EAF7EF",
    color: "#0B5136",
  },

  resumoCardLabel: {
    color: aderidosColors.greenAccent,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: {
      xs: "0.68rem",
      sm: "0.72rem",
    },
    lineHeight: 1.25,
  },

  resumoCardValor: {
    ...typographyScale.cardValue,
    color: aderidosColors.greenDark,
    letterSpacing: 0,
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
    color: aderidosColors.warningStrong,
    borderColor: "rgba(203, 166, 77, 0.55)",
    fontWeight: 800,
    textTransform: "none",
    borderRadius: 2,
    px: 1.8,
    py: 0.55,
    minHeight: 34,
    bgcolor: "rgba(255, 244, 216, 0.52)",
    ...focusVisibleSx,

    "&:hover": {
      borderColor: "#A88123",
      bgcolor: aderidosColors.warningSoft,
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
    bgcolor: aderidosColors.white,
    border: "1px solid rgba(2, 27, 22, 0.08)",
    boxShadow: "0 8px 22px rgba(2, 27, 22, 0.08)",
    color: "#0B2F24",
    ...focusVisibleSx,

    "&:hover": {
      bgcolor: "#F3F7F5",
    },
  },

  carrinhoFixoArea: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1200,
    maxHeight: "100dvh",
    px: {
      xs: 2,
      sm: 3,
    },
    pt: 2,
    pb: {
      xs: "calc(env(safe-area-inset-bottom) + 14px)",
      sm: 2.5,
    },
    bgcolor: aderidosColors.white,
    pointerEvents: "none",
  },

  carrinhoAnimado: {
    opacity: 1,
    transform: "translateY(0)",
    transition: `opacity ${aderidosMotion.duration.medium} ${aderidosMotion.easing.easeOut}, transform ${aderidosMotion.duration.medium} ${aderidosMotion.easing.easeOut}`,
    ...reduceMotionSx,
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
      xs: 2,
      sm: 2.25,
    },
    bgcolor: aderidosColors.white,
    border: "2px solid rgba(6,61,49,0.16)",
    boxShadow:
      "0 18px 40px rgba(2, 27, 22, 0.14), 0 2px 8px rgba(6, 61, 49, 0.08)",
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
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: aderidosColors.greenDark,
    color: aderidosColors.white,
    fontWeight: 950,
    fontSize: {
      xs: "1rem",
      sm: "1.08rem",
    },
    boxShadow: "0 8px 18px rgba(6, 61, 49, 0.20)",
  },

  carrinhoTextoArea: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  carrinhoFixoTitulo: {
    color: aderidosColors.textMuted,
    fontWeight: 800,
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
    color: aderidosColors.greenBlack,
    fontWeight: 950,
    letterSpacing: 0,
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
    borderRadius: 2,
    px: {
      xs: 1.7,
      sm: 2.6,
    },
    bgcolor: aderidosColors.greenDark,
    color: aderidosColors.white,
    fontWeight: 950,
    fontSize: {
      xs: "0.95rem",
      sm: "1rem",
    },
    textTransform: "none",
    boxShadow: "0 10px 22px rgba(6, 61, 49, 0.20)",
    transition: `transform ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, background-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
    ...focusVisibleSx,
    ...reduceMotionSx,

    "& .MuiButton-startIcon": {
      mr: {
        xs: 0.7,
        sm: 1,
      },
    },

    "&:hover": {
      bgcolor: aderidosColors.greenBlack,
      boxShadow: "0 14px 28px rgba(6, 61, 49, 0.28)",
      transform: "translateY(-1px)",
    },

    "&:active": {
      transform: "translateY(0)",
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
    borderRadius: 2.25,
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
    color: aderidosColors.greenBlack,
    lineHeight: 1.15,
  },

  vendaResumoDescricao: {
    color: aderidosColors.textMuted,
    fontSize: "0.9rem",
    mt: 0.25,
  },

  vendaResumoBotao: {
    borderRadius: 2,
    px: {
      xs: 2,
      sm: 3,
    },
    py: 1.1,
    fontWeight: 900,
    textTransform: "none",
    bgcolor: aderidosColors.greenDark,
    ...focusVisibleSx,

    "&:hover": {
      bgcolor: "#052F26",
    },
  },
};
