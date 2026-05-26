// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/CheckoutPixBox.tsx
// ============================================================================
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Button, Stack, Typography } from "@mui/material";

import { CHAVE_PIX_COMISSAO } from "./utils/checkoutUtils";

interface CheckoutPixBoxProps {
  onCopiarPix: () => void;
}

export function CheckoutPixBox({ onCopiarPix }: CheckoutPixBoxProps) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 4,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1 }}>
        <PixIcon sx={{ color: "#063D31" }} />

        <Typography
          sx={{
            fontWeight: 900,
            color: "#021B16",
            fontSize: "0.98rem",
          }}
        >
          Pagamento via PIX
        </Typography>
      </Stack>

      {/*  <Typography
        sx={{
          color: "#526760",
          fontSize: "0.88rem",
          lineHeight: 1.45,
          mb: 1.5,
        }}
      >
        Faça o PIX para a chave abaixo e anexe o comprovante para enviar a venda
        para análise da tesouraria.
      </Typography> */}

      <Box
        sx={{
          px: 1.5,
          py: 1.25,
          borderRadius: 3,
          bgcolor: "#F6F8F7",
          border: "1px dashed rgba(6, 61, 49, 0.22)",
          wordBreak: "break-all",
          mb: 1.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 800,
            color: "#063D31",
            fontSize: "0.9rem",
          }}
        >
          {CHAVE_PIX_COMISSAO}
        </Typography>
      </Box>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={onCopiarPix}
        sx={{
          borderRadius: 999,
          textTransform: "none",
          fontWeight: 900,
          color: "#063D31",
          borderColor: "rgba(6, 61, 49, 0.28)",
          py: 1,
          "&:hover": {
            borderColor: "#063D31",
            bgcolor: "#F0F7F4",
          },
        }}
      >
        Copiar chave PIX
      </Button>
    </Box>
  );
}
