// ============================================================================
// ARQUIVO: frontend/src/views/components/HeroBanner.tsx
// RESPONSABILIDADE: Exibir o cabeçalho do sorteio com a data e título.
// ============================================================================
import React from "react";
import { Paper, Box, Typography, IconButton } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const formatarDataExtenso = (dataIso: string) => {
  if (!dataIso || !dataIso.includes("-")) return dataIso;
  const [ano, mes, dia] = dataIso.split("-");
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
};

export const HeroBanner = ({ infoSorteio, isAdmin, onEditClick }: any) => (
  <Paper
    elevation={6}
    sx={{
      p: { xs: 3, md: 5 },
      mb: 5,
      borderRadius: 4,
      background:
        "linear-gradient(135deg, var(--cor-verde-fundo) 0%, #1a3c2f 100%)",
      color: "white",
      position: "relative",
      borderBottom: "5px solid var(--cor-dourado-brilho)",
      overflow: "hidden",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        top: -50,
        right: -50,
        opacity: 0.05,
        pointerEvents: "none",
      }}
    >
      <EmojiEventsIcon sx={{ fontSize: 300 }} />
    </Box>

    {isAdmin && (
      <IconButton
        onClick={onEditClick}
        aria-label="Editar Cabeçalho"
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(255,255,255,0.1)",
          color: "var(--cor-dourado-brilho)",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <EditIcon />
      </IconButton>
    )}

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        zIndex: 1,
      }}
    >
      <EmojiEventsIcon
        sx={{
          fontSize: 70,
          mb: 1,
          color: "var(--cor-dourado-brilho)",
          filter: "drop-shadow(0px 4px 8px rgba(0,0,0,0.5))",
        }}
      />
      <Typography
        variant="h3"
        fontWeight="900"
        gutterBottom
        sx={{
          textTransform: "uppercase",
          letterSpacing: 1,
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        {infoSorteio.titulo}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          color: "secondary.light",
          fontWeight: "bold",
          fontSize: { xs: "1rem", md: "1.25rem" },
        }}
      >
        <CalendarMonthIcon /> Sorteio oficial:{" "}
        {formatarDataExtenso(infoSorteio.data)}
      </Typography>
      <Typography
        variant="body1"
        sx={{ maxWidth: 700, opacity: 0.9, fontSize: "1.1rem" }}
      >
        {infoSorteio.descricao}
      </Typography>
    </Box>
  </Paper>
);
