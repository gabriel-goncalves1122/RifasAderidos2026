import { Box, Tab, Tabs, Typography } from "@mui/material";

import { safeAreaStickyTop } from "@/shared/tokens/safeArea";
import { colors } from "../../../styles/colors";
import { surfaces } from "../../../styles/surfaces";
import { ABAS_PIX } from "./pixTabsConfig";
import { PixTabTooltip } from "./PixTabTooltip";
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
        ...safeAreaStickyTop,
        zIndex: 6,
        mb: 2,
        ...surfaces.paper,
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
            borderRadius: 2,
            border: "1px solid rgba(6, 61, 49, 0.14)",
            bgcolor: colors.fundoSuave,
            textTransform: "none",
            fontWeight: 850,
            color: colors.cinzaTexto,
            gap: 0.75,
            transition:
              "background-color 160ms ease, color 160ms ease, border-color 160ms ease",
          },
          "& .MuiTab-root.Mui-selected": {
            bgcolor: colors.verdeEscuro,
            borderColor: colors.verdeEscuro,
            color: `${colors.branco} !important`,
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
