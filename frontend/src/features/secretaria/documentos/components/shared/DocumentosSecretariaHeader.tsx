import { Box, Typography } from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";

import { colors } from "@/shared/tokens/colors";
import { documentosSecretariaStyles } from "../../styles/documentosSecretariaStyles";

interface DocumentosSecretariaHeaderProps {
  total: number;
}

export function DocumentosSecretariaHeader({
  total,
}: DocumentosSecretariaHeaderProps) {
  return (
    <Box sx={documentosSecretariaStyles.header}>
      <Box>
        <Typography sx={documentosSecretariaStyles.headerEyebrow}>
          Secretaria
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: colors.pretoEsverdeado,
            fontWeight: 950,
            lineHeight: 1.1,
          }}
        >
          Documentos
        </Typography>
        <Typography
          sx={{
            mt: 0.75,
            color: colors.cinzaTexto,
            fontSize: "0.92rem",
            lineHeight: 1.35,
          }}
        >
          Atas, contratos e arquivos organizados por área.
        </Typography>
      </Box>

      <Box
        aria-label={`${total} documentos cadastrados`}
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          alignItems: "center",
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: 2,
          color: colors.verdeEscuro,
          bgcolor: "rgba(6, 61, 49, 0.08)",
          fontWeight: 850,
        }}
      >
        <FolderOutlinedIcon fontSize="small" />
        {total}
      </Box>
    </Box>
  );
}
