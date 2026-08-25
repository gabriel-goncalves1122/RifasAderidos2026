import SearchIcon from "@mui/icons-material/Search";
import { Paper, Typography } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { typographyScale as typography } from "@/shared/tokens/typography";

export function AuditoriaComprasEmptyState() {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 7,
        px: 2,
        textAlign: "center",
        borderRadius: 2.25,
        bgcolor: colors.branco,
        border: "1px dashed rgba(2, 27, 22, 0.22)",
      }}
    >
      <SearchIcon sx={{ fontSize: 46, color: colors.cinzaIcone, mb: 1.5 }} />
      <Typography sx={{ ...typography.titulo, fontWeight: 900 }}>
        Nenhuma compra encontrada
      </Typography>
      <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.9rem", mt: 0.5 }}>
        Ajuste os filtros para revisar outros registros de auditoria.
      </Typography>
    </Paper>
  );
}
