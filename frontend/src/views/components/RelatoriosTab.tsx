// ============================================================================
// ARQUIVO: frontend/src/views/components/RelatoriosTab.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupIcon from "@mui/icons-material/Group";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { useRifasController } from "../../controllers/useRifasController";

export function RelatoriosTab() {
  const { buscarRelatorio } = useRifasController();

  // Estados da Tela
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("maior_arrecadacao");

  // Estados dos Dados Reais (Vindos do Backend)
  const [resumoGeral, setResumoGeral] = useState({
    totalArrecadado: 0,
    rifasPagas: 0,
    aderidosAtivos: 0,
  });
  const [aderidos, setAderidos] = useState<any[]>([]);

  // Carrega os dados reais assim que a aba é aberta
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

  // Lógica de Filtro e Ordenação Front-end
  const aderidosFiltrados = aderidos
    .filter((a) => a.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === "maior_arrecadacao") return b.arrecadado - a.arrecadado;
      if (ordenacao === "menor_arrecadacao") return a.arrecadado - b.arrecadado;
      if (ordenacao === "ordem_alfabetica") return a.nome.localeCompare(b.nome);
      return 0;
    });

  // ==========================================================================
  // FUNÇÃO MÁGICA: GERADOR DE CSV PARA O EXCEL
  // ==========================================================================
  const baixarCSV = () => {
    if (aderidosFiltrados.length === 0) return;

    // 1. Cabeçalhos das Colunas
    const headers = [
      "Posicao",
      "Nome",
      "CPF",
      "Arrecadado (R$)",
      "Meta (R$)",
      "Rifas Vendidas",
    ];

    // 2. Monta as Linhas com os dados formatados
    const linhas = aderidosFiltrados.map((a, index) => [
      index + 1,
      `"${a.nome}"`, // Aspas protegem nomes que tenham vírgula
      `"${a.cpf}"`,
      a.arrecadado,
      a.meta,
      a.rifasVendidas,
    ]);

    // 3. Junta tudo num formato de texto CSV
    const conteudoCSV = [
      headers.join(","),
      ...linhas.map((linha) => linha.join(",")),
    ].join("\n");

    // 4. Cria o arquivo (O \uFEFF é um truque para o Excel Brasileiro ler os acentos direito)
    const blob = new Blob(["\uFEFF" + conteudoCSV], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    // 5. Simula um clique invisível para forçar o download no navegador
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Relatorio_Tesouraria_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* CABEÇALHO COM O BOTÃO DE DOWNLOAD */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Visão Geral da Comissão
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={baixarCSV}
          disabled={aderidosFiltrados.length === 0}
          sx={{ fontWeight: "bold" }}
        >
          Exportar Tabela (CSV)
        </Button>
      </Box>

      {/* 1. CARDS DE RESUMO GLOBAL */}
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
            <AttachMoneyIcon fontSize="small" /> Caixa Total
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
            <TrendingUpIcon fontSize="small" /> Rifas Pagas
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
            <GroupIcon fontSize="small" /> Aderidos
          </Typography>
          <Typography variant="h5" fontWeight="bold" mt={1}>
            {resumoGeral.aderidosAtivos} alunos
          </Typography>
        </Paper>
      </Box>

      {/* 2. BARRA DE PESQUISA E FILTROS */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "white" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Buscar aderido por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            sx={{ flexGrow: 1, minWidth: "200px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            select
            size="small"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
            sx={{ minWidth: "200px" }}
          >
            <MenuItem value="maior_arrecadacao">Maior Arrecadação</MenuItem>
            <MenuItem value="menor_arrecadacao">Menor Arrecadação</MenuItem>
            <MenuItem value="ordem_alfabetica">Ordem Alfabética (A-Z)</MenuItem>
          </TextField>
        </Box>
      </Paper>

      {/* 3. LISTA DE ADERIDOS (Ranking e Progresso) */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Progresso Individual
      </Typography>

      <Stack spacing={2}>
        {aderidosFiltrados.map((aderido, index) => {
          const porcentagem = Math.min(
            (aderido.arrecadado / aderido.meta) * 100,
            100,
          );
          const bateuMeta = aderido.arrecadado >= aderido.meta;

          return (
            <Card
              key={aderido.id}
              elevation={1}
              sx={{
                borderRadius: 2,
                border: bateuMeta ? "1px solid #4caf50" : "none",
              }}
            >
              <CardContent sx={{ pb: "16px !important" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    {index + 1}º - {aderido.nome}
                    {bateuMeta && (
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          bgcolor: "success.light",
                          color: "white",
                          px: 1,
                          py: 0.2,
                          borderRadius: 4,
                        }}
                      >
                        Meta Atingida!
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    R$ {aderido.arrecadado} / R$ {aderido.meta}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={porcentagem}
                      color={bateuMeta ? "success" : "primary"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ minWidth: "40px", textAlign: "right" }}
                  >
                    {Math.round(porcentagem)}%
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  mt={1}
                >
                  {aderido.rifasVendidas} rifas aprovadas pela tesouraria. CPF:{" "}
                  {aderido.cpf}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
        {aderidosFiltrados.length === 0 && (
          <Typography color="text.secondary" textAlign="center" py={4}>
            Nenhum aderido encontrado.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
