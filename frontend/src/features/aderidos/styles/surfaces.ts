import type { SxProps, Theme } from "@mui/material";

import { painelAderidoCarrinhoSurfaceStyles } from "./surfaceCarrinhoStyles";
import { painelAderidoResumoSurfaceStyles } from "./surfaceResumoStyles";

export const painelAderidoSurfaceStyles: Record<string, SxProps<Theme>> = {
  ...painelAderidoResumoSurfaceStyles,
  ...painelAderidoCarrinhoSurfaceStyles,
};
