// ============================================================================
// ARQUIVO: frontend/src/views/components/PremioCard.tsx
// RESPONSABILIDADE: Renderizar o visual individual de cada prêmio (com fix de imagem).
// ============================================================================
import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

export const PremioCard = ({ premio, isAdmin, onEditClick }: any) => (
  <Card
    elevation={4}
    sx={{
      borderRadius: 3,
      position: "relative",
      borderTop: "6px solid var(--cor-dourado-brilho)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease",
      "&:hover": { transform: "translateY(-8px)", boxShadow: 8 },
    }}
  >
    {isAdmin && (
      <IconButton
        size="small"
        onClick={() => onEditClick(premio)}
        aria-label="Editar Prêmio"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "rgba(255,255,255,0.9)",
          boxShadow: 2,
          zIndex: 2,
        }}
      >
        <EditIcon fontSize="small" color="secondary" />
      </IconButton>
    )}

    {premio.imagem_url ? (
      <CardMedia
        component="img"
        height="220"
        image={premio.imagem_url}
        alt={premio.titulo}
        sx={{
          objectFit: "contain", // <-- FIX: Garante que a imagem não seja cortada
          bgcolor: "#fcfcfc", // Fundo clarinho para imagens transparentes
          p: 1, // Pequena margem interna
        }}
      />
    ) : (
      <Box
        sx={{
          height: 220,
          bgcolor: "#e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardGiftcardIcon sx={{ fontSize: 70, color: "#bdbdbd" }} />
      </Box>
    )}

    <CardContent
      sx={{
        textAlign: "center",
        pt: 3,
        pb: 4,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="overline"
        sx={{
          color: "secondary.main",
          fontWeight: "bold",
          fontSize: "0.9rem",
          display: "block",
          letterSpacing: 2,
        }}
      >
        {premio.colocacao}
      </Typography>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        color="primary.main"
      >
        {premio.titulo}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: "auto", px: 1 }}
      >
        {premio.descricao}
      </Typography>
    </CardContent>
  </Card>
);
