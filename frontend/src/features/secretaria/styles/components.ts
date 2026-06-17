import { secretariaColors } from "./colors";

export const secretariaComponents = {
  surface: {
    bgcolor: secretariaColors.branco,
    border: `1px solid ${secretariaColors.borda}`,
    borderRadius: 2,
    boxShadow: `0 14px 34px ${secretariaColors.sombra}`,
  },
  searchField: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "transparent",
      borderRadius: 2,
      fontFamily: "Inter, sans-serif",
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
      "&:hover fieldset": {
        borderColor: "rgba(0, 0, 0, 0.24)",
      },
      "&.Mui-focused fieldset": {
        borderColor: secretariaColors.verdeEscuro,
      },
    },
  },
  formField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: secretariaColors.branco,
    },
  },
  selectField: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: secretariaColors.branco,
    },
  },
  primaryAction: {
    borderRadius: 2,
    px: 2.5,
    fontWeight: 850,
  },
  secondaryAction: {
    borderRadius: 2,
    px: 2,
    fontWeight: 750,
  },
  focusRing: {
    "&:focus-visible": {
      outline: "3px solid",
      outlineColor: secretariaColors.verdeEscuro,
      outlineOffset: 2,
    },
  },
} as const;
