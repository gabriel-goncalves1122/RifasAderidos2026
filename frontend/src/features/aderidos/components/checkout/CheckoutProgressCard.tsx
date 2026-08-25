import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, LinearProgress, Stack, Typography } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { aderidosMotion, reduceMotionSx } from "@/shared/tokens/motion";

interface CheckoutProgressCardProps {
  etapaAtual: number;
  progressoCheckout: number;
  etapaTitulo: string;
  etapaDescricao: string;
  pagamentoGerado: boolean;
}

export function CheckoutProgressCard({
  etapaAtual,
  progressoCheckout,
  etapaTitulo,
  etapaDescricao,
  pagamentoGerado,
}: CheckoutProgressCardProps) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={{ mb: 1 }}
      >
        <Typography
          sx={{
            color: colors.verdeEscuro,
            fontWeight: 900,
            fontSize: "0.82rem",
          }}
        >
          Etapa {etapaAtual} de 2
        </Typography>

        <Typography
          sx={{
            color: colors.cinzaTexto,
            fontWeight: 850,
            fontSize: "0.78rem",
          }}
        >
          {progressoCheckout}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progressoCheckout}
        aria-label={`Progresso do checkout: etapa ${etapaAtual} de 2`}
        sx={{
          height: 8,
          borderRadius: 2,
          bgcolor: colors.verdeClaro,
          "& .MuiLinearProgress-bar": {
            borderRadius: 2,
            background: "linear-gradient(90deg, #064532 0%, #0B5136 100%)",
            transition: `width ${aderidosMotion.duration.progress} ${aderidosMotion.easing.easeInOut}`,
            ...reduceMotionSx,
          },
        }}
      />

      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1.2 }}>
        {pagamentoGerado && (
          <CheckCircleIcon
            fontSize="small"
            sx={{ color: colors.verdeEscuro }}
          />
        )}

        <Box>
          <Typography
            sx={{
              color: colors.pretoEsverdeado,
              fontWeight: 900,
              lineHeight: 1.2,
            }}
          >
            {etapaTitulo}
          </Typography>
          <Typography
            sx={{
              color: colors.cinzaTexto,
              fontSize: "0.84rem",
              mt: 0.25,
            }}
          >
            {etapaDescricao}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
