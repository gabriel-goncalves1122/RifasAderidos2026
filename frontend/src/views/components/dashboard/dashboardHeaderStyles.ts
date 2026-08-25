// ============================================================================
// ARQUIVO: frontend/src/views/components/dashboard/dashboardHeaderStyles.ts
// ============================================================================

export const dashboardHeaderStyles = {
  appBar: {
    position: "relative",
    zIndex: 1200,
    bgcolor: "#063D31",
    color: "#FFFFFF",
    borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
    boxShadow: "0 10px 30px rgba(2, 27, 22, 0.18)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-100vh",
      left: 0,
      right: 0,
      height: "100vh",
      backgroundColor: "#063D31",
      zIndex: -1,
    },
  },

  statusBarUnderlay: {
    display: {
      xs: "block",
      sm: "none",
    },
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "env(safe-area-inset-top, 0px)",
    zIndex: 1301,
    bgcolor: "#063D31",
    pointerEvents: "none",

    "@supports (-webkit-touch-callout: none)": {
      height: "max(env(safe-area-inset-top), 20px)",
      minHeight: 20,
    },
  },

  statusBarSpacer: {
    display: {
      xs: "block",
      sm: "none",
    },
    height: "env(safe-area-inset-top, 0px)",
    minHeight: 0,
    flexShrink: 0,
    bgcolor: "#063D31",

    "@supports (-webkit-touch-callout: none)": {
      height: "max(env(safe-area-inset-top), 20px)",
      minHeight: 20,
    },
  },

  toolbar: {
    minHeight: { xs: 62, sm: 68 },
    px: { xs: 2, sm: 3 },
    gap: 1.5,
  },

  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 2.5,
    color: "#FFFFFF",
    bgcolor: "rgba(255, 255, 255, 0.13)",
    border: "1px solid rgba(255, 255, 255, 0.22)",
    "&:hover": {
      bgcolor: "rgba(255, 255, 255, 0.20)",
    },
  },

  titleArea: {
    flexGrow: 1,
    minWidth: 0,
  },

  eyebrow: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: "0.72rem",
    fontWeight: 850,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    lineHeight: 1,
    mb: 0.5,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: 950,
    fontSize: { xs: "1rem", sm: "1.25rem" },
    letterSpacing: 0.2,
    lineHeight: 1.1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  subtitle: {
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: "0.82rem",
    mt: 0.35,
    display: { xs: "none", md: "block" },
  },

  tabsWrapper: {
    px: { xs: 1, sm: 2.5 },
    bgcolor: "#F6F8F7",
    borderTop: "1px solid rgba(2, 27, 22, 0.06)",
  },

  tabs: {
    minHeight: 58,
    "& .MuiTabs-indicator": {
      height: 3,
      borderRadius: 999,
      bgcolor: "#063D31",
    },
    "& .MuiTab-root": {
      minHeight: 58,
      textTransform: "none",
      fontWeight: 850,
      color: "#526760",
      px: { xs: 1.5, sm: 2.5 },
      gap: 0.8,
    },
    "& .MuiTab-root.Mui-selected": {
      color: "#063D31",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.15rem",
    },
  },
};
