import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

import { colors } from "../../styles/colors";
import { surfaces } from "../../styles/surfaces";
import { typography } from "../../styles/typography";
import { components } from "../../styles/components";
import { aderidosMotion, reduceMotionSx } from "../../../aderidos/tokens/motion";
import type { PremioData } from "../../types/premio";

interface HeroPremioCardProps {
  premio: PremioData;
  isAdmin: boolean;
  onEditClick: (premio: PremioData) => void;
}

export const HeroPremioCard = ({ premio, isAdmin, onEditClick }: HeroPremioCardProps) => (
  <Card
    elevation={0}
    sx={{
      ...surfaces.premioCard,
      position: "relative",
      flexDirection: "row",
      transition: `transform ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
      ...reduceMotionSx,
      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 10px 28px rgba(2, 27, 22, 0.10)",
      },
      "&:active": {
        transform: "scale(0.99)",
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

    <Box sx={{ position: "relative", width: 280, flexShrink: 0 }}>
      {premio.imagem_url ? (
        <CardMedia
          component="img"
          image={premio.imagem_url}
          alt={premio.titulo}
          sx={{
            height: 260,
            objectFit: "contain",
            bgcolor: colors.branco,
            p: 1.5,
          }}
        />
      ) : (
        <Box
          sx={{
            height: 260,
            bgcolor: colors.fundoSuave,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WorkspacePremiumIcon sx={{ fontSize: 56, color: colors.verdeForte }} />
        </Box>
      )}
    </Box>

    <CardContent
      sx={{
        textAlign: "left",
        pt: 2.5,
        pb: 3.5,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "rgba(11, 122, 97, 0.1)",
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          width: "fit-content",
        }}
      >
        <WorkspacePremiumIcon sx={{ fontSize: 18, color: colors.verdeForte }} />
        <Typography
          sx={{
            color: colors.verdeForteEscuro,
            fontWeight: 900,
            fontSize: "0.78rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {premio.colocacao}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ ...typography.cardTitulo, fontSize: "1.6rem" }}>
        {premio.titulo}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mt: "auto", lineHeight: 1.5 }}
      >
        {premio.descricao}
      </Typography>
    </CardContent>
  </Card>
);
