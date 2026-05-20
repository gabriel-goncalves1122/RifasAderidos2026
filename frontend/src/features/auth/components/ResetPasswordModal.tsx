// ============================================================================
// ARQUIVO: frontend/src/features/auth/components/ResetPasswordModal.tsx
// ============================================================================
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

interface ResetPasswordModalProps {
  open: boolean;
  resetEmail: string;
  loadingReset: boolean;
  resetSuccess: boolean;
  resetError: string | null;
  onClose: () => void;
  setResetEmail: (email: string) => void;
  onResetPassword: () => Promise<void>;
}

export function ResetPasswordModal({
  open,
  resetEmail,
  loadingReset,
  resetSuccess,
  resetError,
  onClose,
  setResetEmail,
  onResetPassword,
}: ResetPasswordModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Recuperar senha</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            Informe o e-mail cadastrado para receber o link de redefinição de
            senha.
          </Typography>

          {resetSuccess && (
            <Alert severity="success">
              Link enviado com sucesso. Verifique sua caixa de entrada.
            </Alert>
          )}

          {resetError && <Alert severity="error">{resetError}</Alert>}

          <TextField
            label="E-mail"
            type="email"
            value={resetEmail}
            onChange={(event) => setResetEmail(event.target.value)}
            disabled={loadingReset || resetSuccess}
            fullWidth
            autoFocus
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loadingReset}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onResetPassword}
          disabled={loadingReset || resetSuccess || !resetEmail}
        >
          {loadingReset ? <CircularProgress size={22} /> : "Enviar link"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
