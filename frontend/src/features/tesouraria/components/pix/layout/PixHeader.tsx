import SyncIcon from "@mui/icons-material/Sync";
import { CircularProgress, IconButton, Tooltip } from "@mui/material";

import { colors } from "../../../styles/colors";
import { AbaPix } from "../../../types/pixTabs";
import { TesourariaSectionHeader } from "../../shared/TesourariaSectionHeader";

interface PixHeaderProps {
  abaAtual: AbaPix;
  sincronizando: boolean;
  onSincronizar: () => void;
}

const SUBTITULOS_PIX: Record<AbaPix, string> = {
  "visao-geral": "Resumo dos recebimentos e pendências da operação Pix.",
  transacoes: "Revise Pix confirmados pelo banco e decida o próximo passo.",
  conciliacao: "Vincule pagamentos recebidos aos aderidos e rifas corretos.",
  aderidos: "Acompanhe arrecadação e saldo operacional por aderido.",
};

export function PixHeader({
  abaAtual,
  sincronizando,
  onSincronizar,
}: PixHeaderProps) {
  return (
    <TesourariaSectionHeader
      eyebrow="Tesouraria"
      titulo="Recebimentos Pix"
      subtitulo={SUBTITULOS_PIX[abaAtual]}
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
                borderRadius: 2,
                bgcolor: colors.verdeEscuro,
                color: colors.branco,
                flexShrink: 0,
                "&:hover": {
                  bgcolor: colors.verdeEscuroHover,
                },
                "&.Mui-disabled": {
                  bgcolor: colors.verdeClaro,
                  color: colors.cinzaTexto,
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
