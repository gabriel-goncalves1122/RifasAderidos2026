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

// Validação dupla com Yup (Garante que o usuário não digite a senha errada)
const schema = yup
  .object({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    senha: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("Senha é obrigatória"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas não conferem")
      .required("Confirme sua senha"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { handleRegister, error, loading } = useAuthController();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await handleRegister(data.email, data.senha);
      // Se deu sucesso, o Firebase já logou ele automaticamente.
      // Mandamos direto pro Dashboard para ver as rifas!
      navigate("/dashboard");
    } catch (err) {
      // O erro já foi tratado no controller e vai aparecer no Alert
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
              Comissão de Formatura Turma 2022
            </Typography>
          </Box>

          {/* O AVISO DE OURO SOBRE A KEEPER */}
          <Alert
            severity="info"
            icon={<InfoOutlinedIcon />}
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Atenção, Formando!
            </Typography>
            <Typography variant="body2">
              Para acessar suas rifas, você <strong>DEVE</strong> utilizar
              exatamente o mesmo e-mail que utilizou para o cadastro e pagamento
              na plataforma <strong>Keeper</strong>.
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
              id="email"
              label="E-mail da Keeper"
              autoComplete="email"
              autoFocus
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Criar Senha"
              type="password"
              id="senha"
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
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cadastrar e Ver Rifas"
              )}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Já possui conta?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#1976d2",
                    textDecoration: "none",
                    fontWeight: "bold",
                  }}
                >
                  Faça login aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
