import { colors } from "@/shared/tokens/colors";
import { components } from "@/shared/tokens/components";

export const documentosSecretariaStyles = {
  header: {
    display: "flex",
    alignItems: { xs: "flex-start", sm: "center" },
    justifyContent: "space-between",
    gap: 2,
    mb: 2.5,
    pl: 2,
    borderLeft: `4px solid ${colors.verdeEscuro}`,
  },
  headerEyebrow: {
    color: colors.cinzaTexto,
    fontSize: "0.76rem",
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  toolbar: {
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "minmax(280px, 1fr) 260px" },
    gap: 1.5,
    mb: 2.5,
    position: "sticky",
    top: { xs: "calc(env(safe-area-inset-top, 0px) + 8px)", md: 12 },
    zIndex: 4,
    py: 1,
    bgcolor: "#F6F8F7",
  },
  areaSelect: {
    ...components.formField,
    minWidth: 0,
  },
  desktopGrid: {
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(3, minmax(0, 1fr))",
    },
    gap: 2,
  },
  mobileList: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 1.5,
    pb: 2,
  },
  card: {
    ...components.surface,
    height: "100%",
    overflow: "hidden",
    transition: "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
    "@media (prefers-reduced-motion: reduce)": {
      transition: "none",
    },
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "rgba(6, 61, 49, 0.28)",
      boxShadow: "0 18px 42px rgba(6, 61, 49, 0.14)",
    },
  },
  cardAction: {
    height: "100%",
    alignItems: "stretch",
    textAlign: "left",
    p: 2,
    ...components.focusRing,
  },
  previewFrame: {
    width: "100%",
    minHeight: { xs: "62dvh", sm: "68dvh" },
    border: `1px solid ${colors.borda}`,
    borderRadius: 2,
    bgcolor: colors.branco,
  },
} as const;
