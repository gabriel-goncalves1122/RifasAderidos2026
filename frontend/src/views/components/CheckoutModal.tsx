// ============================================================================
// ARQUIVO: CheckoutModal.tsx (Interface de Venda e Upload)
// ============================================================================
import React, { useState, useEffect } from "react";
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
  // --------------------------------------------------------------------------
  // 1. ESTADOS LOCAIS
  // --------------------------------------------------------------------------
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);

  // Estados de UI/UX (Animações e Notificações)
  const [showSuccess, setShowSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { finalizarVenda, loading } = useRifasController();

  // --------------------------------------------------------------------------
  // 2. CICLO DE VIDA (Lifecycle)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!open) {
      setNome("");
      setTelefone("");
      setEmail("");
      setComprovante(null);
      setShowSuccess(false);
    }
  }, [open]);

  // --------------------------------------------------------------------------
  // 3. VARIÁVEIS DE CÁLCULO
  // --------------------------------------------------------------------------
  const chavePixComissao = "comissao.engenharia@unifei.edu.br";
  const PRECO_RIFA = 10.0;
  const valorTotal = numerosRifas.length * PRECO_RIFA;
  const valorFormatado = valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // --------------------------------------------------------------------------
  // 4. AÇÕES (Handlers)
  // --------------------------------------------------------------------------
  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixComissao);
    setSnackbarOpen(true); // Aciona o Snackbar elegante no lugar do alert()
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setComprovante(event.target.files[0]);
    }
  };

  const handleFinalizar = async () => {
    if (!comprovante) return;

    const sucesso = await finalizarVenda({
      nome,
      telefone,
      email,
      numerosRifas,
      comprovante,
    });

    if (sucesso) {
      // 1. Troca a interface para a tela de Sucesso
      setShowSuccess(true);

      // 2. Agenda o fechamento automático após 3 segundos
      setTimeout(() => {
        onSuccess();
      }, 3000);
    }
  };

  const formValido =
    nome.trim() !== "" && telefone.trim() !== "" && comprovante !== null;

  // --------------------------------------------------------------------------
  // 5. INTERFACE (UI)
  // --------------------------------------------------------------------------
  return (
    <>
      <Dialog
        open={open}
        onClose={loading || showSuccess ? undefined : onClose}
        fullWidth
        maxWidth="sm"
      >
        {/* ================================================================= */}
        {/* TELA DE SUCESSO ANIMADA (Renderização Condicional)                */}
        {/* ================================================================= */}
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
              </Typography>
              <CircularProgress size={30} color="success" />
            </Box>
          </Fade>
        ) : (
          /* ================================================================= */
          /* TELA PADRÃO DE CHECKOUT                                           */
          /* ================================================================= */
          <>
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
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={loading}
                />
                <TextField
                  label="WhatsApp (com DDD) *"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled={loading}
                  placeholder="(35) 99999-9999"
                />
                <TextField
                  label="E-mail (Opcional)"
                  variant="outlined"
                  size="small"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  helperText="Enviaremos o recibo para este e-mail."
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
                  gap: 2,
                }}
              >
                <Button
                  component="label"
                  variant={comprovante ? "outlined" : "contained"}
                  color={comprovante ? "success" : "primary"}
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  disabled={loading}
                >
                  {comprovante ? "Trocar Comprovante" : "Anexar Imagem ou PDF"}
                  <input
                    type="file"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {comprovante && (
                  <Typography
                    variant="body2"
                    color="success.main"
                    fontWeight="bold"
                  >
                    ✓ Ficheiro pronto: {comprovante.name}
                  </Typography>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
              <Button onClick={onClose} color="inherit" disabled={loading}>
                Cancelar
              </Button>
              <Button
                onClick={handleFinalizar}
                variant="contained"
                color="success"
                disabled={!formValido || loading}
                sx={{ minWidth: 160 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirmar Venda"
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* SNACKBAR DE FEEDBACK (PIX COPIADO) */}
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
