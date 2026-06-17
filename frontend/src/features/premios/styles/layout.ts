import { SxProps, Theme } from "@mui/material";

export const layout: Record<string, SxProps<Theme>> = {
  container: {
    maxWidth: 980,
    mx: "auto",
    px: { xs: 2, sm: 3, md: 4 },
    pb: 6,
    pt: 2,
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 3,
    flexWrap: "wrap",
    gap: 2,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
    },
    gap: { xs: 1.5, md: 2 },
  },
  emptyState: {
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    px: 2,
    py: 4,
    borderRadius: 2,
    border: "1px dashed rgba(6, 61, 49, 0.18)",
    bgcolor: "rgba(255, 255, 255, 0.72)",
  },
};
