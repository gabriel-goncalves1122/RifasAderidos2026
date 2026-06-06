import SearchIcon from "@mui/icons-material/Search";
import { Paper, Typography } from "@mui/material";

export function AuditoriaComprasEmptyState() {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 7,
        px: 2,
        textAlign: "center",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        border: "1px dashed rgba(2, 27, 22, 0.22)",
      }}
    >
      <SearchIcon sx={{ fontSize: 46, color: "#A9B8B2", mb: 1.5 }} />
      <Typography sx={{ color: "#021B16", fontWeight: 900 }}>
        Nenhuma compra encontrada
      </Typography>
      <Typography sx={{ color: "#526760", fontSize: "0.9rem", mt: 0.5 }}>
        Ajuste os filtros para revisar outros registros de auditoria.
      </Typography>
    </Paper>
  );
}
