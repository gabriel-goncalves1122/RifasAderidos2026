// ============================================================================
// ARQUIVO: ResumoHeader.tsx (CORRIGIDO)
// ============================================================================
import { Paper, Box, Typography } from "@mui/material";
import { UsuarioFormatura } from "../../controllers/useAuthController";

interface ResumoHeaderProps {
  usuario: UsuarioFormatura | null;
  arrecadacao: number;
}

export function ResumoHeader({ usuario, arrecadacao }: ResumoHeaderProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(to right, #ffffff, #f0f7ff)",
      }}
    >
      <Box>
        <Typography variant="h5" color="primary" fontWeight="bold">
          Olá, {usuario?.displayName || "Engenheiro(a)"}!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cargo: <strong>{usuario?.cargo?.toUpperCase() || "MEMBRO"}</strong>
        </Typography>
      </Box>
      <Box sx={{ textAlign: "right" }}>
        <Typography variant="body2" color="text.secondary">
          Arrecadação Confirmada
        </Typography>
        <Typography variant="h4" color="success.main" fontWeight="bold">
          R$ {arrecadacao.toFixed(2).replace(".", ",")}
        </Typography>
      </Box>
    </Paper>
  );
}
