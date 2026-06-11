import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { CircularProgress, IconButton, Stack, Tooltip } from "@mui/material";

import { CompraAuditavel } from "../../../types/auditoriaCompras";
import { normalizarTexto } from "../../../utils/auditoriaComprasUtils";
import { colors } from "../../../styles/colors";

interface AuditoriaCompraActionsProps {
  compra: CompraAuditavel;
  onVerComprovante: (compra: CompraAuditavel) => void;
  onEditar: (compra: CompraAuditavel) => void;
  onVerDetalhes: (compra: CompraAuditavel) => void;
  onReenviarEmailComprovante: (compra: CompraAuditavel) => void;
  reenviandoEmailComprovante?: boolean;
}

export function AuditoriaCompraActions({
  compra,
  onVerComprovante,
  onEditar,
  onVerDetalhes,
  onReenviarEmailComprovante,
  reenviandoEmailComprovante = false,
}: AuditoriaCompraActionsProps) {
  const compraPaga = normalizarTexto(compra.status) === "pago";
  const possuiCompradorId = Boolean(compra.comprador_id);
  const possuiEmail = Boolean(compra.comprador_email.trim());
  const podeReenviarEmail =
    compraPaga &&
    possuiCompradorId &&
    possuiEmail &&
    !reenviandoEmailComprovante;
  const tooltipEmail = reenviandoEmailComprovante
    ? "Reenviando e-mail de comprovante"
    : !compraPaga
      ? "Disponível somente para compras pagas"
      : !possuiCompradorId
        ? "Compra sem comprador_id"
        : !possuiEmail
          ? "Compra sem e-mail do comprador"
          : "Reenviar e-mail de comprovante";

  return (
    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
      <Tooltip
        title={
          compra.comprovante_url
            ? "Ver comprovante"
            : "Comprovante indisponível nos dados atuais"
        }
      >
        <span>
          <IconButton
            size="small"
            aria-label="Ver comprovante"
            disabled={!compra.comprovante_url}
            onClick={() => onVerComprovante(compra)}
            sx={{
              color: colors.verdeEscuro,
              bgcolor: colors.verdeClaro,
              "&:hover": { bgcolor: colors.verdeHover },
              "&.Mui-disabled": {
                bgcolor: colors.fundoSuave,
                color: colors.cinzaDisabled,
              },
            }}
          >
            <ImageOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title={tooltipEmail}>
        <span>
          <IconButton
            size="small"
            aria-label="Reenviar e-mail"
            disabled={!podeReenviarEmail}
            onClick={() => onReenviarEmailComprovante(compra)}
            sx={{
              color: colors.verdeEscuro,
              bgcolor: colors.verdeClaro,
              "&:hover": { bgcolor: colors.verdeHover },
              "&.Mui-disabled": {
                bgcolor: colors.fundoSuave,
                color: colors.cinzaDisabled,
              },
            }}
          >
            {reenviandoEmailComprovante ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <EmailOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Editar dados permitidos do comprador">
        <IconButton
          size="small"
          aria-label="Editar comprador"
          onClick={() => onEditar(compra)}
          sx={{
            color: colors.verdeEscuro,
            bgcolor: colors.verdeClaro,
            "&:hover": { bgcolor: colors.verdeHover },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Detalhes da compra">
        <IconButton
          size="small"
          aria-label="Ver detalhes da compra"
          onClick={() => onVerDetalhes(compra)}
          sx={{
            color: colors.verdeEscuro,
            bgcolor: colors.verdeClaro,
            "&:hover": { bgcolor: colors.verdeHover },
          }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
