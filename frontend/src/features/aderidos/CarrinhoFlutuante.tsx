// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/CarrinhoFlutuante.tsx
// ============================================================================
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Button, Paper, Typography } from "@mui/material";

import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { formatarMoedaBR } from "./utils/formatadoresAderido";

interface CarrinhoFlutuanteProps {
  quantidade: number;
  valorTotal: number;
  onVenderClick: () => void;
}

export function CarrinhoFlutuante({
  quantidade,
  valorTotal,
  onVenderClick,
}: CarrinhoFlutuanteProps) {
  if (quantidade <= 0) return null;

  const textoQuantidade =
    quantidade === 1 ? "rifa selecionada" : "rifas selecionadas";

  return (
    <Box sx={painelAderidoStyles.carrinhoFixoArea}>
      <Paper elevation={0} sx={painelAderidoStyles.carrinhoFixoCard}>
        <Box sx={painelAderidoStyles.carrinhoFixoConteudo}>
          <Box sx={painelAderidoStyles.carrinhoResumoArea}>
            <Box sx={painelAderidoStyles.carrinhoQuantidadeChip}>
              {quantidade}
            </Box>

            <Box sx={painelAderidoStyles.carrinhoTextoArea}>
              <Typography sx={painelAderidoStyles.carrinhoFixoTitulo}>
                {textoQuantidade}
              </Typography>

              <Typography sx={painelAderidoStyles.carrinhoFixoDescricao}>
                {formatarMoedaBR(valorTotal)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={onVenderClick}
            sx={painelAderidoStyles.carrinhoFixoBotao}
          >
            Vender
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
