// ============================================================================
// ARQUIVO: frontend/src/views/pages/RegisterPage.tsx
// ============================================================================
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useAuthController } from "../../controllers/useAuthController";
import { authStyles } from "./styles/authStyles";

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
      .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, "CPF incompleto"),
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = async (data: FormData) => {
    try {
      await handleRegister(data.nome, data.email, data.senha, data.cpf);
      navigate("/dashboard");
    } catch (err) {}
  };

  return (
    <Box component="main" sx={authStyles.mainContainer}>
      {/* COLUNA ESQUERDA: O Formulário */}
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
            Criar Conta
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, textAlign: "center" }}
          >
            Registe-se para consultar as suas rifas e prêmios.
          </Typography>

          <Alert
            severity="info"
            icon={<InfoOutlinedIcon />}
            sx={{
              mb: 4,
              borderRadius: 2,
              bgcolor: "rgba(212, 175, 55, 0.1)",
              color: "primary.main",
              border: "1px solid #D4AF37",
            }}
          >
            <Typography variant="body2">
              Utilize o <strong>mesmo e-mail</strong> cadastrado na plataforma{" "}
              <strong>Keeper</strong> para sincronizarmos os seus dados.
            </Typography>
          </Alert>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ width: "100%" }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <TextField
              margin="dense"
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
              margin="dense"
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
              margin="dense"
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

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField
                margin="dense"
                required
                fullWidth
                label="Criar Senha"
                type={showPassword ? "text" : "password"}
                id="senha"
                disabled={loading}
                {...register("senha")}
                error={!!errors.senha}
                helperText={errors.senha?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="dense"
                required
                fullWidth
                label="Confirmar Senha"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmarSenha"
                disabled={loading}
                {...register("confirmarSenha")}
                error={!!errors.confirmarSenha}
                helperText={errors.confirmarSenha?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={loading}
              sx={{ mt: 4, mb: 3, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cadastrar e Acessar"
              )}
            </Button>

            <Box sx={{ textAlign: "center", pb: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Já tem conta?{" "}
                <Link
                  to="/"
                  style={{
                    color: "var(--cor-verde-fundo)",
                    textDecoration: "underline",
                    fontWeight: "bold",
                  }}
                >
                  Voltar para o Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* COLUNA DIREITA: Imagem da Logo Dourada */}
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
    </Box>
  );
}
