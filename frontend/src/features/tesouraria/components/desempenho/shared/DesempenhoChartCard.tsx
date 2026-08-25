import { ReactNode } from "react";
import { Paper, Stack, Typography } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";

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
        ...surfaces.paper,
        p: compacto ? { xs: 1.85, sm: 2 } : { xs: 2, sm: 2.65 },
        borderRadius: compacto ? 2 : 2.25,
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
              ...typography.titulo,
              fontSize: compacto ? "1.05rem" : "1.18rem",
              lineHeight: 1.15,
            }}
          >
            {titulo}
          </Typography>

          {subtitulo && (
            <Typography
              sx={{
                color: colors.cinzaTexto,
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
