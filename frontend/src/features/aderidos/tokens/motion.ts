export const aderidosMotion = {
  easing: {
    easeOut: "cubic-bezier(0.33, 0.66, 0.66, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  duration: {
    short: "100ms",
    standard: "200ms",
    medium: "220ms",
    long: "300ms",
    progress: "400ms",
  },
} as const;

export const reduceMotionSx = {
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
    animation: "none",
  },
} as const;
