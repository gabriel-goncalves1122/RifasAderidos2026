import { SxProps, Theme } from "@mui/material";

import { painelAderidoBaseStyles } from "./base";
import { painelAderidoComponentStyles } from "./components";
import { painelAderidoFeedbackStyles } from "./feedbackStates";
import { painelAderidoSurfaceStyles } from "./surfaces";

export const painelAderidoStyles: Record<string, SxProps<Theme>> = {
  ...painelAderidoBaseStyles,
  ...painelAderidoComponentStyles,
  ...painelAderidoFeedbackStyles,
  ...painelAderidoSurfaceStyles,
};
