import { colors } from "./colors";

export const surfaces = {
  premioCard: {
    borderRadius: 2.25,
    border: "1px solid rgba(2, 27, 22, 0.10)",
    bgcolor: colors.branco,
    borderTop: `4px solid ${colors.verdeForte}`,
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
  },
  premioBanner: {
    borderRadius: 2.25,
    border: "none",
    borderBottom: `4px solid ${colors.verdeForte}`,
    overflow: "hidden" as const,
  },
  dialog: {
    borderRadius: 2.25,
    overflow: "hidden" as const,
  },
  dialogTitle: {
    color: colors.pretoEsverdeado,
    fontWeight: 950,
    pb: 1,
    borderBottom: "1px solid rgba(2, 27, 22, 0.08)",
  },
  dialogActions: {
    px: 3,
    py: 2,
    bgcolor: colors.fundoDialogActions,
  },
} as const;
