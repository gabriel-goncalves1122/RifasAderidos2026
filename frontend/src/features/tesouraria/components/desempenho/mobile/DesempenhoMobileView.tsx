import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import { Box, Stack } from "@mui/material";

import { colors } from "@/shared/tokens/colors";

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

interface DesempenhoMobileViewProps {
  dados: DesempenhoDados;
}

export function DesempenhoMobileView({ dados }: DesempenhoMobileViewProps) {
  return (
    <Box sx={{ pb: 2.5, px: { xs: 1.25, sm: 0 } }}>
      <TesourariaSectionHeader
        eyebrow="Comissão"
        titulo="Desempenho financeiro"
        subtitulo="Resumo rápido da arrecadação da comissão."
        compact
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.15,
          mb: 1.75,
        }}
      >
        <Box sx={{ gridColumn: "1 / -1" }}>
          <DesempenhoKpiCard
            titulo="Receita validada"
            valor={formatarMoedaDesempenho(dados.resumoGeral.totalArrecadado)}
            detalhe="Entrada confirmada"
            icon={<AttachMoneyOutlinedIcon fontSize="small" />}
            cor={colors.verdeEscuro}
            destaque
          />
        </Box>

        <DesempenhoKpiCard
          titulo="Rifas vendidas"
          valor={formatarInteiroDesempenho(dados.resumoGeral.rifasPagas)}
          detalhe="Bilhetes pagos"
          icon={<ConfirmationNumberOutlinedIcon fontSize="small" />}
          cor={colors.verdeMedio}
        />

        <DesempenhoKpiCard
          titulo="Aderidos ativos"
          valor={formatarInteiroDesempenho(dados.resumoGeral.aderidosAtivos)}
          detalhe="Na comissão"
          icon={<GroupsOutlinedIcon fontSize="small" />}
          cor={colors.dourado}
        />
      </Box>

      <Stack spacing={1.65}>
        <DesempenhoChartCard titulo="Arrecadação diária" compacto>
          <ReceitaAreaChart data={dados.receitaPorDia} compact />
        </DesempenhoChartCard>

        <DesempenhoChartCard titulo="Status das rifas" compacto>
          <ResumoBarChart
            data={dados.status.barras}
            total={dados.status.total}
            emptyMessage="Sem transações registradas."
            compact
          />
        </DesempenhoChartCard>

        <DesempenhoChartCard titulo="Metas da comissão" compacto>
          <ResumoBarChart
            data={dados.metas.barras}
            total={dados.metas.total}
            emptyMessage="Sem aderidos registrados."
            compact
          />
        </DesempenhoChartCard>
      </Stack>
    </Box>
  );
}
