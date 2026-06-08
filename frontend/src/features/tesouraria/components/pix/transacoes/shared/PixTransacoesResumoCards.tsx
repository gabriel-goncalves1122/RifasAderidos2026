
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { Box, Paper, Typography } from "@mui/material";

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
      sx={{
        p: 2,
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 10px 28px rgba(2, 27, 22, 0.06)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              color: "#526760",
              fontSize: "0.76rem",
              fontWeight: 850,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {titulo}
          </Typography>

          <Typography
            sx={{
              color: "#021B16",
              fontSize: "1.45rem",
              fontWeight: 950,
              lineHeight: 1.1,
              mt: 0.7,
            }}
          >
            {valor}
          </Typography>

          <Typography sx={{ color: "#526760", fontSize: "0.82rem", mt: 0.5 }}>
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
            color: "#063D31",
            bgcolor: "#EAF3EF",
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
        titulo="Para validar"
        valor={`${resumo.quantidadeAguardandoValidacao}`}
        descricao={`${resumo.quantidadePagas} Pix pagos ou legados`}
        icone={<PendingActionsIcon />}
      />

      <CardResumo
        titulo="Com rifas"
        valor={`${resumo.quantidadeComRifas}`}
        descricao={`${resumo.quantidadePagas} pagamentos confirmados`}
        icone={<ConfirmationNumberOutlinedIcon />}
      />

      <CardResumo
        titulo="Sem vínculo"
        valor={`${resumo.quantidadeSemVinculo}`}
        descricao={`${resumo.quantidadeNaoIdentificadas} não identificada(s)`}
        icone={<LinkOffOutlinedIcon />}
      />

      <CardResumo
        titulo="Pendentes do banco"
        valor={`${resumo.quantidadeSemConfirmacaoBancaria}`}
        descricao={formatarMoedaPix(resumo.totalPendente)}
        icone={<AccountBalanceWalletIcon />}
      />
    </Box>
  );
}
