import { Box, Typography, Button, keyframes } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { HeroBanner } from "../shared/HeroBanner";
import { HeroPremioCard } from "./HeroPremioCard";
import { PremioCard } from "../shared/PremioCard";
import { PremioSkeleton } from "../shared/PremioSkeleton";

import { layout } from "../../styles/layout";
import { typographyScale as typography } from "@/shared/tokens/typography";
import { components } from "@/shared/tokens/components";
import type { PremioData } from "../../types/premio";
import type { InfoSorteio } from "../../types/sorteio";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface PremiosMobileViewProps {
  carregando: boolean;
  premioHero: PremioData | undefined;
  premiosRest: PremioData[];
  infoSorteio: InfoSorteio;
  isAdmin: boolean;
  onEditarHeader: () => void;
  onAbrirModalPremio: (premio?: PremioData) => void;
}

export const PremiosMobileView = ({
  carregando,
  premioHero,
  premiosRest,
  infoSorteio,
  isAdmin,
  onEditarHeader,
  onAbrirModalPremio,
}: PremiosMobileViewProps) => {
  const animSx = (delay = 0) => ({
    animation: `${fadeInUp} 400ms both`,
    animationDelay: `${delay}ms`,
  });

  if (carregando) {
    return (
      <Box sx={layout.container}>
        <Box sx={layout.cardsGrid}>
          {[1, 2, 3].map((i) => (
            <PremioSkeleton key={i} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={layout.container}>
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={isAdmin}
        onEditClick={onEditarHeader}
      />

      <Box sx={layout.sectionHeader}>
        <Typography sx={typography.secaoTitulo}>Prêmios</Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => onAbrirModalPremio()}
            sx={components.botaoNovoPremio}
          >
            Novo Prêmio
          </Button>
        )}
      </Box>

      {premioHero && (
        <Box sx={{ mb: 2, ...animSx() }}>
          <HeroPremioCard
            premio={premioHero}
            isAdmin={isAdmin}
            onEditClick={onAbrirModalPremio}
          />
        </Box>
      )}

      {premiosRest.length > 0 && (
        <Box sx={layout.cardsGrid}>
          {premiosRest.map((premio, index) => (
            <Box key={premio.id} sx={animSx((index + 1) * 60)}>
              <PremioCard
                premio={premio}
                isAdmin={isAdmin}
                onEditClick={onAbrirModalPremio}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
