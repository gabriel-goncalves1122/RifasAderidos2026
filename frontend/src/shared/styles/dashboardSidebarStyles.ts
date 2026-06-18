export const dashboardSidebarStyles = {
  drawerPaper: {
    width: 280,
    bgcolor: "#F6F8F7",
    backgroundImage: "linear-gradient(#063D31, #063D31)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% env(safe-area-inset-top, 0px)",
    "@supports (-webkit-touch-callout: none)": {
      backgroundSize: "100% max(env(safe-area-inset-top), 20px)",
    },
  },

  root: {
    width: 280,
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    bgcolor: "#F6F8F7",
  },

  header: {
    p: 3,
    pt: "calc(24px + env(safe-area-inset-top, 0px))",
    bgcolor: "#063D31",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderBottom: "1px solid rgba(255, 255, 255, 0.14)",
    boxShadow: "0 14px 34px rgba(2, 27, 22, 0.18)",
    "@supports (-webkit-touch-callout: none)": {
      pt: "calc(24px + max(env(safe-area-inset-top), 20px))",
    },
  },

  cargo: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mt: 1,
    color: "rgba(255, 255, 255, 0.78)",
    fontWeight: 750,
  },

  list: {
    mt: 1,
    px: 1,
  },

  itemButton: (selected: boolean) => ({
    borderRadius: 2,
    minHeight: 46,
    color: selected ? "#063D31" : "#526760",
    bgcolor: selected ? "#EAF3EF" : "transparent",
    "&:hover": {
      bgcolor: selected ? "#DDECE6" : "rgba(6, 61, 49, 0.06)",
    },
    "&.Mui-selected": {
      bgcolor: "#EAF3EF",
      "&:hover": {
        bgcolor: "#DDECE6",
      },
    },
  }),

  itemIcon: (selected: boolean) => ({
    color: selected ? "#063D31" : "#526760",
    minWidth: 42,
  }),

  divider: {
    mt: "auto",
    borderColor: "rgba(6, 61, 49, 0.10)",
  },
} as const;

