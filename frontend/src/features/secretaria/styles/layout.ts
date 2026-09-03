export const layout = {
  pageContainer: {
    pb: 5,
  },
  filterBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    mb: 3,
  },
  filterBarMobile: {
    display: "flex",
    gap: 1,
    mb: 2,
  },
  gridDetail: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
    gap: 2,
  },
  resumoGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(5, 1fr)" },
    gap: 2,
    mb: 3,
  },
} as const;
