// ============================================================================
// ARQUIVO: frontend/src/views/pages/components/loginRegister/ResetPasswordModal.tsx
// ============================================================================
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

interface ResetPasswordModalProps {
  open: boolean;
  onClose: () => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  onResetPassword: () => void;
  loadingReset: boolean;
  resetSuccess: boolean;
  resetError: string | null;
}

export function ResetPasswordModal({
  open,
  onClose,
  resetEmail,
  setResetEmail,
  onResetPassword,
  loadingReset,
  resetSuccess,
  resetError,
}: ResetPasswordModalProps) {
  // Permite submeter o e-mail ao pressionar "Enter" dentro do Modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && resetEmail && !loadingReset && !resetSuccess) {
      e.preventDefault();
      onResetPassword();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      // Adicionamos transições suaves
      TransitionProps={{ timeout: 300 }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "primary.main" }}>
        Recuperar Senha
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Introduza o e-mail associado à sua conta. Enviaremos um link seguro
          para criar uma nova senha.
        </DialogContentText>

        {resetSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            E-mail enviado com sucesso! Verifique a sua caixa de entrada (e
            spam).
          </Alert>
        )}

        {resetError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {resetError}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          label="O seu E-mail"
          type="email"
          fullWidth
          variant="outlined"
          value={resetEmail}
          onChange={(e) => setResetEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loadingReset || resetSuccess}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loadingReset} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={onResetPassword}
          variant="contained"
          disabled={loadingReset || !resetEmail || resetSuccess}
        >
          {loadingReset ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Enviar E-mail"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
