// ============================================================================
// ARQUIVO: frontend/src/views/components/VisaoGraficaTab.tsx
// RESPONSABILIDADE: Dashboard analítico da tesouraria com métricas e gráficos.
// ============================================================================
import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Paper, Card, CircularProgress } from "@mui/material";

// Ícones
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";

// Gráficos
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
import { useTesouraria } from "../../../controllers/useTesouraria";

// Tipagens
interface AderidoMetrica {
  arrecadado: number;
  meta: number;
}
interface Transacao {
  status: string;
  data_reserva: string;
  valor: number;
}

export function VisaoGraficaTab() {
  const { buscarRelatorio, buscarHistoricoDetalhado } = useTesouraria();
  const [carregando, setCarregando] = useState(true);

  // Estados dos Dados
  const [resumoGeral, setResumoGeral] = useState({
    totalArrecadado: 0,
    rifasPagas: 0,
    aderidosAtivos: 0,
  });
  const [aderidos, setAderidos] = useState<AderidoMetrica[]>([]);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<Transacao[]>(
    [],
  );

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
  // PROCESSAMENTO DE DADOS MEMORIZADO (Evita recalcular a cada render do React)
  // ==========================================================================

  const receitaPorDia = useMemo(() => {
    const agrupado = historicoTransacoes.reduce(
      (acc, curr) => {
        if (curr.status !== "pago") return acc;
        const dataStr = new Date(curr.data_reserva).toLocaleDateString(
          "pt-BR",
          { day: "2-digit", month: "2-digit" },
        );

        if (!acc[dataStr]) acc[dataStr] = { data: dataStr, valor: 0 };
        acc[dataStr].valor += curr.valor;
        return acc;
      },
      {} as Record<string, { data: string; valor: number }>,
    );

    return Object.values(agrupado).reverse();
  }, [historicoTransacoes]);

  const dadosStatus = useMemo(() => {
    const pagas = historicoTransacoes.filter((t) => t.status === "pago").length;
    const pendentes = historicoTransacoes.filter(
      (t) => t.status === "pendente",
    ).length;
    return [
      { name: "Pagas", value: pagas },
      { name: "Pendentes", value: pendentes },
    ];
  }, [historicoTransacoes]);

  const dadosMetas = useMemo(() => {
    const bateramMeta = aderidos.filter((a) => a.arrecadado >= a.meta).length;
    return [
      { name: "Bateram a Meta", value: bateramMeta },
      { name: "Abaixo da Meta", value: aderidos.length - bateramMeta },
    ];
  }, [aderidos]);

  const CORES_STATUS = ["#2e7d32", "#ed6c02"];
  const CORES_METAS = ["#1976d2", "#9e9e9e"];

  // ==========================================================================
  // RENDERIZAÇÃO
  // ==========================================================================
  if (carregando)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  const CardMetrica = ({ icone, titulo, valor, cor }: any) => (
    <Paper
      sx={{ p: 2, borderRadius: 2, borderLeft: "6px solid", borderColor: cor }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {icone} {titulo}
      </Typography>
      <Typography variant="h5" fontWeight="bold" mt={1}>
        {valor}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* MACRO MÉTRICAS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        <CardMetrica
          icone={<AttachMoneyIcon fontSize="small" />}
          titulo="Caixa Validado"
          valor={`R$ ${resumoGeral.totalArrecadado.toLocaleString("pt-BR")},00`}
          cor="primary.main"
        />
        <CardMetrica
          icone={<TrendingUpIcon fontSize="small" />}
          titulo="Rifas Vendidas"
          valor={`${resumoGeral.rifasPagas} bilhetes`}
          cor="success.main"
        />
        <CardMetrica
          icone={<GroupIcon fontSize="small" />}
          titulo="Aderidos Ativos"
          valor={`${resumoGeral.aderidosAtivos} alunos`}
          cor="warning.main"
        />
      </Box>

      {/* GRÁFICO EVOLUÇÃO */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Evolução do Faturamento (Aprovado)
      </Typography>
      <Card elevation={1} sx={{ borderRadius: 2, mb: 4, pt: 2, pb: 2 }}>
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
              Sem dados de faturamento aprovado.
            </Typography>
          )}
        </Box>
      </Card>

      {/* GRÁFICOS SECUNDÁRIOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        <Card elevation={1} sx={{ borderRadius: 2, pt: 2, pb: 2 }}>
          <Typography variant="h6" fontWeight="bold" align="center" mb={1}>
            Status de Pagamento
          </Typography>
          <Box sx={{ width: "100%", height: 250 }}>
            {dadosStatus[0].value > 0 || dadosStatus[1].value > 0 ? (
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
                    {dadosStatus.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={CORES_STATUS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} rifas`, "Quantidade"]}
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
                    {dadosMetas.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={CORES_METAS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val} aderidos`, "Quantidade"]}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography textAlign="center" color="text.secondary" mt={10}>
                Sem aderidos registrados.
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
