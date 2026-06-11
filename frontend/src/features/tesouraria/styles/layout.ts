export const layout = {
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    py: 10,
  },
  gridDois: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
    gap: 1.25,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
    gap: { xs: 1.25, sm: 2 },
  },
  drawerPullHandle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    bgcolor: "rgba(2, 27, 22, 0.18)",
    mx: "auto",
  },
  drawerPaper: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    p: 2,
    bgcolor: "#FFFFFF",
  },
};
