import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton, Stack, Tooltip } from "@mui/material";

import { CompraAuditavel } from "../../../types/auditoriaCompras";

interface AuditoriaCompraActionsProps {
  compra: CompraAuditavel;
  onVerComprovante: (compra: CompraAuditavel) => void;
  onEditar: (compra: CompraAuditavel) => void;
  onVerDetalhes: (compra: CompraAuditavel) => void;
}

export function AuditoriaCompraActions({
  compra,
  onVerComprovante,
  onEditar,
  onVerDetalhes,
}: AuditoriaCompraActionsProps) {
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
              color: "#063D31",
              bgcolor: "#EAF3EF",
              "&:hover": { bgcolor: "#DCEDE8" },
              "&.Mui-disabled": {
                bgcolor: "#F6F8F7",
                color: "#9AA9A4",
              },
            }}
          >
            <ImageOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Reenvio de e-mail será integrado na próxima etapa">
        <span>
          <IconButton
            size="small"
            aria-label="Reenviar e-mail"
            disabled
            sx={{
              bgcolor: "#F6F8F7",
              color: "#9AA9A4",
            }}
          >
            <EmailOutlinedIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Editar dados permitidos do comprador">
        <IconButton
          size="small"
          aria-label="Editar comprador"
          onClick={() => onEditar(compra)}
          sx={{
            color: "#063D31",
            bgcolor: "#EAF3EF",
            "&:hover": { bgcolor: "#DCEDE8" },
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
            color: "#063D31",
            bgcolor: "#EAF3EF",
            "&:hover": { bgcolor: "#DCEDE8" },
          }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
