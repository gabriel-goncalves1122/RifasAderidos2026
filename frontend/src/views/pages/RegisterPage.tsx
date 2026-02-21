// ============================================================================
// ARQUIVO: frontend/src/views/pages/RegisterPage.tsx
// ============================================================================
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useAuthController } from "../../controllers/useAuthController";

// Máscara de CPF automática
const aplicarMascaraCPF = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const schema = yup
  .object({
    nome: yup.string().required("O nome completo é obrigatório"),
    email: yup
      .string()
      .email("E-mail com formato inválido")
      .required("O e-mail é obrigatório"),
    cpf: yup
      .string()
      .required("O CPF é obrigatório")
      .matches(
        /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
        "CPF incompleto (Ex: 111.222.333-44)",
      ),
    senha: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas não conferem")
      .required("Confirme a sua senha"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { handleRegister, error, loading } = useAuthController();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await handleRegister(data.nome, data.email, data.senha, data.cpf);
      navigate("/dashboard");
    } catch (err) {
      // O controller já lida com o estado de 'error' para mostrar no Alert
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <SchoolIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h5" component="h1" fontWeight="bold">
              Criar Conta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Comissão de Formatura 2026
            </Typography>
          </Box>

          <Alert
            severity="info"
            icon={<InfoOutlinedIcon />}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            <Typography variant="body2">
              Utilize o <strong>mesmo e-mail</strong> cadastrado na plataforma{" "}
              <strong>Keeper</strong> para sincronizarmos as suas rifas.
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome Completo"
              autoFocus
              disabled={loading}
              {...register("nome")}
              error={!!errors.nome}
              helperText={errors.nome?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail da Keeper"
              disabled={loading}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="cpf"
              label="CPF"
              placeholder="111.222.333-44"
              disabled={loading}
              {...register("cpf")}
              onChange={(e) =>
                setValue("cpf", aplicarMascaraCPF(e.target.value), {
                  shouldValidate: true,
                })
              }
              error={!!errors.cpf}
              helperText={errors.cpf?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Criar Senha"
              type="password"
              id="senha"
              disabled={loading}
              {...register("senha")}
              error={!!errors.senha}
              helperText={errors.senha?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirmar Senha"
              type="password"
              id="confirmarSenha"
              disabled={loading}
              {...register("confirmarSenha")}
              error={!!errors.confirmarSenha}
              helperText={errors.confirmarSenha?.message}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cadastrar e Acessar"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Já tem conta?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Faça login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
