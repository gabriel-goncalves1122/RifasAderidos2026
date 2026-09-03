import { useMediaQuery, useTheme } from "@mui/material";

export function usePremiosLayout() {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDesktop = !isMobile;

  return {
    isMobile,
    isDesktop,
  };
}
