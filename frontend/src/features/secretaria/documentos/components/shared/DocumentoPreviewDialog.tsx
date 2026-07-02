import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { secretariaColors } from "../../../styles/colors";
import { documentosSecretariaStyles } from "../../styles/documentosSecretariaStyles";
import {
  formatarDataDocumento,
  formatarTamanhoArquivo,
  obterTipoPreviewDocumento,
} from "../../utils/documentosSecretariaUtils";
import type { DocumentoComissao } from "../../types/documentosSecretariaTypes";

interface DocumentoPreviewDialogProps {
  open: boolean;
  documento: DocumentoComissao | null;
  fullScreen?: boolean;
  url: string | null;
  loading: boolean;
  erro: string | null;
  onClose: () => void;
  onEditar: (documento: DocumentoComissao) => void;
}

function abrirNovaAba(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function DocumentoPreviewDialog({
  open,
  documento,
  fullScreen = false,
  url,
  loading,
  erro,
  onClose,
  onEditar,
}: DocumentoPreviewDialogProps) {
  const tipoPreview = documento
    ? obterTipoPreviewDocumento(documento.mimeType)
    : "indisponivel";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: fullScreen ? 0 : 2,
          bgcolor: "#F6F8F7",
        },
      }}
    >
      {documento && (
        <>
          <DialogTitle sx={{ pb: 1.5 }}>
            <Typography
              component="span"
              sx={{
                display: "block",
                color: secretariaColors.pretoEsverdeado,
                fontSize: "1.25rem",
                fontWeight: 950,
                lineHeight: 1.15,
              }}
            >
              {documento.titulo}
            </Typography>
            <Typography
              component="span"
              sx={{
                display: "block",
                mt: 0.5,
                color: secretariaColors.cinzaTexto,
                fontSize: "0.86rem",
              }}
            >
              {documento.area} · {documento.nomeArquivo}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ color: secretariaColors.cinzaTexto, fontSize: "0.85rem" }}
              >
                <Typography variant="body2">
                  Atualizado em {formatarDataDocumento(documento.atualizadoEm)}
                </Typography>
                <Typography variant="body2">
                  {formatarTamanhoArquivo(documento.tamanhoBytes)}
                </Typography>
                <Typography variant="body2">{documento.autorNome}</Typography>
              </Stack>

              {loading && (
                <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
                  <CircularProgress aria-label="Carregando arquivo" />
                </Box>
              )}

              {erro && <Alert severity="error">{erro}</Alert>}

              {!loading && tipoPreview === "imagem" && url && (
                <Box
                  component="img"
                  src={url}
                  alt={`Pré-visualização de ${documento.titulo}`}
                  sx={{
                    ...documentosSecretariaStyles.previewFrame,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              )}

              {!loading && tipoPreview === "pdf" && url && (
                <Box
                  component="iframe"
                  title={`Pré-visualização de ${documento.titulo}`}
                  src={url}
                  sx={documentosSecretariaStyles.previewFrame}
                />
              )}

              {!loading && (!url || tipoPreview === "indisponivel") && (
                <Alert
                  severity="info"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "rgba(6, 61, 49, 0.08)",
                    color: secretariaColors.pretoEsverdeado,
                  }}
                >
                  Pré-visualização indisponível para este tipo de arquivo.
                </Alert>
              )}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onClose} sx={{ fontWeight: 800 }}>
              Fechar
            </Button>
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEditar(documento)}
              sx={{ fontWeight: 850 }}
            >
              Editar
            </Button>
            {url && (
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={() => abrirNovaAba(url)}
                sx={{ borderRadius: 2, fontWeight: 850 }}
              >
                Abrir arquivo
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
