// ============================================================================
// ARQUIVO: frontend/src/features/auth/pages/LoginPage.tsx
// ============================================================================
import { Box, Paper, Typography } from "@mui/material";

import { AuthBrandPanel } from "../components/AuthBrandPanel";
import { LoginForm } from "../components/LoginForm";
import { ResetPasswordModal } from "../components/ResetPasswordModal";
import { useLoginPage } from "../hooks/useLoginPage";
import { authStyles } from "../styles/authStyles";

export function LoginPage() {
  const {
    error,
    showPassword,
    isUIBlocked,

    openResetModal,
    resetEmail,
    resetSuccess,
    resetError,
    loadingReset,

    setResetEmail,
    alternarVisibilidadeSenha,
    abrirModalReset,
    fecharModalReset,
    onSubmit,
    onResetPassword,
  } = useLoginPage();

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
            Bem-vindo(a)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={authStyles.subtitle}
          >
            Acesse a plataforma oficial da Comissão 2026.
          </Typography>

          <LoginForm
            error={error}
            showPassword={showPassword}
            isUIBlocked={isUIBlocked}
            onSubmit={onSubmit}
            onTogglePassword={alternarVisibilidadeSenha}
            onOpenResetPassword={abrirModalReset}
          />
        </Paper>
      </Box>

      <ResetPasswordModal
        open={openResetModal}
        resetEmail={resetEmail}
        loadingReset={loadingReset}
        resetSuccess={resetSuccess}
        resetError={resetError}
        setResetEmail={setResetEmail}
        onClose={fecharModalReset}
        onResetPassword={onResetPassword}
      />
    </Box>
  );
}
