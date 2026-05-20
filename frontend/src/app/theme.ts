import { createTheme } from "@mui/material/styles";

// Cores exatas extraídas da sua identidade visual
const verdeEscuro = "#0B1B15";
const verdeMedio = "#143026";
const douradoPrincipal = "#D4AF37"; // Dourado da engrenagem
const douradoHover = "#F3E5AB"; // Dourado mais claro para quando passar o rato

export const theme = createTheme({
  typography: {
    fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      fontWeight: 600, // Botões com texto mais gordinho
      textTransform: "none", // Impede que todos os botões fiquem EM MAIÚSCULAS
    },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  palette: {
    primary: {
      main: verdeEscuro,
      light: verdeMedio,
      contrastText: "#ffffff",
    },
    secondary: {
      main: douradoPrincipal,
      light: douradoHover,
      contrastText: verdeEscuro, // Texto escuro sobre botão dourado fica incrível
    },
    background: {
      default: "#f5f7fa", // Um cinzento muito clarinho para o fundo do app
      paper: "#ffffff", // Cards e menus brancos para dar contraste
    },
  },
  shape: {
    borderRadius: 12, // Arredonda os cantos de todos os cards e botões para um visual moderno
  },
  components: {
    // Customização automática de todos os Botões do app
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 24px",
        },
        containedPrimary: {
          background: `linear-gradient(45deg, ${verdeEscuro} 30%, ${verdeMedio} 90%)`,
        },
        containedSecondary: {
          background: `linear-gradient(45deg, #AA8222 30%, ${douradoPrincipal} 90%)`,
          color: "#fff",
        },
      },
    },
    // Customização das Abas (Tabs)
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          "&.Mui-selected": {
            color: douradoPrincipal, // A aba ativa fica dourada
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: douradoPrincipal, // O risquinho debaixo da aba fica dourado
        },
      },
    },
  },
});
