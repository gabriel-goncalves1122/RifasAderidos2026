// ============================================================================
// ARQUIVO: frontend/src/features/auth/styles/authStyles.ts
// ============================================================================
import { SxProps, Theme } from "@mui/material";

export const authStyles: Record<string, SxProps<Theme>> = {
  mainContainer: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      md: "minmax(380px, 42%) minmax(420px, 58%)",
    },
    bgcolor: "background.default",
  },

  brandPanel: {
    display: {
      xs: "none",
      md: "flex",
    },
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    px: {
      md: 5,
      lg: 7,
    },
    color: "common.white",

    // Gradiente menos vibrante, puxando para verde institucional.
    background:
      "linear-gradient(145deg, #061C15 0%, #0B2F24 52%, #123A2E 100%)",

    position: "relative",
    overflow: "hidden",

    // Textura visual discreta, sem cores chamativas.
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.08) 0%, transparent 34%), radial-gradient(circle at 75% 80%, rgba(255,255,255,0.06) 0%, transparent 32%)",
      pointerEvents: "none",
    },
  },

  logoImage: {
    width: {
      md: 250,
      lg: 300,
    },
    maxWidth: "72%",
    height: "auto",
    objectFit: "contain",
    filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.32))",
    position: "relative",
    zIndex: 1,
  },

  brandDescription: {
    maxWidth: 360,
    mt: 1.25,
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.65,
    fontSize: "0.95rem",
    position: "relative",
    zIndex: 1,
  },

  brandFooter: {
    display: "none",
  },

  formPanel: {
    minHeight: {
      xs: "100vh",
      md: "auto",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: {
      xs: 2,
      sm: 4,
      md: 7,
    },
    py: {
      xs: 3,
      sm: 5,
      md: 7,
    },
    bgcolor: {
      xs: "background.default",
      md: "#FFFFFF",
    },
  },

  formCard: {
    width: "100%",
    maxWidth: {
      xs: 460,
      md: 480,
    },
    p: {
      xs: 3,
      sm: 4,
      md: 4.5,
    },
    borderRadius: {
      xs: 4,
      md: 5,
    },

    // No desktop o painel direito já é limpo; no mobile o card precisa se destacar.
    boxShadow: {
      xs: "0 18px 44px rgba(8, 20, 17, 0.10)",
      md: "none",
    },
    border: {
      xs: "1px solid rgba(8, 20, 17, 0.08)",
      md: "none",
    },
    bgcolor: "background.paper",
  },

  mobileLogo: {
    display: {
      xs: "flex",
      md: "none",
    },
    justifyContent: "center",
    mb: 3,
  },

  mobileLogoImage: {
    width: 96,
    height: 96,
    objectFit: "contain",
    p: 1.25,
    borderRadius: "50%",
    bgcolor: "primary.main",
    boxShadow: "0 14px 30px rgba(11, 47, 36, 0.22)",
  },

  title: {
    fontWeight: 850,
    color: "text.primary",
    mb: 1,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    mb: 4,
    maxWidth: 390,
    color: "text.secondary",
    lineHeight: 1.65,
  },

  submitButton: {
    mt: 2.5,
    mb: 2.5,
    py: 1.45,
    borderRadius: 2,
    fontSize: "1rem",
    fontWeight: 800,
    textTransform: "none",
    bgcolor: "primary.main",
    color: "primary.contrastText",
    boxShadow: "0 12px 28px rgba(11, 47, 36, 0.18)",

    "&:hover": {
      bgcolor: "primary.dark",
      boxShadow: "0 14px 32px rgba(11, 47, 36, 0.24)",
    },

    "&.Mui-disabled": {
      bgcolor: "rgba(8, 20, 17, 0.18)",
      color: "rgba(8, 20, 17, 0.45)",
      boxShadow: "none",
    },
  },

  helperLink: {
    textTransform: "none",
    color: "text.secondary",
    fontWeight: 700,
    px: 0,
    minWidth: "auto",

    "&:hover": {
      bgcolor: "transparent",
      color: "primary.main",
      textDecoration: "underline",
    },
  },

  footerLink: {
    color: "primary.main",
    textDecoration: "none",
    fontWeight: 800,

    "&:hover": {
      color: "primary.dark",
      textDecoration: "underline",
    },
  },

  infoAlert: {
    borderRadius: 2,
    border: "1px solid rgba(11, 47, 36, 0.16)",
    bgcolor: "rgba(11, 47, 36, 0.045)",
    color: "text.primary",

    "& .MuiAlert-icon": {
      color: "primary.main",
    },
  },
};
