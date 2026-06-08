import { ReactNode } from "react";
import { Paper, Stack, Typography } from "@mui/material";

interface DesempenhoChartCardProps {
  titulo: string;
  subtitulo?: string;
  children: ReactNode;
  compacto?: boolean;
}

export function DesempenhoChartCard({
  titulo,
  subtitulo,
  children,
  compacto = false,
}: DesempenhoChartCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: compacto ? { xs: 1.85, sm: 2 } : { xs: 2, sm: 2.65 },
        borderRadius: compacto ? 2 : 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 14px 34px rgba(2, 27, 22, 0.07)",
        minWidth: 0,
      }}
    >
      <Stack spacing={compacto ? 1.5 : 2}>
        <Stack
          spacing={0.45}
          sx={{
            pb: compacto ? 0.25 : 0.5,
            borderBottom: "1px solid rgba(2, 27, 22, 0.07)",
          }}
        >
          <Typography
            sx={{
              color: "#021B16",
              fontWeight: 950,
              fontSize: compacto ? "1.05rem" : "1.18rem",
              lineHeight: 1.15,
            }}
          >
            {titulo}
          </Typography>

          {subtitulo && (
            <Typography
              sx={{
                color: "#526760",
                fontSize: compacto ? "0.82rem" : "0.92rem",
                fontStyle: "italic",
                lineHeight: 1.35,
              }}
            >
              {subtitulo}
            </Typography>
          )}
        </Stack>

        {children}
      </Stack>
    </Paper>
  );
}
