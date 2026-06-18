import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton, Typography } from "@mui/material";

import { aderidosColors } from "@/shared/tokens/colors";

interface CheckoutModalHeaderProps {
  gerandoPix: boolean;
  onClose: () => void;
}

export function CheckoutModalHeader({
  gerandoPix,
  onClose,
}: CheckoutModalHeaderProps) {
  return (
    <Box
      sx={{
        px: 2.25,
        py: 2,
        borderBottom: "1px solid rgba(2, 27, 22, 0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          component="h2"
          sx={{
            fontWeight: 950,
            color: aderidosColors.greenBlack,
            fontSize: "1.22rem",
            lineHeight: 1.15,
          }}
        >
          Finalizar venda
        </Typography>

        <Typography
          sx={{
            color: aderidosColors.textMuted,
            fontSize: "0.86rem",
            mt: 0.35,
          }}
        >
          Preencha os dados para gerar o pagamento via Pix.
        </Typography>
      </Box>

      <IconButton
        onClick={onClose}
        disabled={gerandoPix}
        aria-label="Fechar modal de venda"
        sx={{
          bgcolor: "#F1F4F3",
          "&:focus-visible": {
            outline: "4px solid rgba(6, 61, 49, 0.24)",
            outlineOffset: "2px",
          },
          "&:hover": {
            bgcolor: "#E8EEEC",
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
