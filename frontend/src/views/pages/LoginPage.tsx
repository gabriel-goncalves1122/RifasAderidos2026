import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthController } from "../../controllers/useAuthController"; // Reaproveitamos a lógica de auth
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

// 1. Esquema de Validação (Yup)
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

// 2. Tipagem inferida do schema
type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  const { handleLogin, error, loading } = useAuthController();

  // 3. Setup do React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Função intermediária para conectar o Form com o Controller
  const onSubmit = (data: LoginFormData) => {
    handleLogin(data.email, data.password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{ m: 1, bgcolor: "primary.main", p: 1, borderRadius: "50%" }}
          >
            <SchoolIcon sx={{ color: "white", fontSize: 40 }} />
          </Box>

          <Typography
            component="h1"
            variant="h5"
            sx={{ mt: 2, fontWeight: "bold", color: "primary.main" }}
          >
            Comissão de Formatura
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Acesso Restrito
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            {/* Mensagem de Erro do Firebase */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              autoComplete="email"
              autoFocus
              // Conexão com React Hook Form:
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Acessar Sistema"
              )}
            </Button>
          </Box>
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
          Engenharia de Computação &copy; 2026 - UNIFEI
        </Typography>
      </Box>
    </Container>
  );
}
