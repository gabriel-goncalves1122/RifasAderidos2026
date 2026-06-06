import { Box, Tab, Tabs } from "@mui/material";

import { ABAS_PIX } from "./pixTabsConfig";
import { PixTabsProps } from "./pixTabsTypes";

export function PixTabsMobile({
  abaAtual,
  onChangeAba,
}: PixTabsProps) {
  const abasMobile = ABAS_PIX.filter(
    (aba) => aba.value !== "conciliacao",
  );
  const abaSelecionada = abasMobile.some((aba) => aba.value === abaAtual)
    ? abaAtual
    : "visao-geral";

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 6,
        mb: 2,
        bgcolor: "#FFFFFF",
        borderRadius: 2.5,
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 10px 24px rgba(2, 27, 22, 0.07)",
        px: 1,
        py: 0.75,
      }}
    >
      <Tabs
        aria-label="Navegação da tesouraria"
        value={abaSelecionada}
        onChange={(_, novaAba) => onChangeAba(novaAba)}
        variant="scrollable"
        scrollButtons={false}
        sx={{
          minHeight: 44,
          "& .MuiTabs-indicator": {
            display: "none",
          },
          "& .MuiTab-root": {
            minHeight: 42,
            minWidth: "auto",
            mr: 0.75,
            px: 1.35,
            py: 0.75,
            borderRadius: 999,
            border: "1px solid rgba(6, 61, 49, 0.14)",
            bgcolor: "#F6F8F7",
            textTransform: "none",
            fontWeight: 850,
            color: "#526760",
            gap: 0.75,
            transition:
              "background-color 160ms ease, color 160ms ease, border-color 160ms ease",
          },
          "& .MuiTab-root.Mui-selected": {
            bgcolor: "#063D31",
            borderColor: "#063D31",
            color: "#FFFFFF !important",
          },
          "& .MuiTab-iconWrapper": {
            mr: 0.5,
          },
        }}
      >
        {abasMobile.map((aba) => (
          <Tab
            key={aba.value}
            value={aba.value}
            icon={aba.icon}
            iconPosition="start"
            label={aba.label}
          />
        ))}
      </Tabs>
    </Box>
  );
}
