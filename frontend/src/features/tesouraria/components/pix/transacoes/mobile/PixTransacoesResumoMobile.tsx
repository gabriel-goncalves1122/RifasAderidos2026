// Legado: o resumo mobile antigo foi substituído pelos KPIs da primeira aba
// Pix. Mantido para compatibilidade enquanto a limpeza definitiva não for
// autorizada.
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Box, Paper, Stack, Typography } from "@mui/material";

import { colors } from "../../../../styles/colors";
import { typography } from "../../../../styles/typography";
import { PixTransacoesResumo } from "../../../../types/pixTransacoes";
import { formatarMoedaPix } from "../../../../utils/pixTransacoesUtils";

interface PixTransacoesResumoMobileProps {
  resumo: PixTransacoesResumo;
}

function ResumoItem({
  titulo,
  valor,
  detalhe,
  tipo = "normal",
}: {
  titulo: string;
  valor: string;
  detalhe: string;
  tipo?: "normal" | "alerta";
}) {
  const isAlerta = tipo === "alerta";

  return (
    <Paper
      elevation={0}
      sx={{
        minWidth: 190,
        p: 1.75,
        borderRadius: 2.25,
        bgcolor: isAlerta ? colors.alertaSuave : colors.branco,
        border: isAlerta
          ? "1px solid rgba(143, 104, 0, 0.22)"
          : "1px solid rgba(2, 27, 22, 0.10)",
        scrollSnapAlign: "start",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="flex-start">
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
            bgcolor: isAlerta ? "#FFF1CC" : colors.verdeClaro,
            color: isAlerta ? colors.alertaTexto : colors.verdeEscuro,
          }}
        >
          {isAlerta ? (
            <ReportProblemOutlinedIcon fontSize="small" />
          ) : (
            <PaidOutlinedIcon fontSize="small" />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{ ...typography.label, fontWeight: 850 }}
          >
            {titulo}
          </Typography>

          <Typography
            sx={{
              color: isAlerta ? colors.alertaTexto : colors.pretoEsverdeado,
              fontSize: "1.18rem",
              fontWeight: 950,
              lineHeight: 1.1,
              mt: 0.35,
            }}
          >
            {valor}
          </Typography>

          <Typography
            sx={{
              color: colors.cinzaTexto,
              fontSize: "0.76rem",
              mt: 0.35,
              lineHeight: 1.25,
            }}
          >
            {detalhe}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function PixTransacoesResumoMobile({ resumo }: PixTransacoesResumoMobileProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        overflowX: "auto",
        pb: 0.5,
        scrollSnapType: "x mandatory",
        WebkitOverflowScrolling: "touch",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <ResumoItem
        titulo="Recebido"
        valor={formatarMoedaPix(resumo.totalRecebido)}
        detalhe={`${resumo.quantidadePagas} Pix pagos`}
      />

      <ResumoItem
        titulo="Não vinculadas"
        valor={`${resumo.quantidadeNaoIdentificadas}`}
        detalhe={formatarMoedaPix(resumo.totalDivergente)}
        tipo="alerta"
      />

      <ResumoItem
        titulo="Ticket médio"
        valor={formatarMoedaPix(resumo.ticketMedio)}
        detalhe="Média dos Pix pagos"
      />
    </Box>
  );
}
