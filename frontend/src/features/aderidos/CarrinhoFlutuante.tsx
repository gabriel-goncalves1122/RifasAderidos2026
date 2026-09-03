// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/CarrinhoFlutuante.tsx
// ============================================================================
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

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
    <AnimatePresence>
      {quantidade > 0 && (
        <Box
          component={motion.div}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          sx={{
            ...painelAderidoStyles.carrinhoFixoArea,
            bottom: keyboardHeight,
          }}
          data-keyboard-height={keyboardHeight}
        >
          <Box sx={painelAderidoStyles.carrinhoAnimado}>
            <Paper elevation={0} sx={painelAderidoStyles.carrinhoFixoCard}>
              <Box sx={painelAderidoStyles.carrinhoFixoConteudo}>
                <Box sx={painelAderidoStyles.carrinhoResumoArea}>
                  <Box
                    component={motion.div}
                    key={quantidade} // Aciona a animação quando a quantidade muda
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    sx={painelAderidoStyles.carrinhoQuantidadeChip}
                  >
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
      )}
    </AnimatePresence>
  );
}
