// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/CarrinhoFlutuante.tsx
// ============================================================================
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Button, Collapse, Paper, Typography } from "@mui/material";

import { useKeyboardHeight } from "@/shared/hooks/useKeyboardHeight";
import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { formatarMoeda } from "@/shared/utils/formatadores";

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
  const textoQuantidade =
    quantidade === 1 ? "rifa selecionada" : "rifas selecionadas";

  return (
    <Collapse in={quantidade > 0} unmountOnExit>
      <Box
        sx={{
          ...painelAderidoStyles.carrinhoFixoArea,
          bottom: keyboardHeight,
        }}
        data-keyboard-height={keyboardHeight}
      >
        <Box
          sx={{
            ...painelAderidoStyles.carrinhoAnimado,
            opacity: quantidade > 0 ? 1 : 0,
            transform: quantidade > 0 ? "translateY(0)" : "translateY(12px)",
          }}
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
                    {formatarMoeda(valorTotal)}
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
      </Box>
    </Collapse>
  );
}
