import { Box, Tab, Tabs } from "@mui/material";

import type { SecretariaTipoUsuarioTab } from "../../types/secretariaLocalTypes";
import { secretariaColors } from "../../../styles/colors";

interface SecretariaTipoUsuarioTabsProps {
  value: SecretariaTipoUsuarioTab;
  onChange: (value: SecretariaTipoUsuarioTab) => void;
}

export function SecretariaTipoUsuarioTabs({
  value,
  onChange,
}: SecretariaTipoUsuarioTabsProps) {
  return (
    <Box
      sx={{
        mb: 2,
        borderBottom: `1px solid ${secretariaColors.borda}`,
      }}
    >
      <Tabs
        value={value}
        onChange={(_, nextValue) => onChange(nextValue as SecretariaTipoUsuarioTab)}
        aria-label="Seções da secretaria"
        sx={{
          minHeight: 44,
          "& .MuiTab-root": {
            minHeight: 44,
            px: { xs: 1.5, sm: 2.5 },
            color: secretariaColors.cinzaTexto,
            fontWeight: 850,
          },
          "& .Mui-selected": {
            color: secretariaColors.verdeEscuro,
          },
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: 999,
            bgcolor: secretariaColors.verdeEscuro,
          },
        }}
      >
        <Tab
          value="aderidos"
          label="Aderidos"
          id="secretaria-tab-aderidos"
          aria-controls="secretaria-panel-aderidos"
        />
        <Tab
          value="comissao"
          label="Comissão"
          id="secretaria-tab-comissao"
          aria-controls="secretaria-panel-comissao"
        />
      </Tabs>
    </Box>
  );
}
