import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { colors } from "../../styles/colors";
import { surfaces } from "../../styles/surfaces";
import { typography } from "../../styles/typography";
import { components } from "../../styles/components";
import { aderidosMotion, reduceMotionSx } from "@/shared/tokens/motion";
import type { PremioData } from "../../types/premio";

interface PremioCardProps {
  premio: PremioData;
  isAdmin: boolean;
  onEditClick: (premio: PremioData) => void;
}

export const PremioCard = ({ premio, isAdmin, onEditClick }: PremioCardProps) => (
  <Card
    elevation={0}
    sx={{
      ...surfaces.premioCard,
      position: "relative",
      transition: `transform ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
      ...reduceMotionSx,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 28px rgba(2, 27, 22, 0.10)",
      },
      "&:active": {
        transform: "scale(0.98)",
      },
    }}
  >
    {isAdmin && (
      <IconButton
        size="small"
        onClick={() => onEditClick(premio)}
        aria-label="Editar Prêmio"
        sx={{
          ...components.iconeEditar,
          top: 12,
        }}
      >
        <EditIcon fontSize="small" color="secondary" />
      </IconButton>
    )}

    {premio.imagem_url ? (
      <CardMedia
        component="img"
        height="200"
        image={premio.imagem_url}
        alt={premio.titulo}
        sx={{
          objectFit: "contain",
          bgcolor: colors.branco,
          p: 1.5,
        }}
      />
    ) : (
      <Box
        sx={{
          height: 200,
          bgcolor: colors.fundoSuave,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardGiftcardIcon sx={{ fontSize: 48, color: colors.cinzaIcone }} />
      </Box>
    )}

    <CardContent
      sx={{
        textAlign: "center",
        pt: 2.5,
        pb: 3.5,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Typography sx={typography.colocacao}>
        {premio.colocacao}
      </Typography>
      <Typography variant="h5" sx={typography.cardTitulo} gutterBottom>
        {premio.titulo}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: "auto", px: 1, lineHeight: 1.4 }}
      >
        {premio.descricao}
      </Typography>
    </CardContent>
  </Card>
);
