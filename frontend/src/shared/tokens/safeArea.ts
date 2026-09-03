export const safeAreaStickyTop = {
  top: "env(safe-area-inset-top, 0px)",
  "@supports (-webkit-touch-callout: none)": {
    top: "max(env(safe-area-inset-top), 20px)",
  },
} as const;

