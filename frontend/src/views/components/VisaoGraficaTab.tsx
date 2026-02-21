// ============================================================================
// ARQUIVO: frontend/src/views/components/VisaoGraficaTab.tsx
// RESPONSABILIDADE: Visão analítica financeira (Evolução de caixa, Status e Metas)
// ============================================================================
import { useState, useEffect } from "react";
import { Box, Typography, Paper, Card, CircularProgress } from "@mui/material";

// Ícones
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";

// Recharts (Gráficos)
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { useRifasController } from "../../controllers/useRifasController";

export function VisaoGraficaTab() {
  const { buscarRelatorio, buscarHistoricoDetalhado } = useRifasController();
  const [carregando, setCarregando] = useState(true);

  // Estados dos Dados
  const [resumoGeral, setResumoGeral] = useState({
    totalArrecadado: 0,
    rifasPagas: 0,
    aderidosAtivos: 0,
  });
  const [aderidos, setAderidos] = useState<any[]>([]);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<any[]>([]);

  // Carrega os dados agregados e o histórico grão a grão simultaneamente
  useEffect(() => {
    const carregarTudo = async () => {
      setCarregando(true);
      const [dadosAgrupados, dadosDetalhados] = await Promise.all([
        buscarRelatorio(),
        buscarHistoricoDetalhado(),
      ]);

      if (dadosAgrupados) {
        setResumoGeral(dadosAgrupados.resumoGeral);
        setAderidos(dadosAgrupados.aderidos);
      }
      if (dadosDetalhados) {
        setHistoricoTransacoes(dadosDetalhados);
      }
      setCarregando(false);
    };
    carregarTudo();
  }, []);

  // ==========================================================================
  // PROCESSAMENTO DE DADOS PARA OS GRÁFICOS
  // ==========================================================================

  // 1. DADOS DO GRÁFICO DE LINHA DO TEMPO (Receita por Dia)
  const receitaPorDia = Object.values(
    historicoTransacoes.reduce(
      (acc, curr) => {
        if (curr.status !== "pago") return acc;

        const dataStr = new Date(curr.data_reserva).toLocaleDateString(
          "pt-BR",
          {
            day: "2-digit",
            month: "2-digit",
          },
        );

        if (!acc[dataStr]) acc[dataStr] = { data: dataStr, valor: 0 };
        acc[dataStr].valor += curr.valor;
        return acc;
      },
      {} as Record<string, { data: string; valor: number }>,
    ),
  ).reverse();

  // 2. DADOS DO GRÁFICO DE PIZZA (Status das Rifas: Pagas vs Pendentes)
  const pagas = historicoTransacoes.filter((t) => t.status === "pago").length;
  const pendentes = historicoTransacoes.filter(
    (t) => t.status === "pendente",
  ).length;
  const dadosStatus = [
    { name: "Pagas", value: pagas },
    { name: "Pendentes (Auditoria)", value: pendentes },
  ];
  const CORES_STATUS = ["#2e7d32", "#ed6c02"];

  // 3. DADOS DO GRÁFICO DE PIZZA (Engajamento: Bateram a Meta vs Não Bateram)
  const bateramMeta = aderidos.filter((a) => a.arrecadado >= a.meta).length;
  const emProgresso = aderidos.length - bateramMeta;
  const dadosMetas = [
    { name: "Bateram a Meta", value: bateramMeta },
    { name: "Abaixo da Meta", value: emProgresso },
  ];
  const CORES_METAS = ["#1976d2", "#9e9e9e"];

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* ------------------------------------------------------------------ */}
      {/* CARDS MACRO DA TESOURARIA                                          */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "6px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <AttachMoneyIcon fontSize="small" /> Caixa Validado
          </Typography>
          <Typography variant="h5" fontWeight="bold" mt={1}>
            R$ {resumoGeral.totalArrecadado.toLocaleString("pt-BR")},00
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "6px solid",
            borderColor: "success.main",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TrendingUpIcon fontSize="small" /> Rifas Vendidas
          </Typography>
          <Typography variant="h5" fontWeight="bold" mt={1}>
            {resumoGeral.rifasPagas} bilhetes
          </Typography>
        </Paper>

        <Paper
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "6px solid",
            borderColor: "warning.main",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <GroupIcon fontSize="small" /> Aderidos Ativos
          </Typography>
          <Typography variant="h5" fontWeight="bold" mt={1}>
            {resumoGeral.aderidosAtivos} alunos
          </Typography>
        </Paper>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* GRÁFICO 1: EVOLUÇÃO TEMPORAL (Largura Total)                       */}
      {/* ------------------------------------------------------------------ */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Evolução do Faturamento (Aprovado)
      </Typography>
      <Card elevation={1} sx={{ borderRadius: 2, mb: 4, pt: 2, pb: 2 }}>
        {/* A altura de 300px resolve o problema matemático do Recharts */}
        <Box sx={{ width: "100%", height: 300 }}>
          {receitaPorDia.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={receitaPorDia}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="data" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip
                  formatter={(value: any) => [`R$ ${value},00`, "Faturamento"]}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="#2e7d32"
                  fillOpacity={1}
                  fill="url(#colorValor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign="center" color="text.secondary" mt={10}>
              Ainda não há dados de faturamento aprovado para gerar o gráfico.
            </Typography>
          )}
        </Box>
      </Card>

      {/* ------------------------------------------------------------------ */}
      {/* GRÁFICOS DE PIZZA (Substituindo MUI Grid por CSS Grid Nativo)      */}
      {/* ------------------------------------------------------------------ */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {/* Gráfico 2: Status de Pagamento */}
        <Card elevation={1} sx={{ borderRadius: 2, pt: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold" align="center" mb={1}>
            Status de Pagamento (Geral)
          </Typography>
          <Box sx={{ width: "100%", height: 250 }}>
            {pagas > 0 || pendentes > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosStatus.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CORES_STATUS[index % CORES_STATUS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value} rifas`, "Quantidade"]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography textAlign="center" color="text.secondary" mt={10}>
                Sem transações registradas.
              </Typography>
            )}
          </Box>
        </Card>

        {/* Gráfico 3: Desempenho da Turma */}
        <Card elevation={1} sx={{ borderRadius: 2, pt: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold" align="center" mb={1}>
            Engajamento: Metas da Turma
          </Typography>
          <Box sx={{ width: "100%", height: 250 }}>
            {aderidos.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dadosMetas}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dadosMetas.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CORES_METAS[index % CORES_METAS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [
                      `${value} aderidos`,
                      "Quantidade",
                    ]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography textAlign="center" color="text.secondary" mt={10}>
                Sem aderidos para calcular metas.
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
