// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/BotaoNotificacoes.tsx
// ============================================================================
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { Badge, IconButton, Tooltip } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

interface BotaoNotificacoesProps {
  notificacoesNaoLidas: number;
  onAbrirNotificacoes: () => void;
}

export function BotaoNotificacoes({
  notificacoesNaoLidas,
  onAbrirNotificacoes,
}: BotaoNotificacoesProps) {
  return (
    <Tooltip title="Notificações" arrow>
      <IconButton
        onClick={onAbrirNotificacoes}
        aria-label="Abrir notificações"
        sx={painelAderidoStyles.notificacaoButton}
      >
        <Badge
          badgeContent={notificacoesNaoLidas}
          color="error"
          overlap="circular"
          invisible={notificacoesNaoLidas === 0}
        >
          <NotificationsNoneIcon fontSize="small" />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
