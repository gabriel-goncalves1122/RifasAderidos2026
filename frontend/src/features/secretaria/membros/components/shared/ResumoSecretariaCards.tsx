import type { ReactNode } from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import GroupIcon from "@mui/icons-material/Group";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { aderidosMotion } from "@/shared/tokens/motion";
import { secretariaColors } from "../../../styles/colors";
import { surfaces } from "../../../styles/surfaces";

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

interface ResumoCardItem {
  label: string;
  valor: number;
  descricao: string;
  icon: ReactNode;
  color: string;
}

function ResumoCard({ item, featured }: { item: ResumoCardItem; featured: boolean }) {
  return (
    <Paper
      component="article"
      aria-label={`Resumo ${item.label}`}
      elevation={0}
      sx={{
        ...surfaces.cartaoResumo(featured),
        position: "relative",
        overflow: "hidden",
        p: { xs: 1.85, sm: 2.15 },
        borderRadius: 2.25,
        border: featured
          ? "1px solid rgba(255, 255, 255, 0.14)"
          : "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: featured
          ? "0 16px 34px rgba(6, 61, 49, 0.18)"
          : "0 12px 28px rgba(2, 27, 22, 0.07)",
        minWidth: 0,
        height: "100%",
        transition: [
          `transform ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
          `box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
          `border-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
        ].join(", "),
        gridColumn: {
          xs: featured ? "span 2" : "auto",
          sm: "auto",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: featured ? "rgba(255, 255, 255, 0.25)" : `${item.color}40`,
          boxShadow: featured
            ? "0 18px 42px rgba(6, 61, 49, 0.25)"
            : "0 18px 42px rgba(2, 27, 22, 0.11)",
        },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          animation: "none",
          "&:hover": {
            transform: "none",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 auto 0 0",
          width: 5,
          bgcolor: featured ? "#A8DCCB" : item.color,
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
              color: featured ? secretariaColors.verdeEscuro : item.color,
              bgcolor: featured ? secretariaColors.branco : `${item.color}18`,
              boxShadow: featured
                ? "0 10px 22px rgba(2, 27, 22, 0.20)"
                : "none",
            }}
          >
            {item.icon}
          </Box>

          <Typography
            sx={{
              color: featured ? "rgba(255,255,255,0.82)" : secretariaColors.cinzaTexto,
              fontSize: { xs: "0.73rem", sm: "0.76rem" },
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              lineHeight: 1.15,
            }}
          >
            {item.label}
          </Typography>
        </Stack>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              color: featured ? secretariaColors.branco : secretariaColors.pretoEsverdeado,
              fontSize: featured
                ? { xs: "1.55rem", sm: "1.8rem" }
                : { xs: "1.34rem", sm: "1.56rem" },
              fontWeight: 950,
              lineHeight: 1.08,
              overflowWrap: "anywhere",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {item.valor}
          </Typography>

          <Typography
            sx={{
              color: featured ? "rgba(255,255,255,0.76)" : secretariaColors.cinzaTexto,
              fontSize: { xs: "0.8rem", sm: "0.84rem" },
              fontStyle: "italic",
              mt: 0.65,
              lineHeight: 1.35,
            }}
          >
            {item.descricao}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function ResumoSecretariaCards({ resumo }: ResumoSecretariaCardsProps) {
  const theme = useTheme();

  const cards: ResumoCardItem[] = [
    {
      label: "Total",
      valor: resumo.total,
      descricao: "No painel",
      icon: <GroupIcon />,
      color: theme.palette.primary.dark,
    },
    {
      label: "Aderidos",
      valor: resumo.aderidos,
      descricao: "Completos",
      icon: <GroupsIcon />,
      color: theme.palette.success.dark,
    },
    {
      label: "Meios",
      valor: resumo.meioAderidos,
      descricao: "Parciais",
      icon: <PersonIcon />,
      color: theme.palette.warning.main,
    },
    {
      label: "Pendentes",
      valor: resumo.pendentes,
      descricao: "A revisar",
      icon: <HourglassEmptyIcon />,
      color: theme.palette.warning.dark,
    },
    {
      label: "Comissão",
      valor: resumo.comissao,
      descricao: "Equipe",
      icon: <AdminPanelSettingsIcon />,
      color: theme.palette.info.dark,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <ResumoCard key={card.label} item={card} featured={index === 0} />
      ))}
    </Box>
  );
}
