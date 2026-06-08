import { SxProps, Theme } from "@mui/material";

import { painelAderidoBaseStyles } from "./painelAderidoBaseStyles";
import { painelAderidoCarrinhoStyles } from "./painelAderidoCarrinhoStyles";
import { painelAderidoFeedbackStyles } from "./painelAderidoFeedbackStyles";
import { painelAderidoResumoStyles } from "./painelAderidoResumoStyles";
import { painelAderidoRifasStyles } from "./painelAderidoRifasStyles";

export const painelAderidoStyles: Record<string, SxProps<Theme>> = {
  ...painelAderidoBaseStyles,
  ...painelAderidoCarrinhoStyles,
  ...painelAderidoFeedbackStyles,
  ...painelAderidoResumoStyles,
  ...painelAderidoRifasStyles,
};
