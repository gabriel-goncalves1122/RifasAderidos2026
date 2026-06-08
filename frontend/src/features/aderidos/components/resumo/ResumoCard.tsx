import { Box, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";

interface ResumoCardProps {
  icon: ReactNode;
  label: string;
  valor: ReactNode;
  descricao: string;
  acao?: ReactNode;
  variant?: "default" | "alert" | "success";
}

function obterIconStyle(variant: ResumoCardProps["variant"]) {
  if (variant === "alert") return painelAderidoStyles.resumoIconBoxAlerta;
  if (variant === "success") return painelAderidoStyles.resumoIconBoxOk;

  return {};
}

export function ResumoCard({
  icon,
  label,
  valor,
  descricao,
  acao,
  variant = "default",
}: ResumoCardProps) {
  return (
    <Box sx={painelAderidoStyles.resumoCompactoItem}>
      <Stack sx={painelAderidoStyles.resumoMetaLinha}>
        <Box
          sx={{
            ...painelAderidoStyles.resumoIconBox,
            ...obterIconStyle(variant),
          }}
        >
          {icon}
        </Box>

        <Typography sx={painelAderidoStyles.resumoCardLabel}>
          {label}
        </Typography>
      </Stack>

      <Box sx={painelAderidoStyles.resumoConteudoLinha}>
        <Typography
          sx={{
            ...painelAderidoStyles.resumoCardValor,
            ...(variant === "alert" ? { color: "#6B4A00" } : {}),
          }}
        >
          {valor}
        </Typography>

        <Typography sx={painelAderidoStyles.resumoCardDescricao}>
          {descricao}
        </Typography>

        {acao}
      </Box>
    </Box>
  );
}
