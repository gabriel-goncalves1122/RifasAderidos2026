// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/CarrinhoFlutuante.tsx
// ============================================================================
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Button, Paper, Typography } from "@mui/material";

import { useKeyboardHeight } from "./hooks/useKeyboardHeight";
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
  const keyboardHeight = useKeyboardHeight();

  if (quantidade <= 0) return null;

  const textoQuantidade =
    quantidade === 1 ? "rifa selecionada" : "rifas selecionadas";

  return (
    <Box
      sx={{
        ...painelAderidoStyles.carrinhoFixoArea,
        bottom: keyboardHeight,
      }}
      data-keyboard-height={keyboardHeight}
    >
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
            data-testid="carrinho-vender"
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
