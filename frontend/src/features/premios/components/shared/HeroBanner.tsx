import { Paper, Box, Typography, IconButton, Chip } from "@mui/material";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";
import { reduceMotionSx } from "@/shared/tokens/motion";
import { formatarDataExtenso, calcularDiasRestantes } from "../../utils/dateUtils";
import type { InfoSorteio } from "../../types/sorteio";

interface HeroBannerProps {
  infoSorteio: InfoSorteio;
  isAdmin: boolean;
  onEditClick: () => void;
}

export const HeroBanner = ({ infoSorteio, isAdmin, onEditClick }: HeroBannerProps) => {
  const diasRestantes = calcularDiasRestantes(infoSorteio.data);

  const countdownLabel = () => {
    if (diasRestantes === null) return null;
    if (diasRestantes < 0) return "Sorteio realizado";
    if (diasRestantes === 0) return "Sorteio hoje!";
    if (diasRestantes === 1) return "Falta 1 dia";
    return `Faltam ${diasRestantes} dias`;
  };

  const countdownColor = () => {
    if (diasRestantes === null || diasRestantes! < 0) return "default";
    if (diasRestantes! <= 7) return "error";
    if (diasRestantes! <= 30) return "warning";
    return "success";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        ...surfaces.premioBanner,
        p: { xs: 3, md: 5 },
        mb: 5,
        bgcolor: colors.branco,
        color: colors.pretoEsverdeado,
        position: "relative",
        boxShadow: "0 16px 36px rgba(2, 27, 22, 0.05)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -40,
          right: -40,
          opacity: 0.03,
          color: colors.verdeForte,
          pointerEvents: "none",
        }}
      >
        <WorkspacePremiumIcon sx={{ fontSize: 220 }} />
      </Box>

      {isAdmin && (
        <IconButton
          onClick={onEditClick}
          aria-label="Editar Cabeçalho"
          sx={{
            position: "absolute",
            top: 12,
            right: 16,
            zIndex: 2,
            bgcolor: "rgba(2,27,22,0.06)",
            color: colors.verdeForte,
            "&:hover": { bgcolor: "rgba(2,27,22,0.12)" },
            ...reduceMotionSx,
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
          gap: 1.5,
        }}
      >
        <WorkspacePremiumIcon
          sx={{
            fontSize: 56,
            color: colors.verdeForte,
          }}
        />
        <Typography sx={typography.bannerTitulo}>
          {infoSorteio.titulo}
        </Typography>
        <Typography sx={typography.bannerData}>
          <CalendarMonthIcon sx={{ fontSize: 20 }} />
          Sorteio oficial: {formatarDataExtenso(infoSorteio.data)}
        </Typography>
        {countdownLabel() && (
          <Chip
            label={countdownLabel()}
            color={countdownColor()}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontSize: "0.72rem",
              height: 28,
              borderRadius: 1,
            }}
          />
        )}
        {infoSorteio.descricao && (
          <Typography sx={typography.bannerDescricao}>
            {infoSorteio.descricao}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};
