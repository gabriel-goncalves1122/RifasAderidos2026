import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button, CircularProgress } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { aderidosMotion, reduceMotionSx } from "@/shared/tokens/motion";

interface CheckoutSubmitButtonProps {
  gerandoPix: boolean;
  pagamentoGerado: boolean;
}

export function CheckoutSubmitButton({
  gerandoPix,
  pagamentoGerado,
}: CheckoutSubmitButtonProps) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      data-testid="checkout-enviar-venda"
      disabled={gerandoPix || pagamentoGerado}
      sx={{
        mt: 0.5,
        minHeight: 52,
        borderRadius: 2,
        textTransform: "none",
        fontWeight: 950,
        fontSize: "1rem",
        bgcolor: colors.verdeEscuro,
        boxShadow: "0 12px 22px rgba(6, 61, 49, 0.22)",
        transition: `background-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
        ...reduceMotionSx,
        "&:focus-visible": {
          outline: "4px solid rgba(6, 61, 49, 0.24)",
          outlineOffset: "2px",
        },
        "&:hover": {
          bgcolor: "#052F26",
          boxShadow: "0 14px 26px rgba(6, 61, 49, 0.28)",
        },
        "&.Mui-disabled": {
          bgcolor: "#526760",
          color: "#FFFFFF",
        },
      }}
      startIcon={
        gerandoPix ? (
          <CircularProgress size={18} color="inherit" />
        ) : pagamentoGerado ? (
          <CheckCircleIcon />
        ) : undefined
      }
    >
      {pagamentoGerado ? "Pagamento gerado" : "Gerar pagamento"}
    </Button>
  );
}
