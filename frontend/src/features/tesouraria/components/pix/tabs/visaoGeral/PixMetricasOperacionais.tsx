import { Box, Typography } from "@mui/material";

import { PixTransacoesResumo } from "../../../../types/pixTransacoes";
import { formatarMoedaPix } from "../../../../utils/pixTransacoesUtils";

interface PixMetricasOperacionaisProps {
  resumo: PixTransacoesResumo;
}

export function PixMetricasOperacionais({
  resumo,
}: PixMetricasOperacionaisProps) {
  const metricasOperacionais = [
    {
      label: "Pagas",
      valor: resumo.quantidadePagas,
      detalhe: formatarMoedaPix(resumo.totalRecebido),
    },
    {
      label: "Pendentes",
      valor: resumo.quantidadeAguardando,
      detalhe: formatarMoedaPix(resumo.totalPendente),
    },
    {
      label: "Canceladas",
      valor: resumo.quantidadeCanceladas,
      detalhe: formatarMoedaPix(resumo.totalCancelado),
    },
    {
      label: "Não vinculadas",
      valor: resumo.quantidadeNaoIdentificadas,
      detalhe: formatarMoedaPix(resumo.totalDivergente),
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          sm: "repeat(4, minmax(120px, 1fr))",
          md: "repeat(4, minmax(92px, 1fr))",
        },
        gap: 1,
        minWidth: { md: 460 },
      }}
    >
      {metricasOperacionais.map((metrica) => (
        <Box
          key={metrica.label}
          sx={{
            borderRadius: 2,
            bgcolor: "#F6F8F7",
            border: "1px solid rgba(2, 27, 22, 0.08)",
            px: 1.25,
            py: 1,
            minHeight: 74,
          }}
        >
          <Typography
            sx={{
              color: "#526760",
              fontSize: "0.72rem",
              fontWeight: 850,
              textTransform: "uppercase",
            }}
          >
            {metrica.label}
          </Typography>

          <Typography
            sx={{
              color: "#021B16",
              fontWeight: 950,
              fontSize: "1.25rem",
              lineHeight: 1.1,
              mt: 0.35,
            }}
          >
            {metrica.valor}
          </Typography>

          <Typography
            sx={{
              color: "#526760",
              fontSize: "0.76rem",
              mt: 0.25,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {metrica.detalhe}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
