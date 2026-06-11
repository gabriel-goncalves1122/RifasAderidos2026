import { colors } from "./colors";

export const surfaces = {
  paper: {
    elevation: 0 as const,
    borderRadius: 2.25,
    border: "1px solid rgba(2, 27, 22, 0.10)",
    bgcolor: colors.branco,
  },
  paperComSombra: {
    elevation: 0 as const,
    borderRadius: 2.25,
    border: "1px solid rgba(2, 27, 22, 0.10)",
    bgcolor: colors.branco,
    boxShadow: "0 12px 30px rgba(2, 27, 22, 0.05)",
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
  cartaoResumo: (destaque = false) => ({
    p: 1.25,
    borderRadius: 2,
    bgcolor: destaque ? colors.verdeEscuro : colors.branco,
    border: destaque
      ? "none"
      : "1px solid rgba(2, 27, 22, 0.08)",
  }),
  cartaoInfo: {
    p: 1.35,
    borderRadius: 2,
    bgcolor: colors.fundoSuave,
    border: "1px solid rgba(2, 27, 22, 0.08)",
    minWidth: 0,
  },
  fundoVerdeClaro: {
    bgcolor: colors.verdeClaro,
    color: colors.verdeEscuro,
    border: "1px solid rgba(6, 61, 49, 0.18)",
  },
  containerPadding: {
    pb: 4,
    px: { xs: 0, sm: 1.25, md: 0.5 },
  },
};
