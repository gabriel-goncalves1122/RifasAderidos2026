// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/EstatisticasAderido.tsx
// ============================================================================
import {
  Box,
  Typography,
  Paper,
  Tooltip,
  IconButton,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

interface Props {
  primeiroNome: string;
  valorArrecadado: number;
  notificacoesNaoLidas: number;
  onAbrirNotificacoes: () => void;
}

export function EstatisticasAderido({
  primeiroNome,
  valorArrecadado,
  notificacoesNaoLidas,
  onAbrirNotificacoes,
}: Props) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Olá, {primeiroNome}!
        </Typography>
        <Tooltip title="Avisos da Tesouraria">
          <IconButton
            onClick={onAbrirNotificacoes}
            color={notificacoesNaoLidas > 0 ? "error" : "primary"}
          >
            <Badge
              badgeContent={notificacoesNaoLidas}
              color="error"
              overlap="circular"
            >
              {notificacoesNaoLidas > 0 ? (
                <NotificationsActiveIcon fontSize="large" />
              ) : (
                <NotificationsIcon fontSize="large" />
              )}
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          gap: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, var(--cor-verde-fundo) 0%, #1a3c2f 100%)",
          color: "white",
          borderLeft: "6px solid var(--cor-dourado-brilho)",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Arrecadação Confirmada
          </Typography>
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{ mt: 1, color: "var(--cor-dourado-brilho)" }}
          >
            R$ {valorArrecadado},00
          </Typography>
        </Box>
      </Paper>
    </>
  );
}
