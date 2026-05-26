// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/CheckoutResumoVenda.tsx
// ============================================================================
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Box, Chip, Stack, Typography } from "@mui/material";

import { formatarMoedaBR } from "../../utils/formatadoresAderido";
import { calcularValorTotalRifas } from "./utils/checkoutUtils";

interface CheckoutResumoVendaProps {
  numerosRifas: string[];
}

export function CheckoutResumoVenda({
  numerosRifas,
}: CheckoutResumoVendaProps) {
  const valorTotal = calcularValorTotalRifas(numerosRifas);

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          sm: 2.25,
        },
        borderRadius: 3,
        bgcolor: "#F6F8F7",
        border: "1px solid rgba(2, 27, 22, 0.08)",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{
          mb: 1.5,
          pl: {
            xs: 0.5,
            sm: 0.75,
          },
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: "#FFFFFF",
            bgcolor: "#063D31",
          }}
        >
          <ShoppingCartCheckoutIcon fontSize="small" />
        </Box>

        <Box sx={{ pl: 0.35 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#021B16",
              fontSize: "1rem",
              lineHeight: 1.15,
            }}
          >
            Resumo da venda
          </Typography>

          <Typography
            sx={{
              color: "#526760",
              fontSize: "0.84rem",
              mt: 0.25,
            }}
          >
            Confira os números antes de enviar.
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{
          mb: 1.75,
          pl: {
            xs: 0.5,
            sm: 0.75,
          },
        }}
      >
        {numerosRifas.map((numero) => (
          <Chip
            key={numero}
            label={numero}
            size="small"
            sx={{
              height: 28,
              borderRadius: 2,
              fontWeight: 900,
              color: "#063D31",
              bgcolor: "#EAF3EF",
              border: "1px solid rgba(6, 61, 49, 0.18)",
            }}
          />
        ))}
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          pr: {
            xs: 1.75,
            sm: 2.25,
          },
        }}
      >
        <Typography
          sx={{
            color: "#021B16",
            fontWeight: 950,
            fontSize: {
              xs: "1.45rem",
              sm: "1.55rem",
            },
            lineHeight: 1,
            letterSpacing: "-0.035em",
          }}
        >
          {formatarMoedaBR(valorTotal)}
        </Typography>
      </Box>
    </Box>
  );
}
