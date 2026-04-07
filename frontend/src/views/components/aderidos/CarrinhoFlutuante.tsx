import { Box, Typography, Paper, Button, Portal } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

interface Props {
  quantidade: number;
  valorTotal: number;
  onVenderClick: () => void;
}

export function CarrinhoFlutuante({
  quantidade,
  valorTotal,
  onVenderClick,
}: Props) {
  if (quantidade === 0) return null;

  return (
    <Portal>
      <Paper
        elevation={10}
        sx={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 3,
          borderRadius: 8,
          bgcolor: "white",
          zIndex: 9999,
          width: { xs: "90%", sm: "auto" },
          justifyContent: "space-between",
          border: "3px solid var(--cor-dourado-brilho)",
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight="bold" color="text.secondary">
            {quantidade} rifa(s) selecionada(s)
          </Typography>
          <Typography variant="h5" fontWeight="900" color="primary.main">
            R$ {valorTotal},00
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<ShoppingCartCheckoutIcon />}
          sx={{ borderRadius: 6, fontWeight: "bold" }}
          onClick={onVenderClick}
        >
          Vender
        </Button>
      </Paper>
    </Portal>
  );
}
