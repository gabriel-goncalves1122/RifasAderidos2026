import { SxProps, Theme } from "@mui/material";

export const painelAderidoFeedbackStyles: Record<string, SxProps<Theme>> = {
  emptyState: {
    minHeight: 260,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    px: 2,
    py: 4,
    borderRadius: 2,
    border: "1px dashed rgba(6, 61, 49, 0.18)",
    bgcolor: "rgba(255, 255, 255, 0.72)",
  },

  loadingContainer: {
    minHeight: "58vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: "#F6F8F7",
  },

  statusHelpDialogTitle: {
    color: "#021B16",
    fontWeight: 900,
    borderBottom: "1px solid rgba(2, 27, 22, 0.10)",
  },

  statusHelpDialogContent: {
    pt: 2.5,
  },

  statusHelpList: {
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  },

  statusHelpItem: {
    display: "grid",
    gridTemplateColumns: "32px 1fr",
    gap: 1.25,
    alignItems: "start",
  },

  statusHelpDot: {
    width: 28,
    height: 28,
    borderRadius: 2,
    border: "1.5px solid",
    boxShadow: "0 4px 10px rgba(2, 27, 22, 0.06)",
  },

  statusHelpLabel: {
    color: "#021B16",
    fontWeight: 850,
    lineHeight: 1.2,
  },

  statusHelpDescription: {
    mt: 0.25,
    color: "#526760",
    lineHeight: 1.35,
  },

  detalheDialogTitle: {
    color: "#021B16",
    fontWeight: 900,
    borderBottom: "1px solid rgba(2, 27, 22, 0.10)",
  },

  detalheInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
    p: 1.25,
    borderRadius: 2,
    bgcolor: "#F6F8F7",
    border: "1px solid rgba(6, 61, 49, 0.08)",
  },

  detalheStatusBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
    p: 1.25,
    borderRadius: 2,
    bgcolor: "#EAF3EF",
    border: "1px solid rgba(6, 61, 49, 0.12)",
  },
};
