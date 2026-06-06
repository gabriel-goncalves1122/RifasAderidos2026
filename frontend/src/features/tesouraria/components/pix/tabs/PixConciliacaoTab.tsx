import { Box, Paper, Typography } from "@mui/material";

import { PixTransacoesTable } from "../transacoes/desktop/PixTransacoesTable";
import { PixTransacao } from "../../../types/pixTransacoes";

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
          p: 2.5,
          mb: 2,
          borderRadius: 3,
          bgcolor: "#FFFFFF",
          border: "1px solid rgba(2, 27, 22, 0.10)",
        }}
      >
        <Typography sx={{ color: "#021B16", fontWeight: 900 }}>
          Pendências de conciliação
        </Typography>

        <Typography sx={{ color: "#526760", fontSize: "0.9rem", mt: 0.5 }}>
          Transações Pix que precisam de vínculo com venda, aderido ou rifas.
          Esta aba concentra pagamentos não identificados, pendentes de
          conciliação ou divergentes.
        </Typography>
      </Paper>

      <PixTransacoesTable transacoes={pendentes} />
    </Box>
  );
}
