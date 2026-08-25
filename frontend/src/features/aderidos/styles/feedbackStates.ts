import { SxProps, Theme } from "@mui/material";

import { colors } from "@/shared/tokens/colors";

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
    bgcolor: colors.fundoSuave,
  },

  statusHelpDialogTitle: {
    color: colors.pretoEsverdeado,
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
    color: colors.pretoEsverdeado,
    fontWeight: 800,
    lineHeight: 1.2,
  },

  statusHelpDescription: {
    mt: 0.25,
    color: colors.cinzaTexto,
    lineHeight: 1.35,
  },

  detalheDialogPaper: {
    borderRadius: {
      xs: "16px 16px 0 0",
      sm: 2.25,
    },
    m: {
      xs: 0,
      sm: 2,
    },
    position: {
      xs: "fixed",
      sm: "relative",
    },
    bottom: {
      xs: 0,
      sm: "auto",
    },
    width: {
      xs: "100%",
      sm: "auto",
    },
    bgcolor: colors.fundoSuave,
    overflow: "hidden",
  },

  detalheDialogTitle: {
    color: colors.pretoEsverdeado,
    fontWeight: 900,
    borderBottom: "1px solid rgba(2, 27, 22, 0.10)",
  },

  detalheInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
    p: 1.25,
    borderRadius: 2,
    bgcolor: colors.fundoSuave,
    border: "1px solid rgba(6, 61, 49, 0.08)",
  },

  detalheStatusBox: {
    display: "flex",
    flexDirection: "column",
    gap: 0.35,
    p: 1.25,
    borderRadius: 2,
    bgcolor: colors.verdeClaro,
    border: "1px solid rgba(6, 61, 49, 0.12)",
  },
};
