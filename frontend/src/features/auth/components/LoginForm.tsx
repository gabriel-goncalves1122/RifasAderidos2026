// ============================================================================
// ARQUIVO: frontend/src/features/auth/components/LoginForm.tsx
// ============================================================================
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { loginSchema, LoginFormData } from "../schemas/loginSchema";
import { authStyles } from "../styles/authStyles";

interface LoginFormProps {
  error?: string | null;
  showPassword: boolean;
  isUIBlocked: boolean;
  onSubmit: (data: LoginFormData) => Promise<void>;
  onTogglePassword: () => void;
  onOpenResetPassword: () => void;
}

export function LoginForm({
  error,
  showPassword,
  isUIBlocked,
  onSubmit,
  onTogglePassword,
  onOpenResetPassword,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: "100%" }}
    >
      <Stack spacing={2.25}>
        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 2,
              alignItems: "center",
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          required
          fullWidth
          id="email"
          label="E-mail"
          autoComplete="email"
          autoFocus
          disabled={isUIBlocked}
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message || " "}
        />

        <TextField
          required
          fullWidth
          id="password"
          label="Senha"
          autoComplete="current-password"
          type={showPassword ? "text" : "password"}
          disabled={isUIBlocked}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message || " "}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? "ocultar senha" : "mostrar senha"}
                  onClick={onTogglePassword}
                  edge="end"
                  disabled={isUIBlocked}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
          <Button
            type="button"
            variant="text"
            size="small"
            onClick={onOpenResetPassword}
            disabled={isUIBlocked}
            sx={authStyles.helperLink}
          >
            Esqueceu sua senha?
          </Button>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isUIBlocked}
          sx={authStyles.submitButton}
        >
          {isUIBlocked ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Acessar sistema"
          )}
        </Button>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Ainda não ativou sua conta?{" "}
          <Box component={RouterLink} to="/register" sx={authStyles.footerLink}>
            Registre-se aqui
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
}
