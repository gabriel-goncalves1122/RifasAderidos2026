import { ReactElement } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

interface DesempenhoKpiCardProps {
  titulo: string;
  valor: string;
  detalhe: string;
  icon: ReactElement;
  cor: string;
  destaque?: boolean;
}

export function DesempenhoKpiCard({
  titulo,
  valor,
  detalhe,
  icon,
  cor,
  destaque = false,
}: DesempenhoKpiCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 1.85, sm: 2.15 },
        borderRadius: 3,
        bgcolor: destaque ? "#063D31" : "#FFFFFF",
        border: destaque
          ? "1px solid rgba(255, 255, 255, 0.14)"
          : "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: destaque
          ? "0 16px 34px rgba(6, 61, 49, 0.18)"
          : "0 12px 28px rgba(2, 27, 22, 0.07)",
        minWidth: 0,
        height: "100%",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 5,
          bgcolor: destaque ? "#A8DCCB" : cor,
        },
      }}
    >
      <Stack spacing={1.35} sx={{ pl: 0.65 }}>
        <Stack direction="row" spacing={1.15} alignItems="center">
          <Box
            sx={{
              width: { xs: 40, sm: 42 },
              height: { xs: 40, sm: 42 },
              borderRadius: 2.2,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              color: destaque ? "#063D31" : cor,
              bgcolor: destaque ? "#FFFFFF" : `${cor}18`,
              boxShadow: destaque
                ? "0 10px 22px rgba(2, 27, 22, 0.20)"
                : "none",
            }}
          >
            {icon}
          </Box>

          <Typography
            sx={{
              color: destaque ? "rgba(255,255,255,0.82)" : "#526760",
              fontSize: { xs: "0.73rem", sm: "0.76rem" },
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.15,
            }}
          >
            {titulo}
          </Typography>
        </Stack>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: destaque ? "#FFFFFF" : "#021B16",
              fontSize: destaque
                ? { xs: "1.55rem", sm: "1.8rem" }
                : { xs: "1.34rem", sm: "1.56rem" },
              fontWeight: 950,
              lineHeight: 1.08,
              overflowWrap: "anywhere",
            }}
          >
            {valor}
          </Typography>

          <Typography
            sx={{
              color: destaque ? "rgba(255,255,255,0.76)" : "#526760",
              fontSize: { xs: "0.8rem", sm: "0.84rem" },
              fontStyle: "italic",
              mt: 0.65,
              lineHeight: 1.35,
            }}
          >
            {detalhe}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
