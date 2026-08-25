import { Alert } from "@mui/material";

export function CheckoutPixError({ erro }: { erro: string }) {
  return (
    <Alert
      severity="warning"
      sx={{
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        color: "#6B4E00",
        "& .MuiAlert-icon": {
          color: "#6B4E00",
        },
      }}
    >
      {erro}
    </Alert>
  );
}
