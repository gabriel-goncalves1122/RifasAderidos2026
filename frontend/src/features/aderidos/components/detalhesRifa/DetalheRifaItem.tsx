// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/detalhesRifa/DetalheRifaItem.tsx
// ============================================================================
import { Box, Stack, Typography } from "@mui/material";
import { colors } from "@/shared/tokens/colors";

interface DetalheRifaItemProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}

export function DetalheRifaItem({ label, value, icon }: DetalheRifaItemProps) {
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        py: 0.5,
      }}
    >
      {icon && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: "rgba(6, 61, 49, 0.04)",
            color: colors.verdeEscuro,
            "& svg": {
              fontSize: "1.25rem",
            },
          }}
        >
          {icon}
        </Box>
      )}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: colors.cinzaTexto,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontSize: "0.68rem",
          }}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: colors.pretoEsverdeado,
            fontWeight: 700,
            fontSize: "0.9rem",
            wordBreak: "break-word",
          }}
        >
          {value || "Não informado"}
        </Typography>
      </Box>
    </Stack>
  );
}
