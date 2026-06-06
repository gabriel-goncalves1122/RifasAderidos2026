// Legado: o cabeçalho atual da tesouraria Pix usa PixHeader.
// Mantido para compatibilidade enquanto a limpeza definitiva não for autorizada.
import SyncIcon from "@mui/icons-material/Sync";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

interface TransacoesHeaderProps {
  sincronizando: boolean;
  onSincronizar: () => void;
}

export function TransacoesHeader({
  sincronizando,
  onSincronizar,
}: TransacoesHeaderProps) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h5"
          sx={{ color: "#021B16", fontWeight: 950, lineHeight: 1.1 }}
        >
          Transações bancárias
        </Typography>

        <Typography sx={{ color: "#526760", mt: 0.5 }}>
          Acompanhe os lançamentos recebidos pela API do banco e a conciliação
          com vendas de rifas.
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onSincronizar}
        disabled={sincronizando}
        startIcon={
          sincronizando ? <CircularProgress size={18} color="inherit" /> : <SyncIcon />
        }
        sx={{
          borderRadius: 2,
          bgcolor: "#063D31",
          color: "#FFFFFF",
          fontWeight: 850,
          textTransform: "none",
          px: 2.5,
          "&:hover": { bgcolor: "#052F26" },
        }}
      >
        {sincronizando ? "Sincronizando..." : "Sincronizar banco"}
      </Button>
    </Box>
  );
}
