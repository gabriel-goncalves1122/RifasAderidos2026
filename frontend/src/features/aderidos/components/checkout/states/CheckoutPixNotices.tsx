import { Alert, CircularProgress, Stack, Typography } from "@mui/material";

export function CheckoutPixPollingNotice() {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1.25,
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        border: "1px solid rgba(203, 166, 77, 0.4)",
      }}
    >
      <CircularProgress size={16} sx={{ color: "#A88123" }} />
      <Typography
        sx={{
          fontWeight: 800,
          color: "#6B4E00",
          fontSize: "0.84rem",
        }}
      >
        Aguardando confirmação do pagamento...
      </Typography>
    </Stack>
  );
}

export function CheckoutPixExpiredNotice() {
  return (
    <Alert
      severity="warning"
      sx={{
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        color: "#6B4E00",
        "& .MuiAlert-icon": { color: "#6B4E00" },
      }}
    >
      O tempo de espera expirou. Verifique o status da cobrança no painel de
      rifas.
    </Alert>
  );
}

export function CheckoutPixCanceledNotice() {
  return (
    <Alert
      severity="error"
      sx={{
        borderRadius: 2,
        bgcolor: "#FDF0F0",
        color: "#7A1F1F",
        "& .MuiAlert-icon": { color: "#7A1F1F" },
      }}
    >
      O pagamento foi cancelado ou recusado pelo banco. As rifas voltam a ficar
      disponíveis.
    </Alert>
  );
}
