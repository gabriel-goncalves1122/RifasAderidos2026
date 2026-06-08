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

export const painelAderidoComponentStyles: Record<string, SxProps<Theme>> = {
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
    ...typographyScale.pageTitle,
    color: aderidosColors.greenBlack,
    letterSpacing: 0,
  },

  blocoVendasDescricao: {
    ...typographyScale.bodyBase,
    color: "#536962",
    maxWidth: 520,
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
    scrollSnapType: "x mandatory",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },

  filtroChip: {
    height: 44,
    px: 0.8,
    borderRadius: 2,
    bgcolor: aderidosColors.white,
    border: "1.5px solid rgba(6, 61, 49, 0.14)",
    color: aderidosColors.greenDark,
    fontWeight: 800,
    fontSize: "0.95rem",
    whiteSpace: "nowrap",
    scrollSnapAlign: "start",
    boxShadow: "0 4px 10px rgba(2, 27, 22, 0.035)",
    transition: `background-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, border-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
    ...focusVisibleSx,
    ...reduceMotionSx,

    "& .MuiChip-label": {
      px: 1.55,
    },

    "&:hover": {
      bgcolor: aderidosColors.greenSoft,
      borderColor: "rgba(6, 61, 49, 0.24)",
    },
  },

  filtroChipAtivo: {
    bgcolor: aderidosColors.greenDark,
    color: aderidosColors.white,
    borderColor: aderidosColors.greenDark,
    boxShadow: "0 8px 16px rgba(6, 61, 49, 0.16)",

    "&:hover": {
      bgcolor: aderidosColors.greenBlack,
      borderColor: aderidosColors.greenBlack,
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
      background: "rgba(6, 61, 49, 0.24)",
      borderRadius: 999,
    },
  },

  gridRifas: {
    display: "grid",
    gridTemplateColumns: {
      xs: "repeat(3, minmax(76px, 1fr))",
      sm: "repeat(auto-fill, minmax(86px, 1fr))",
      md: "repeat(auto-fill, minmax(92px, 1fr))",
    },
    gap: 1.5,
  },

  rifaButton: {
    minHeight: {
      xs: 56,
      sm: 56,
    },
    width: "100%",
    borderRadius: 2,
    px: {
      xs: 1,
      sm: 1.25,
    },
    border: "2px solid",
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
    transition: `transform 140ms ${aderidosMotion.easing.easeOut}, box-shadow 140ms ${aderidosMotion.easing.easeOut}, background-color 140ms ${aderidosMotion.easing.easeOut}, border-color 140ms ${aderidosMotion.easing.easeOut}`,
    ...focusVisibleSx,
    ...reduceMotionSx,

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

  legendaChip: {
    height: 28,
    borderRadius: 2,
    fontWeight: 800,
    fontSize: "0.78rem",

    "& .MuiChip-label": {
      px: 1.1,
    },
  },
};
