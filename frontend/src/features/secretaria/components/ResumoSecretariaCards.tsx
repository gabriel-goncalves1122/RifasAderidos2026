// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ResumoSecretariaCards.tsx
// ============================================================================
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export interface ResumoSecretaria {
  total: number;
  aderidos: number;
  meioAderidos: number;
  pendentes: number;
  comissao: number;
}

interface ResumoSecretariaCardsProps {
  resumo: ResumoSecretaria;
}

export function ResumoSecretariaCards({ resumo }: ResumoSecretariaCardsProps) {
  const theme = useTheme();

  const cards = [
    {
      label: "Total",
      valor: resumo.total,
      icon: <GroupIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: "Aderidos",
      valor: resumo.aderidos,
      icon: <GroupsIcon />,
      color: theme.palette.success.main,
    },
    {
      label: "Meio-aderidos",
      valor: resumo.meioAderidos,
      icon: <PersonIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Pendentes",
      valor: resumo.pendentes,
      icon: <HourglassEmptyIcon />,
      color: theme.palette.text.secondary,
    },
    {
      label: "Comissão",
      valor: resumo.comissao,
      icon: <AdminPanelSettingsIcon />,
      color: theme.palette.error.main,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card.label}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            border: "1px solid #e0e0e0",
            bgcolor: "#fff",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: card.color,
                bgcolor: `${card.color}14`,
              }}
            >
              {card.icon}
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                {card.label}
              </Typography>

              <Typography variant="h6" fontWeight="bold" lineHeight={1.1}>
                {card.valor}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
