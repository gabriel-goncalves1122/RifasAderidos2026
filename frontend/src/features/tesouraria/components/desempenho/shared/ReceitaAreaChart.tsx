import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box } from "@mui/material";

import {
  formatarMoedaDesempenho,
  formatarValorEixoDesempenho,
} from "../../../utils/desempenhoFormatters";
import { ReceitaPorDiaDesempenho } from "../../../types/desempenho";
import { DesempenhoEmptyState } from "./DesempenhoEmptyState";

interface ReceitaAreaChartProps {
  data: ReceitaPorDiaDesempenho[];
  compact?: boolean;
}

export function ReceitaAreaChart({
  data,
  compact = false,
}: ReceitaAreaChartProps) {
  const altura = compact ? 240 : 330;

  if (data.length === 0) {
    return (
      <DesempenhoEmptyState
        altura={altura}
        mensagem="Sem receita validada para exibir."
      />
    );
  }

  return (
    <Box sx={{ width: "100%", height: altura, minWidth: 0, minHeight: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: compact ? 12 : 18,
            left: compact ? 2 : 8,
            bottom: compact ? 4 : 8,
          }}
        >
          <defs>
            <linearGradient id="receitaComissao" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0B7A61" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#0B7A61" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="rgba(2, 27, 22, 0.08)" vertical={false} />
          <XAxis
            dataKey="data"
            tick={{ fill: "#526760", fontSize: compact ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
            minTickGap={compact ? 14 : 22}
          />
          <YAxis
            tickFormatter={formatarValorEixoDesempenho}
            tick={{ fill: "#526760", fontSize: compact ? 10 : 12 }}
            axisLine={false}
            tickLine={false}
            width={compact ? 64 : 82}
          />
          <Tooltip
            formatter={(value: number) => [
              formatarMoedaDesempenho(Number(value)),
              "Receita",
            ]}
            labelStyle={{ color: "#021B16", fontWeight: 800 }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid rgba(2, 27, 22, 0.10)",
              boxShadow: "0 12px 28px rgba(2, 27, 22, 0.12)",
            }}
          />
          <Area
            type="monotone"
            dataKey="valor"
            name="Receita"
            stroke="#0B7A61"
            strokeWidth={compact ? 2.5 : 3}
            fill="url(#receitaComissao)"
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
