// ============================================================================
// ARQUIVO: frontend/src/features/auth/pages/RegisterPage.tsx
// ============================================================================
import { Box, Paper, Typography } from "@mui/material";

import { AuthBrandPanel } from "../components/AuthBrandPanel";
import { RegisterForm } from "../components/RegisterForm";
import { useRegisterPage } from "../hooks/useRegisterPage";
import { authStyles } from "../styles/authStyles";

export function RegisterPage() {
  const {
    error,
    isUIBlocked,
    showPassword,
    showConfirmPassword,
    alternarSenha,
    alternarConfirmacaoSenha,
    onSubmit,
  } = useRegisterPage();

  return (
    <Box component="main" sx={authStyles.mainContainer}>
      <AuthBrandPanel />

      <Box component="section" sx={authStyles.formPanel}>
        <Paper component="section" elevation={0} sx={authStyles.formCard}>
          <Box sx={authStyles.mobileLogo}>
            <Box
              component="img"
              src="/images/Branco (1080 x 1080).png"
              alt="Logo da Comissão"
              sx={authStyles.mobileLogoImage}
            />
          </Box>

          <Typography component="h1" variant="h4" sx={authStyles.title}>
            Criar conta
          </Typography>

          {/* <Typography
            variant="body1"
            color="text.secondary"
            sx={authStyles.subtitle}
          >
            Ative seu acesso para consultar rifas, prêmios e pagamentos.
          </Typography> */}

          <RegisterForm
            error={error}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            isUIBlocked={isUIBlocked}
            onSubmit={onSubmit}
            onTogglePassword={alternarSenha}
            onToggleConfirmPassword={alternarConfirmacaoSenha}
          />
        </Paper>
      </Box>
    </Box>
  );
}
