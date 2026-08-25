import { Typography } from "@mui/material";
import { colors } from "@/shared/tokens/colors";

export function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: colors.verdeEscuro, fontWeight: 900 }}
    >
      {children}
    </Typography>
  );
}
