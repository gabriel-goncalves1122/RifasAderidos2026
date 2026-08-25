import { Box, Tab, Tabs, Typography } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { ABAS_PIX } from "./pixTabsConfig";
import { PixTabTooltip } from "./PixTabTooltip";
import { PixTabsProps } from "./pixTabsTypes";

export function PixTabsDesktop({
  abaAtual,
  onChangeAba,
}: PixTabsProps) {
  return (
    <Box
      sx={{
        mb: 3,
        ...surfaces.paper,
        px: 1,
      }}
    >
      <Tabs
        aria-label="Navegação da tesouraria"
        value={abaAtual}
        onChange={(_, novaAba) => onChangeAba(novaAba)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 54,
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 2,
            bgcolor: colors.verdeEscuro,
          },
          "& .MuiTab-root": {
            minHeight: 54,
            minWidth: 90,
            px: 2,
            py: 1.5,
            textTransform: "none",
            fontWeight: 850,
            color: colors.cinzaTexto,
            gap: 0.75,
          },
          "& .MuiTab-root.Mui-selected": {
            color: `${colors.verdeEscuro} !important`,
          },
          "& .MuiTab-iconWrapper": {
            mr: 0.5,
          },
        }}
      >
        {ABAS_PIX.map((aba) => (
          <Tab
            key={aba.value}
            value={aba.value}
            icon={aba.icon}
            iconPosition="start"
            label={
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                <Typography
                  component="span"
                  sx={{ fontSize: "inherit", fontWeight: "inherit" }}
                >
                  {aba.label}
                </Typography>
                <PixTabTooltip descricao={aba.descricao} />
              </Box>
            }
            data-testid={`pix-tab-${aba.value}`}
          />
        ))}
      </Tabs>
    </Box>
  );
}
