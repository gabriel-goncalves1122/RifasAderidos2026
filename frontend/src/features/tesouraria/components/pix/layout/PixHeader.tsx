import SyncIcon from "@mui/icons-material/Sync";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

import { TesourariaSectionHeader } from "../../shared/TesourariaSectionHeader";

interface PixHeaderProps {
  sincronizando: boolean;
  onSincronizar: () => void;
}

export function PixHeader({
  sincronizando,
  onSincronizar,
}: PixHeaderProps) {
  return (
    <TesourariaSectionHeader
      eyebrow="Tesouraria"
      titulo="Recebimentos Pix"
      subtitulo="Acompanhe recebimentos, conciliação e aderidos."
      compact
      action={
        <Tooltip title="Atualizar informações Pix">
          <span>
            <IconButton
              aria-label="Atualizar informações Pix"
              onClick={onSincronizar}
              disabled={sincronizando}
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: "#063D31",
                color: "#FFFFFF",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: "#052F26",
                },
                "&.Mui-disabled": {
                  bgcolor: "#EAF3EF",
                  color: "#526760",
                },
              }}
            >
              {sincronizando ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <SyncIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      }
    />
  );
}
