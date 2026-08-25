import { Box, Typography } from "@mui/material";

export function CheckoutPixEmpty() {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        border: "1px dashed rgba(6, 61, 49, 0.18)",
        color: "#526760",
      }}
    >
      <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.45 }}>
        O pagamento via Pix será gerado quando os dados forem confirmados.
      </Typography>
    </Box>
  );
}
