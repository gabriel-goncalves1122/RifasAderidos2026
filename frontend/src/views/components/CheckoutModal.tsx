// ============================================================================
// ARQUIVO: frontend/src/views/components/CheckoutModal.tsx
// RESPONSABILIDADE: Modal de Finalização de Venda com PIX (QR Code e Chave)
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { finalizarVenda, loading } = useRifasController();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const comprovanteAnexado = watch("comprovante");

  useEffect(() => {
    if (!open) {
      reset();
      setShowSuccess(false);
    }
  }, [open, reset]);

  // DADOS DA CONTA PIX
  const chavePixComissao = "comissao0026@gmail.com";
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
      setValue("comprovante", event.target.files[0], { shouldValidate: true });
    }
  };

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
                color="secondary"
                sx={{ fontSize: 100, mb: 2 }}
              />
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                color="primary.main"
              >
                Venda Confirmada!
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                O comprovante foi enviado para análise da tesouraria.
              </Typography>
              <CircularProgress size={30} color="secondary" />
            </Box>
          </Fade>
        ) : (
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* CABEÇALHO DOURADO/VERDE */}
            <DialogTitle
              sx={{
                m: 0,
                p: 2,
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              Finalizar Venda ({numerosRifas.length} selecionadas)
              <IconButton
                aria-label="close"
                onClick={onClose}
                disabled={loading}
                sx={{ color: "white" }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Números selecionados:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {numerosRifas.map((numero) => (
                    <Chip
                      key={numero}
                      label={numero}
                      sx={{
                        bgcolor: "var(--cor-dourado-brilho)",
                        color: "primary.main",
                        fontWeight: "bold",
                      }}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* DADOS DO COMPRADOR */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary.main"
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <Divider sx={{ mb: 3 }} />

              {/* PAGAMENTO PIX (COM QR CODE) */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary.main"
              >
                2. Pagamento PIX ({valorFormatado})
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  bgcolor: "grey.50",
                  textAlign: "center",
                  border: "2px solid var(--cor-dourado-brilho)",
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="body1"
                  color="primary.main"
                  fontWeight="bold"
                  gutterBottom
                >
                  Escaneie o código para pagar:
                </Typography>

                {/* IMAGEM DO QR CODE */}
                <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "white",
                      borderRadius: 2,
                      boxShadow: 1,
                      border: "1px dashed #ccc",
                    }}
                  >
                    {/* ATENÇÃO: Coloque a imagem qrcode-pix.png dentro da pasta src/assets/images/ */}
                    <img
                      src="/src/assets/images/qrcode-pix.png"
                      alt="QR Code PIX da Comissão"
                      style={{ width: 180, height: 180, objectFit: "contain" }}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  sx={{ mt: 2 }}
                >
                  Ou copie a Chave E-mail:
                </Typography>

                <TextField
                  value={chavePixComissao}
                  // REMOVEMOS A PALAVRA "disabled" DAQUI!
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true, // <-- ADICIONAMOS ISTO AQUI
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Copiar PIX" // <-- ADICIONAMOS A ETIQUETA AQUI
                          onClick={handleCopiarPix}
                          edge="end"
                          sx={{ color: "primary.main" }}
                          disabled={loading}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: "white" }}
                />
              </Paper>
              <Divider sx={{ mb: 3 }} />

              {/* ANEXAR COMPROVANTE */}
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
                color="primary.main"
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
                  color={comprovanteAnexado ? "secondary" : "primary"}
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, borderRadius: 2 }}
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
                    color="secondary.main"
                    fontWeight="bold"
                  >
                    ✓ Ficheiro pronto: {comprovanteAnexado.name}
                  </Typography>
                )}
                {errors.comprovante && (
                  <Typography variant="caption" color="error" fontWeight="bold">
                    {errors.comprovante.message}
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: "grey.50" }}>
              <Button onClick={onClose} color="inherit" disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{ minWidth: 160, fontWeight: "bold" }}
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
