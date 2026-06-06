import { useMediaQuery, useTheme } from "@mui/material";

import { PixTabsDesktop } from "./PixTabsDesktop";
import { PixTabsMobile } from "./PixTabsMobile";
import { PixTabsProps } from "./pixTabsTypes";

export function PixTabs(props: PixTabsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return isMobile ? (
    <PixTabsMobile {...props} />
  ) : (
    <PixTabsDesktop {...props} />
  );
}
