// ============================================================================
// ARQUIVO: frontend/src/views/components/CheckoutModal.tsx
// ============================================================================
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Chip,
  CircularProgress,
  Fade,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useRifasController } from "../../controllers/useRifasController";

// --------------------------------------------------------------------------
// MÁSCARA & VALIDAÇÃO (YUP)
// --------------------------------------------------------------------------
const aplicarMascaraTelefone = (valor: string) => {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2")
    .slice(0, 15);
};

// Usando .test() ao invés de .transform() para não confundir os tipos do TypeScript
const schema = yup
  .object({
    nome: yup.string().required("O nome completo é obrigatório"),
    telefone: yup
      .string()
      .required("O WhatsApp é obrigatório")
      .min(14, "Telefone incompleto (Ex: (35) 99999-9999)"),
    email: yup
      .string()
      .optional()
      .test(
        "is-valid-email",
        "Formato de e-mail inválido",
        (value) =>
          !value ||
          value.trim() === "" ||
          yup.string().email().isValidSync(value),
      ),
    comprovante: yup
      .mixed<File>()
      .required("Você precisa anexar o comprovante do PIX"),
  })
  .required();

// Criamos uma interface explícita para o TypeScript parar de brigar
export interface CheckoutFormData {
  nome: string;
  telefone: string;
  email?: string;
  comprovante: File;
}

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numerosRifas: string[];
}

export function CheckoutModal({
  open,
  onClose,
  onSuccess,
  numerosRifas,
}: CheckoutModalProps) {
  // Estados de UI/UX (Animações e Notificações)
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { finalizarVenda, loading } = useRifasController();

  // Configuração do React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema) as any, // O "as any" manda o TS ignorar conflitos internos da biblioteca
    mode: "onChange",
  });

  // Observa o arquivo anexado para mudar o visual do botão
  const comprovanteAnexado = watch("comprovante");

  // ... O RESTANTE DO CÓDIGO CONTINUA IGUAL DAQUI PARA BAIXO (useEffect, handleCopiarPix, onSubmit, etc.)

  // GATILHO DE LIMPEZA: Reseta o formulário e a tela de sucesso ao fechar o modal
  useEffect(() => {
    if (!open) {
      reset(); // Limpa todos os dados do React Hook Form de uma vez
      setShowSuccess(false);
    }
  }, [open, reset]);

  const chavePixComissao = "comissao.engenharia@unifei.edu.br";
  const PRECO_RIFA = 10.0;
  const valorTotal = numerosRifas.length * PRECO_RIFA;
  const valorFormatado = valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixComissao);
    setSnackbarOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      // Injeta o arquivo dentro do Hook Form e manda ele validar se o erro sumiu
      setValue("comprovante", event.target.files[0], { shouldValidate: true });
    }
  };

  // Função disparada apenas se o formulário passar por todas as regras do Yup
  const onSubmit = async (data: CheckoutFormData) => {
    const sucesso = await finalizarVenda({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email || "",
      numerosRifas,
      comprovante: data.comprovante,
    });

    if (sucesso) {
      setShowSuccess(true);
      setTimeout(() => onSuccess(), 3000);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={loading || showSuccess ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        {showSuccess ? (
          <Fade in={showSuccess}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                px: 4,
                textAlign: "center",
              }}
            >
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: 100, mb: 2 }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="text.primary"
              >
                Venda Confirmada!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                O comprovante foi enviado para análise da tesouraria.
                <br />
                Esta janela fechará automaticamente...
              </Typography>
              <CircularProgress size={30} color="success" />
            </Box>
          </Fade>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <DialogTitle
              sx={{ m: 0, p: 2, backgroundColor: "#1976d2", color: "white" }}
            >
              Finalizar Venda ({numerosRifas.length} selecionadas)
              <IconButton
                aria-label="close"
                onClick={onClose}
                disabled={loading}
                sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Números selecionados:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {numerosRifas.map((numero) => (
                    <Chip
                      key={numero}
                      label={numero}
                      color="primary"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                1. Dados do Comprador
              </Typography>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                <TextField
                  label="Nome Completo *"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={loading}
                  {...register("nome")}
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                />
                <TextField
                  label="WhatsApp (com DDD) *"
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={loading}
                  placeholder="(35) 99999-9999"
                  {...register("telefone")}
                  onChange={(e) =>
                    setValue(
                      "telefone",
                      aplicarMascaraTelefone(e.target.value),
                      { shouldValidate: true },
                    )
                  }
                  error={!!errors.telefone}
                  helperText={errors.telefone?.message}
                />
                <TextField
                  label="E-mail (Opcional)"
                  variant="outlined"
                  size="small"
                  type="email"
                  fullWidth
                  disabled={loading}
                  {...register("email")}
                  error={!!errors.email}
                  helperText={
                    errors.email?.message ||
                    "Enviaremos o recibo para este e-mail."
                  }
                />
              </Box>
              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                2. Pagamento PIX ({valorFormatado})
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f5f5f5",
                  textAlign: "center",
                }}
              >
                <QrCode2Icon sx={{ fontSize: 60, color: "#333", mb: 1 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Transfira <strong>{valorFormatado}</strong> para a chave
                  abaixo:
                </Typography>
                <TextField
                  value={chavePixComissao}
                  disabled
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleCopiarPix}
                          edge="end"
                          color="primary"
                          disabled={loading}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>
              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary"
              >
                3. Enviar Comprovante
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Button
                  component="label"
                  variant={comprovanteAnexado ? "outlined" : "contained"}
                  color={comprovanteAnexado ? "success" : "primary"}
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  disabled={loading}
                >
                  {comprovanteAnexado
                    ? "Trocar Comprovante"
                    : "Anexar Imagem ou PDF"}
                  <input
                    type="file"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {comprovanteAnexado && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    ✓ Ficheiro pronto: {comprovanteAnexado.name}
                  </Typography>
                )}
                {/* Exibe o erro do Yup caso ele tente enviar sem a foto */}
                {errors.comprovante && (
                  <Typography variant="caption" color="error">
                    {errors.comprovante.message}
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
              <Button onClick={onClose} color="inherit" disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={loading}
                sx={{ minWidth: 160 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirmar Venda"
                )}
              </Button>
            </DialogActions>
          </Box>
        )}
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          Chave PIX copiada com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
}
