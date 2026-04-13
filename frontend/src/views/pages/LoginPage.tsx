// ============================================================================
// ARQUIVO: frontend/src/views/pages/LoginPage.tsx
// ============================================================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuthController } from "../../controllers/useAuthController";
import { authStyles } from "./styles/authStyles";
import { ResetPasswordModal } from "../components/loginRegister/ResetPasswordModal";

const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("Senha é obrigatória"),
  })
  .required();

type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  const { handleLogin, handlePasswordReset, error, loading } =
    useAuthController();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // Controla o nosso próprio estado de carregamento do formulário para não depender só do global
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados para o Modal de Recuperação de Senha
  const [openResetModal, setOpenResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [loadingReset, setLoadingReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const sucesso = await handleLogin(data.email, data.password);
    if (sucesso) {
      navigate("/dashboard");
    } else {
      setIsSubmitting(false); // Liberta o botão se falhar (Resolve o carregamento infinito)
    }
  };

  const onResetPassword = async () => {
    if (!resetEmail) return;
    setLoadingReset(true);
    setResetError(null);

    const sucesso = await handlePasswordReset(resetEmail);
    setLoadingReset(false);

    if (sucesso) {
      setResetSuccess(true);
      setTimeout(() => {
        setOpenResetModal(false);
        setResetSuccess(false);
        setResetEmail("");
      }, 3500); // Mais fluido
    } else {
      setResetError("Ocorreu um erro ao enviar. Verifique o seu e-mail.");
    }
  };

  const isUIBlocked = loading || isSubmitting;

  return (
    <Box component="main" sx={authStyles.mainContainer}>
      <Box sx={authStyles.logoContainer}>
        <Box sx={authStyles.logoWrapper}>
          <img
            src="/images/PNG (1080x1080).png"
            alt="Logo da Comissão"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
        <Typography variant="body2" sx={authStyles.footerText}>
          Portal do Aderido &copy; 2026
        </Typography>
      </Box>

      <Box component={Paper} elevation={6} square sx={authStyles.formContainer}>
        <Box sx={authStyles.formWrapper}>
          <Box sx={authStyles.mobileLogo}>
            <img
              src="/images/Branco (1080 x 1080).png"
              alt="Logo"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>

          <Typography
            component="h1"
            variant="h4"
            sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
          >
            Bem-vindo(a)
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Acesso à plataforma da Comissão
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            {error && !isSubmitting && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
              disabled={isUIBlocked}
            />

            <TextField
              label="Senha *"
              variant="outlined"
              fullWidth
              margin="normal"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isUIBlocked}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="alternar visibilidade da senha"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Link
                component="button"
                type="button" // <--- ISTO IMPEDE O COMPORTAMENTO DO ENTER
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenResetModal(true);
                }}
                disabled={isUIBlocked}
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "primary.main",
                  },
                }}
              >
                Esqueceu a sua senha?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isUIBlocked}
              sx={{ mt: 3, mb: 3, py: 1.5, fontSize: "1.1rem" }}
            >
              {isUIBlocked ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Acessar Sistema"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Ainda não ativou a sua conta?{" "}
                <RouterLink
                  to="/register"
                  style={{
                    color: "var(--cor-dourado-escuro)",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Registe-se aqui
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* COMPONENTE MODULARIZADO */}
      <ResetPasswordModal
        open={openResetModal}
        onClose={() => {
          if (!loadingReset) setOpenResetModal(false);
        }}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        onResetPassword={onResetPassword}
        loadingReset={loadingReset}
        resetSuccess={resetSuccess}
        resetError={resetError}
      />
    </Box>
  );
}
