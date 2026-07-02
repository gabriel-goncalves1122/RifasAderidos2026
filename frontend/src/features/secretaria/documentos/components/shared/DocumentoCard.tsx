import {
  Box,
  CardActionArea,
  Chip,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";

import { secretariaColors } from "../../../styles/colors";
import { documentosSecretariaStyles } from "../../styles/documentosSecretariaStyles";
import {
  formatarDataDocumento,
  formatarTamanhoArquivo,
  obterTipoPreviewDocumento,
} from "../../utils/documentosSecretariaUtils";
import type { DocumentoComissao } from "../../types/documentosSecretariaTypes";

interface DocumentoCardProps {
  documento: DocumentoComissao;
  onAbrir: (documento: DocumentoComissao) => void;
  onEditar: (documento: DocumentoComissao) => void;
}

function DocumentoIcone({ mimeType }: { mimeType: string }) {
  const tipoPreview = obterTipoPreviewDocumento(mimeType);

  if (tipoPreview === "imagem") {
    return <ImageOutlinedIcon fontSize="small" />;
  }

  if (tipoPreview === "pdf") {
    return <PictureAsPdfOutlinedIcon fontSize="small" />;
  }

  return <TableChartOutlinedIcon fontSize="small" />;
}

export function DocumentoCard({
  documento,
  onAbrir,
  onEditar,
}: DocumentoCardProps) {
  return (
    <Paper elevation={0} sx={{ ...documentosSecretariaStyles.card, position: "relative" }}>
      <Tooltip title="Editar documento">
        <IconButton
          size="small"
          aria-label={`Editar documento ${documento.titulo}`}
          onClick={(event) => {
            event.stopPropagation();
            onEditar(documento);
          }}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 2,
            color: secretariaColors.verdeEscuro,
            bgcolor: "rgba(255, 255, 255, 0.86)",
            "&:hover": {
              bgcolor: secretariaColors.verdeClaro,
            },
          }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <CardActionArea
        onClick={() => onAbrir(documento)}
        aria-label={`Abrir documento ${documento.titulo}`}
        sx={documentosSecretariaStyles.cardAction}
      >
        <Stack spacing={1.5} sx={{ height: "100%" }}>
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 38,
                height: 38,
                flexShrink: 0,
                borderRadius: 2,
                color: secretariaColors.verdeEscuro,
                bgcolor: "rgba(6, 61, 49, 0.09)",
              }}
            >
              <DocumentoIcone mimeType={documento.mimeType} />
            </Box>

            <Box sx={{ minWidth: 0, pr: 4 }}>
              <Typography
                sx={{
                  color: secretariaColors.pretoEsverdeado,
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                {documento.titulo}
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  color: secretariaColors.cinzaTexto,
                  fontSize: "0.82rem",
                  overflowWrap: "anywhere",
                }}
              >
                {documento.nomeArquivo}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={documento.area}
              sx={{
                color: secretariaColors.verdeEscuro,
                bgcolor: "rgba(6, 61, 49, 0.08)",
                fontWeight: 800,
              }}
            />
            <Chip
              size="small"
              icon={<DescriptionOutlinedIcon />}
              label={documento.tipo}
              sx={{
                color: secretariaColors.cinzaTexto,
                bgcolor: secretariaColors.verdeClaro,
                fontWeight: 750,
                textTransform: "capitalize",
              }}
            />
          </Stack>

          <Box sx={{ flex: 1 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0.75}
            justifyContent="space-between"
          >
            <Typography sx={{ color: secretariaColors.cinzaTexto, fontSize: "0.8rem" }}>
              {documento.autorNome}
            </Typography>
            <Typography sx={{ color: secretariaColors.cinzaTexto, fontSize: "0.8rem" }}>
              {formatarDataDocumento(documento.atualizadoEm)} ·{" "}
              {formatarTamanhoArquivo(documento.tamanhoBytes)}
            </Typography>
          </Stack>
        </Stack>
      </CardActionArea>
    </Paper>
  );
}
