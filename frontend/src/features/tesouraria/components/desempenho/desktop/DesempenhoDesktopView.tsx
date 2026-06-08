import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Box } from "@mui/material";

import { TesourariaSectionHeader } from "../../shared/TesourariaSectionHeader";
import {
  formatarInteiroDesempenho,
  formatarMoedaDesempenho,
} from "../../../utils/desempenhoFormatters";
import { DesempenhoDados } from "../../../types/desempenho";
import { DesempenhoChartCard } from "../shared/DesempenhoChartCard";
import { DesempenhoKpiCard } from "../shared/DesempenhoKpiCard";
import { ReceitaAreaChart } from "../shared/ReceitaAreaChart";
import { ResumoBarChart } from "../shared/ResumoBarChart";

interface DesempenhoDesktopViewProps {
  dados: DesempenhoDados;
}

export function DesempenhoDesktopView({ dados }: DesempenhoDesktopViewProps) {
  const percentualMeta =
    dados.metas.total > 0
      ? Math.round((dados.metas.bateramMeta / dados.metas.total) * 100)
      : 0;

  return (
    <Box sx={{ pb: 4, px: { xs: 1.5, md: 0.5 } }}>
      <TesourariaSectionHeader
        eyebrow="Comissão"
        titulo="Desempenho financeiro"
        subtitulo="Leitura consolidada da arrecadação, rifas e metas da comissão."
      />

      <Box sx={{ mb: 2.75 }}>
        <DesempenhoKpiCard
          titulo="Receita validada"
          valor={formatarMoedaDesempenho(dados.resumoGeral.totalArrecadado)}
          detalhe="Entrada confirmada no período"
          icon={<AttachMoneyOutlinedIcon fontSize="small" />}
          cor="#063D31"
          destaque
        />
      </Box>

      <DesempenhoChartCard
        titulo="Arrecadação validada por dia"
        subtitulo="Receita confirmada agrupada por data de reserva."
      >
        <ReceitaAreaChart data={dados.receitaPorDia} />
      </DesempenhoChartCard>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 2.25,
          my: 2.75,
        }}
      >
        <DesempenhoKpiCard
          titulo="Rifas vendidas"
          valor={`${formatarInteiroDesempenho(
            dados.resumoGeral.rifasPagas,
          )} rifas`}
          detalhe={`${formatarInteiroDesempenho(dados.status.pagas)} pagamentos`}
          icon={<ConfirmationNumberOutlinedIcon fontSize="small" />}
          cor="#0B7A61"
        />
        <DesempenhoKpiCard
          titulo="Aderidos ativos"
          valor={`${formatarInteiroDesempenho(
            dados.resumoGeral.aderidosAtivos,
          )} alunos`}
          detalhe={`${formatarInteiroDesempenho(
            dados.metas.bateramMeta,
          )} na meta`}
          icon={<GroupsOutlinedIcon fontSize="small" />}
          cor="#C48A16"
        />
        <DesempenhoKpiCard
          titulo="Meta atingida"
          valor={`${percentualMeta}%`}
          detalhe={`${formatarInteiroDesempenho(
            dados.metas.bateramMeta,
          )} de ${formatarInteiroDesempenho(dados.metas.total)} aderidos`}
          icon={<TaskAltOutlinedIcon fontSize="small" />}
          cor="#063D31"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 2.75,
        }}
      >
        <DesempenhoChartCard
          titulo="Status das rifas"
          subtitulo="Distribuição entre pagamentos confirmados e pendentes."
        >
          <ResumoBarChart
            data={dados.status.barras}
            total={dados.status.total}
            emptyMessage="Sem transações registradas."
          />
        </DesempenhoChartCard>

        <DesempenhoChartCard
          titulo="Metas da comissão"
          subtitulo="Aderidos que já alcançaram a meta individual."
        >
          <ResumoBarChart
            data={dados.metas.barras}
            total={dados.metas.total}
            emptyMessage="Sem aderidos registrados."
          />
        </DesempenhoChartCard>
      </Box>
    </Box>
  );
}
