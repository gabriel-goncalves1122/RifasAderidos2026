export const surfaces = {
  paper: {
    p: { xs: 2, sm: 3 },
    borderRadius: 2,
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
  },
  card: {
    borderRadius: 2,
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
    bgcolor: "#fff",
  },
  cartaoResumo: (destaque = false) => ({
    p: 1.25,
    borderRadius: 2,
    bgcolor: destaque ? "#063d31" : "#fff",
    border: destaque
      ? "none"
      : "1px solid rgba(2, 27, 22, 0.08)",
  }),
  panel: {
    width: 480,
    maxWidth: "90vw",
    height: "100%",
    bgcolor: "#fff",
    borderLeft: "1px solid",
    borderColor: "divider",
    display: "flex",
    flexDirection: "column",
  },
  tableHead: {
    bgcolor: "#f5f5f5",
  },
  filterChip: {
    borderRadius: 2,
    fontWeight: 500,
  },
} as const;
