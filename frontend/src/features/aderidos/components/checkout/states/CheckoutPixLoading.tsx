import { CircularProgress, Stack, Typography } from "@mui/material";

export function CheckoutPixLoading() {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        color: "#526760",
      }}
    >
      <CircularProgress size={18} sx={{ color: "#063D31" }} />
      <Typography sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
        Gerando pagamento via Pix...
      </Typography>
    </Stack>
  );
}
