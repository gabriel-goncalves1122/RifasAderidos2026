import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Stack, Typography } from "@mui/material";

export function CheckoutPixConfirmed() {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#EAF7EF",
        border: "2px solid #0B5136",
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 48, color: "#0B5136" }} />
      <Typography
        sx={{
          fontWeight: 950,
          color: "#0B5136",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        Pagamento confirmado!
      </Typography>
      <Typography
        sx={{
          color: "#425951",
          fontSize: "0.88rem",
          textAlign: "center",
        }}
      >
        O pagamento via Pix foi confirmado. As rifas estão em análise pela
        tesouraria.
      </Typography>
    </Stack>
  );
}
