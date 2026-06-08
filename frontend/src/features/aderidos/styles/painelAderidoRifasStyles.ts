import { SxProps, Theme } from "@mui/material";

export const painelAderidoRifasStyles: Record<string, SxProps<Theme>> = {
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
    letterSpacing: 0,
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
    borderRadius: 2,
    bgcolor: "#FFFFFF",
    border: "1px solid rgba(6, 61, 49, 0.14)",
    color: "#063D31",
    fontWeight: 850,
    whiteSpace: "nowrap",
    boxShadow: "0 4px 10px rgba(2, 27, 22, 0.035)",

    "& .MuiChip-label": {
      px: 1.55,
    },

    "&:hover": {
      bgcolor: "#EAF3EF",
      borderColor: "rgba(6, 61, 49, 0.24)",
    },
  },

  filtroChipAtivo: {
    bgcolor: "#063D31",
    color: "#FFFFFF",
    borderColor: "#063D31",
    boxShadow: "0 8px 16px rgba(6, 61, 49, 0.16)",

    "&:hover": {
      bgcolor: "#021B16",
      borderColor: "#021B16",
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
    borderRadius: 2,
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
