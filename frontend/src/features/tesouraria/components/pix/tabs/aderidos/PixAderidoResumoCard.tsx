import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { PixAderidoResumo } from "../../../../utils/pixAderidosUtils";
import { formatarMoedaPix } from "../../../../utils/pixTransacoesUtils";

interface PixAderidoResumoCardProps {
  aderido: PixAderidoResumo;
  onSelecionar: (aderido: PixAderidoResumo) => void;
}

export function PixAderidoResumoCard({
  aderido,
  onSelecionar,
}: PixAderidoResumoCardProps) {
  return (
    <Paper
      component="button"
      type="button"
      elevation={0}
      aria-label={`Abrir detalhes de arrecadação de ${aderido.nome}`}
      onClick={() => onSelecionar(aderido)}
      sx={{
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 10px 24px rgba(2, 27, 22, 0.06)",
        textAlign: "left",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          borderColor: "rgba(6, 61, 49, 0.28)",
          bgcolor: "#F6F8F7",
          boxShadow: "0 16px 34px rgba(2, 27, 22, 0.12)",
          transform: "translateY(-2px)",
          "& .pix-aderido-seta": {
            opacity: 1,
            transform: "translateX(2px)",
          },
        },
        "&:focus-visible": {
          outline: "2px solid #063D31",
          outlineOffset: 2,
        },
      }}
    >
      <Stack spacing={1.25}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 900,
                fontSize: "1rem",
                lineHeight: 1.2,
                overflowWrap: "anywhere",
              }}
            >
              {aderido.nome}
            </Typography>

            <Typography sx={{ color: "#526760", fontSize: "0.78rem", mt: 0.25 }}>
              {aderido.cpfLabel}
            </Typography>
          </Box>

          <Box
            className="pix-aderido-seta"
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              color: "#063D31",
              bgcolor: "#EAF3EF",
              flexShrink: 0,
              opacity: 0.78,
              transition: "opacity 160ms ease, transform 160ms ease",
            }}
          >
            <ArrowRightIcon />
          </Box>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#526760",
                fontSize: "0.7rem",
                fontWeight: 850,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Arrecadado
            </Typography>
            <Typography
              sx={{
                color: "#063D31",
                fontWeight: 950,
                fontSize: "1.12rem",
                mt: 0.35,
              }}
            >
              {formatarMoedaPix(aderido.totalArrecadado)}
            </Typography>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#526760",
                fontSize: "0.7rem",
                fontWeight: 850,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Restantes
            </Typography>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 950,
                fontSize: "1.12rem",
                mt: 0.35,
              }}
            >
              {aderido.rifasRestantes} rifas
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
