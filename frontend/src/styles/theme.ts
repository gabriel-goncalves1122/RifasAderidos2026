// src/styles/theme.ts
import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

export const theme = createTheme(
  {
    palette: {
      primary: {
        main: "#1e3a8a", // Azul escuro (Engenharia/Formatura)
      },
      secondary: {
        main: "#fbbf24", // Amarelo/Dourado (Detalhes)
      },
      background: {
        default: "#f3f4f6", // Cinza claro
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  ptBR,
);
