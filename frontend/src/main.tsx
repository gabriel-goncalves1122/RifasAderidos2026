import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

// 1. Importar o nosso novo CSS Global
import "./assets/styles/global.css";

// 2. Importar o Tema e o Provider do Material UI
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./styles/theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. Embrulhar o App com o Tema */}
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* O CssBaseline ajuda a limpar margens indesejadas */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
