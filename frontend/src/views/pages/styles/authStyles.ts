// ============================================================================
// ARQUIVO: frontend/src/views/pages/styles/authStyles.ts
// ============================================================================
import { SxProps, Theme } from "@mui/material/styles";

export const authStyles = {
  mainContainer: {
    display: "flex",
    minHeight: "100vh",
    bgcolor: "background.default",
    flexDirection: { xs: "column", sm: "row" }, // Empilha no celular, lado a lado no PC
  } as SxProps<Theme>,

  logoContainer: {
    width: { xs: "0%", sm: "40%", md: "50%" }, // Ocupa metade da tela no PC
    display: { xs: "none", sm: "flex" },
    backgroundColor: "primary.main",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  } as SxProps<Theme>,

  logoWrapper: {
    maxWidth: "400px",
    width: "80%",
    p: 4,
    opacity: 0.9,
  } as SxProps<Theme>,

  formContainer: {
    width: { xs: "100%", sm: "60%", md: "50%" }, // Ocupa a outra metade
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    py: { xs: 4, md: 0 },
    height: "100vh",
    overflowY: "auto", // Adiciona barra de rolagem se a tela for muito pequena
  } as SxProps<Theme>,

  formWrapper: {
    mx: { xs: 4, md: 8 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
  } as SxProps<Theme>,

  mobileLogo: {
    display: { xs: "flex", sm: "none" },
    justifyContent: "center",
    mb: 3,
    width: "120px",
  } as SxProps<Theme>,

  footerText: {
    position: "absolute",
    bottom: 16,
    color: "rgba(255,255,255,0.6)",
  } as SxProps<Theme>,
};
