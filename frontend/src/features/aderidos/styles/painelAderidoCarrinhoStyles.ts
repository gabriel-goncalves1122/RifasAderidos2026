import { SxProps, Theme } from "@mui/material";

export const painelAderidoCarrinhoStyles: Record<string, SxProps<Theme>> = {
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
      xs: 2,
      sm: 2.25,
    },
    bgcolor: "rgba(255, 255, 255, 0.96)",
    border: "1px solid rgba(6, 61, 49, 0.16)",
    boxShadow:
      "0 18px 40px rgba(2, 27, 22, 0.14), 0 2px 8px rgba(6, 61, 49, 0.08)",
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
    borderRadius: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#063D31",
    color: "#FFFFFF",
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
    color: "#526760",
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
    color: "#021B16",
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
    bgcolor: "#063D31",
    color: "#FFFFFF",
    fontWeight: 950,
    fontSize: {
      xs: "0.95rem",
      sm: "1rem",
    },
    textTransform: "none",
    boxShadow: "0 10px 22px rgba(6, 61, 49, 0.20)",

    "& .MuiButton-startIcon": {
      mr: {
        xs: 0.7,
        sm: 1,
      },
    },

    "&:hover": {
      bgcolor: "#021B16",
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
    color: "#021B16",
    lineHeight: 1.15,
  },

  vendaResumoDescricao: {
    color: "#526760",
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
    bgcolor: "#063D31",

    "&:hover": {
      bgcolor: "#052F26",
    },
  },
};
