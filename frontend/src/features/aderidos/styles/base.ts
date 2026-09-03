import { SxProps, Theme } from "@mui/material";

import { colors } from "@/shared/tokens/colors";

export const painelAderidoBaseStyles: Record<string, SxProps<Theme>> = {
  page: {
    width: "100%",
    minHeight: "100%",
    bgcolor: colors.fundoSuave,
  },

  root: {
    width: "100%",
    maxWidth: 980,
    mx: "auto",
    px: {
      xs: 2,
      sm: 3,
      md: 4,
    },
    py: {
      xs: 2.5,
      md: 4,
    },
  },
};
