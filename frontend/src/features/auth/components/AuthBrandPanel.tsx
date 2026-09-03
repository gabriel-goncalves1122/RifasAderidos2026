// ============================================================================
// ARQUIVO: frontend/src/features/auth/components/AuthBrandPanel.tsx
// ============================================================================
import { Box, Stack, Typography } from "@mui/material";

import { authStyles } from "../styles/authStyles";

export function AuthBrandPanel() {
  return (
    <Box component="aside" sx={authStyles.brandPanel}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Box
          component="img"
          src="/images/PNG (1080x1080).png"
          alt="Logo da Comissão"
          sx={authStyles.logoImage}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h5" fontWeight={850}>
            Comissão 2026
          </Typography>

          {/* <Typography variant="body2" sx={authStyles.brandDescription}>
            Gestão de rifas, aderidos, prêmios e pagamentos em um só lugar.
          </Typography> */}
        </Box>
      </Stack>
    </Box>
  );
}
