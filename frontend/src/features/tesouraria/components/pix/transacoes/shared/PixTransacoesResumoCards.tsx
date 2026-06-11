
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box, Paper, Typography } from "@mui/material";

import { colors } from "../../../../styles/colors";
import { surfaces } from "../../../../styles/surfaces";
import { typography } from "../../../../styles/typography";
import { PixTransacoesResumo } from "../../../../types/pixTransacoes";
import { formatarMoedaPix } from "../../../../utils/pixTransacoesUtils";

interface PixTransacoesResumoCardsProps {
  resumo: PixTransacoesResumo;
}

function CardResumo({
  titulo,
  valor,
  descricao,
  icone,
}: {
  titulo: string;
  valor: string;
  descricao: string;
  icone: React.ReactNode;
}) {
  return (
    <Paper
      elevation={0}
      sx={{ ...surfaces.paperComSombra, p: 2 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography
            sx={{ ...typography.label, fontSize: "0.76rem", fontWeight: 850 }}
          >
            {titulo}
          </Typography>

          <Typography
            sx={{
              color: colors.pretoEsverdeado,
              fontSize: "1.45rem",
              fontWeight: 950,
              lineHeight: 1.1,
              mt: 0.7,
            }}
          >
            {valor}
          </Typography>

          <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.82rem", mt: 0.5 }}>
            {descricao}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            color: colors.verdeEscuro,
            bgcolor: colors.verdeClaro,
          }}
        >
          {icone}
        </Box>
      </Box>
    </Paper>
  );
}

export function PixTransacoesResumoCards({ resumo }: PixTransacoesResumoCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          lg: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      <CardResumo
        titulo="Aguardando validação"
        valor={`${resumo.quantidadeAguardandoValidacao}`}
        descricao="Transações pendentes de análise"
        icone={<AccountBalanceWalletIcon />}
      />

      <CardResumo
        titulo="Validadas"
        valor={`${resumo.quantidadeAceitas}`}
        descricao="Confirmadas e vinculadas a aderido/rifa"
        icone={<TaskAltOutlinedIcon />}
      />

      <CardResumo
        titulo="Pendências de vínculo"
        valor={`${resumo.quantidadeSemVinculo}`}
        descricao="Recebidas mas não associadas a aderido"
        icone={<LinkOffOutlinedIcon />}
      />

      <CardResumo
        titulo="Canceladas/Erros"
        valor={`${resumo.quantidadeCanceladas + resumo.quantidadeNegadas}`}
        descricao={formatarMoedaPix(resumo.totalCancelado)}
        icone={<ReportProblemOutlinedIcon />}
      />
    </Box>
  );
}
