// ============================================================================
// ARQUIVO: LoginPage.tsx (Interface de Autenticação)
// ============================================================================
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuthController } from "../../controllers/useAuthController";
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

import { useNavigate, Link } from "react-router-dom"; // <-- Atualizado: Trazendo o useNavigate

// ----------------------------------------------------------------------------
// 1. ESQUEMA DE VALIDAÇÃO (Regras de Negócio)
// ----------------------------------------------------------------------------
// O Yup funciona como um "filtro de qualidade". Ele não deixa requisições lixo
// baterem no servidor. Se o e-mail não tiver '@', ele já barra no próprio navegador.
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

// Extraímos a tipagem do schema para que o TypeScript saiba exatamente o que é 'LoginFormData'
type LoginFormData = yup.InferType<typeof loginSchema>;

export function LoginPage() {
  // --------------------------------------------------------------------------
  // 2. ESTADOS E CONTROLADORES
  // --------------------------------------------------------------------------
  // Puxamos a lógica do Firebase (Separation of Concerns). A tela não sabe COMO logar,
  // ela só pede pro Controller fazer isso.
  const { handleLogin, error, loading } = useAuthController();
  const navigate = useNavigate();

  // "Grampeamos" os inputs usando o React Hook Form. Isso aumenta absurdamente
  // a performance da tela porque ela não "pisca" (re-renderiza) a cada letra digitada.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // --------------------------------------------------------------------------
  // 3. AÇÕES (Handlers)
  // --------------------------------------------------------------------------
  // Esta função SÓ é executada se o formulário passar 100% nas regras do Yup acima.
  // <-- ATUALIZADO: Agora a função é assíncrona (async) e aguarda a resposta
  const onSubmit = async (data: LoginFormData) => {
    const sucesso = await handleLogin(data.email, data.password);

    if (sucesso) {
      navigate("/dashboard"); // <-- A MÁGICA ACONTECE AQUI!
    }
  };
  // --------------------------------------------------------------------------
  // 4. INTERFACE (JSX / UI)
  // --------------------------------------------------------------------------
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
          {/* Cabeçalho Visual */}
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

          {/* O Formulário */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            {/* Banner de Erro Dinâmico (Vem lá do Firebase via Controller) */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Inputs: O '{...register("campo")}' é o que liga o campo visual ao React Hook Form */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message} // Renderiza o texto do erro do Yup abaixo do campo
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

            {/* O loading bloqueia o botão para o usuário não clicar 5 vezes e sobrecarregar o banco */}
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

            {/* <-- NOVO: ROTA DE FUGA PARA QUEM NÃO TEM CONTA --> */}
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Ainda não acessou suas rifas?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Crie sua conta
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
          Engenharia de Computação &copy; 2026 - UNIFEI
        </Typography>
      </Box>
    </Container>
  );
}
