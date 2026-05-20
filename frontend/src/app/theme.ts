// ============================================================================
// ARQUIVO: frontend/src/app/theme.ts
// ============================================================================
import { createTheme } from "@mui/material/styles";

// Paleta central do sistema.
// Mantém o visual institucional em verde escuro, branco e preto suave.
export const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#0B2F24",
      light: "#17483A",
      dark: "#061C15",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#1F3D34",
      light: "#2F5A4D",
      dark: "#10241E",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F6F8F7",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#081411",
      secondary: "#5D6A66",
      disabled: "#9AA3A0",
    },

    divider: "rgba(8, 20, 17, 0.10)",

    success: {
      main: "#1F6B4A",
      light: "#DDEDE5",
      dark: "#12412D",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#9A7A2F",
      light: "#F4ECD6",
      dark: "#5F4817",
      contrastText: "#081411",
    },

    error: {
      main: "#8F2F2F",
      light: "#F2DADA",
      dark: "#5D1D1D",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#315A66",
      light: "#DCE9EC",
      dark: "#203D45",
      contrastText: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),

    h4: {
      fontWeight: 800,
      letterSpacing: "-0.03em",
    },

    h5: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 14,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F6F8F7",
          color: "#081411",
        },

        ":root": {
          "--cor-verde-principal": "#0B2F24",
          "--cor-verde-escuro": "#061C15",
          "--cor-verde-medio": "#17483A",
          "--cor-branco": "#FFFFFF",
          "--cor-preto-suave": "#081411",
          "--cor-cinza-fundo": "#F6F8F7",
          "--cor-cinza-texto": "#5D6A66",
          "--cor-dourado-discreto": "#9A7A2F",
          "--cor-dourado-escuro": "#7A6022",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
        },

        containedPrimary: {
          backgroundColor: "#0B2F24",
          "&:hover": {
            backgroundColor: "#061C15",
            boxShadow: "0 10px 24px rgba(11, 47, 36, 0.22)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            backgroundColor: "#FFFFFF",

            "& fieldset": {
              borderColor: "rgba(8, 20, 17, 0.18)",
            },

            "&:hover fieldset": {
              borderColor: "#17483A",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#0B2F24",
              borderWidth: 2,
            },
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});
