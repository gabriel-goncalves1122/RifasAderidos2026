import { Box, Tab, Tabs, Typography } from "@mui/material";

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
        bgcolor: "#FFFFFF",
        borderRadius: 2.25,
        border: "1px solid rgba(2, 27, 22, 0.10)",
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
            bgcolor: "#063D31",
          },
          "& .MuiTab-root": {
            minHeight: 54,
            minWidth: 90,
            px: 2,
            py: 1.5,
            textTransform: "none",
            fontWeight: 850,
            color: "#526760",
            gap: 0.75,
          },
          "& .MuiTab-root.Mui-selected": {
            color: "#063D31 !important",
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
