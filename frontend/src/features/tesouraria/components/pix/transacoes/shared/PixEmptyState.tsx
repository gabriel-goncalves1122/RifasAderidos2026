import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { Box, Typography } from "@mui/material";

export function PixEmptyState() {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 7,
        bgcolor: "#FFFFFF",
        borderRadius: 2.25,
        border: "1px dashed rgba(2, 27, 22, 0.18)",
      }}
    >
      <AccountBalanceIcon sx={{ fontSize: 54, color: "#063D31", mb: 1.5 }} />

      <Typography
        sx={{ color: "#021B16", fontWeight: 900, fontSize: "1.1rem" }}
      >
        Nenhuma transação encontrada
      </Typography>

      <Typography sx={{ color: "#526760", mt: 0.5 }}>
        Ajuste os filtros ou sincronize novamente com o banco.
      </Typography>
    </Box>
  );
}
