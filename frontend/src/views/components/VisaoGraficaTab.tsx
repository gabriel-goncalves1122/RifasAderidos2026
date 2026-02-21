// ============================================================================
// ARQUIVO: frontend/src/views/components/VisaoGraficaTab.tsx
// RESPONSABILIDADE: Buscar os dados macro do backend e gerar os cards globais
// de faturamento e o gráfico de barras dos top vendedores.
// ============================================================================
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";

// Ícones
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";

// Recharts (Gráficos)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useRifasController } from "../../controllers/useRifasController";

export function VisaoGraficaTab() {
  const { buscarRelatorio } = useRifasController();
  const [carregando, setCarregando] = useState(true);

  const [resumoGeral, setResumoGeral] = useState({
    totalArrecadado: 0,
    rifasPagas: 0,
    aderidosAtivos: 0,
  });
  const [aderidos, setAderidos] = useState<any[]>([]);

  // Carrega os dados agrupados/macro (quem vendeu mais e os valores totais)
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const dados = await buscarRelatorio();
      if (dados) {
        setResumoGeral(dados.resumoGeral);
        setAderidos(dados.aderidos);
      }
      setCarregando(false);
    };
    carregar();
  }, []);

  // Isola os 5 melhores alunos e pega apenas o primeiro nome para caber bonito no eixo X
  const top5Vendedores = [...aderidos]
    .sort((a, b) => b.rifasVendidas - a.rifasVendidas)
    .slice(0, 5)
    .map((a) => ({
      nome: a.nome.split(" ")[0],
      rifas: a.rifasVendidas,
    }));

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* OS CARDS MACRO */}
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
            <AttachMoneyIcon fontSize="small" /> Caixa Total Validado
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

      {/* O GRÁFICO RECHARTS */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Top 5 Vendedores
      </Typography>
      <Card elevation={1} sx={{ borderRadius: 2, pt: 2, pb: 2 }}>
        <CardContent sx={{ height: 350 }}>
          {top5Vendedores.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={top5Vendedores}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" />
                <YAxis allowDecimals={false} />
                <Tooltip cursor={{ fill: "#f5f5f5" }} />
                <Legend />
                <Bar
                  dataKey="rifas"
                  name="Bilhetes Vendidos"
                  fill="#1976d2"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography textAlign="center" color="text.secondary" mt={10}>
              Dados insuficientes para gerar o gráfico.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
