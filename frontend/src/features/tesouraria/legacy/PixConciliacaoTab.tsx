import { Box, Paper, Typography } from "@mui/material";

import { PixTransacoesTable } from "../transacoes/desktop/PixTransacoesTable";
import { PixTransacao } from "../../../types/pixTransacoes";
import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";

interface PixConciliacaoTabProps {
  transacoes: PixTransacao[];
}

export function PixConciliacaoTab({
  transacoes,
}: PixConciliacaoTabProps) {
  const pendentes = transacoes.filter((transacao) =>
    ["pendente", "nao_identificada", "divergente"].includes(
      transacao.statusConciliacao,
    ),
  );

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          ...surfaces.paper,
          p: 2.5,
          mb: 2,
        }}
      >
        <Typography sx={{ ...typography.titulo, fontWeight: 900 }}>
          Pendências de conciliação
        </Typography>

        <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.9rem", mt: 0.5 }}>
          Transações Pix que precisam de vínculo com venda, aderido ou rifas.
          Esta aba concentra pagamentos não identificados, pendentes de
          conciliação ou divergentes.
        </Typography>
      </Paper>

      <PixTransacoesTable transacoes={pendentes} />
    </Box>
  );
}
