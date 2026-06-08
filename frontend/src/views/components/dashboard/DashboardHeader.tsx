// ============================================================================
// ARQUIVO: frontend/src/views/components/dashboard/DashboardHeader.tsx
// ============================================================================
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";

import { Contexto } from "@/views/pages/DashboardPage";
import { DashboardContextTabs } from "./DashboardContextTabs";
import { DASHBOARD_HEADER_CONFIG } from "./dashboardHeaderConfig";
import { dashboardHeaderStyles } from "./dashboardHeaderStyles";

interface DashboardHeaderProps {
  contextoAtual: Contexto;
  abaAtual: number;
  isMobile: boolean;
  onOpenMenu: () => void;
  onChangeAba: (novaAba: number) => void;
}

export function DashboardHeader({
  contextoAtual,
  abaAtual,
  isMobile,
  onOpenMenu,
  onChangeAba,
}: DashboardHeaderProps) {
  const config = DASHBOARD_HEADER_CONFIG[contextoAtual];

  return (
    <AppBar position="static" elevation={0} sx={dashboardHeaderStyles.appBar}>
      <Toolbar sx={dashboardHeaderStyles.toolbar}>
        <IconButton
          size="large"
          edge="start"
          aria-label="Abrir menu"
          data-testid="dashboard-menu-button"
          onClick={onOpenMenu}
          sx={dashboardHeaderStyles.menuButton}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={dashboardHeaderStyles.titleArea}>
          <Typography sx={dashboardHeaderStyles.eyebrow}>
            {config.eyebrow}
          </Typography>

          <Typography component="h1" sx={dashboardHeaderStyles.title}>
            {config.titulo}
          </Typography>

          <Typography sx={dashboardHeaderStyles.subtitle}>
            {config.subtitulo}
          </Typography>
        </Box>
      </Toolbar>

      <DashboardContextTabs
        contextoAtual={contextoAtual}
        abaAtual={abaAtual}
        isMobile={isMobile}
        onChangeAba={onChangeAba}
      />
    </AppBar>
  );
}
