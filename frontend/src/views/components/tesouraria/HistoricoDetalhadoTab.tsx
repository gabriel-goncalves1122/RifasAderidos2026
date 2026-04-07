// ============================================================================
// ARQUIVO: frontend/src/views/components/HistoricoDetalhadoTab.tsx
// RESPONSABILIDADE: Buscar, agrupar, filtrar e exportar o CSV do histórico.
// ============================================================================
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";

// Ícones
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useTesouraria } from "../../../controllers/useTesouraria";

// Tipagem
interface TransacaoBase {
  data_reserva: string;
  data_pagamento?: string;
  vendedor_nome: string;
  vendedor_cpf: string;
  comprador_nome: string;
  comprador_email: string;
  status: "pago" | "pendente" | "disponivel";
  numero_rifa?: string;
  numero?: string;
  valor?: number;
}
interface TransacaoAgrupada {
  data_reserva: string;
  data_pagamento?: string;
  vendedor_nome: string;
  vendedor_cpf: string;
  comprador_nome: string;
  comprador_email: string;
  status: string;
  bilhetes: string[];
  valor_total: number;
}

export function HistoricoDetalhadoTab() {
  const { buscarHistoricoDetalhado } = useTesouraria();
  const [carregando, setCarregando] = useState(true);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<
    TransacaoBase[]
  >([]);
  const [termoBusca, setTermoBusca] = useState("");

  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const dados = await buscarHistoricoDetalhado();
      setHistoricoTransacoes(
        Array.isArray(dados) ? dados : dados ? Object.values(dados) : [],
      );
      setCarregando(false);
    };
    carregar();
  }, []);

  // ==========================================================================
  // OTIMIZAÇÃO: Agrupamento e Filtro Memorizados
  // ==========================================================================
  const historicoFiltrado = useMemo(() => {
    const agrupado = historicoTransacoes.reduce(
      (acc, curr) => {
        const chave = curr.data_reserva + curr.comprador_nome;
        const bilhete = curr.numero_rifa || curr.numero || "00";

        if (!acc[chave]) {
          acc[chave] = {
            data_reserva: curr.data_reserva,
            data_pagamento: curr.data_pagamento,
            vendedor_nome: curr.vendedor_nome,
            vendedor_cpf: curr.vendedor_cpf,
            comprador_nome: curr.comprador_nome,
            comprador_email: curr.comprador_email,
            status: curr.status,
            bilhetes: [bilhete],
            valor_total: curr.valor || 10,
          };
        } else {
          acc[chave].bilhetes.push(bilhete);
          acc[chave].valor_total += curr.valor || 10;
        }
        return acc;
      },
      {} as Record<string, TransacaoAgrupada>,
    );

    const ordenado = Object.values(agrupado).sort(
      (a, b) =>
        new Date(b.data_reserva).getTime() - new Date(a.data_reserva).getTime(),
    );

    if (!termoBusca) return ordenado;

    const termo = termoBusca.toLowerCase();
    return ordenado.filter(
      (t) =>
        (t.comprador_nome || "").toLowerCase().includes(termo) ||
        (t.vendedor_nome || "").toLowerCase().includes(termo) ||
        t.bilhetes.join(", ").toLowerCase().includes(termo),
    );
  }, [historicoTransacoes, termoBusca]);

  // ==========================================================================
  // EXPORTADOR CSV
  // ==========================================================================
  const baixarCSV = () => {
    if (historicoFiltrado.length === 0) return;
    const headers = [
      "Data Reserva",
      "Data Pagamento",
      "Status",
      "Rifas",
      "Qtd",
      "Valor Total (R$)",
      "Vendedor",
      "CPF",
      "Comprador",
      "Email Comprador",
    ];
    const linhas = historicoFiltrado.map((t) => [
      t.data_reserva
        ? new Date(t.data_reserva).toLocaleDateString("pt-BR")
        : "-",
      t.data_pagamento && t.data_pagamento !== "-"
        ? new Date(t.data_pagamento).toLocaleDateString("pt-BR")
        : "-",
      (t.status || "N/A").toUpperCase(),
      `"${t.bilhetes.join(", ")}"`,
      t.bilhetes.length,
      t.valor_total,
      `"${t.vendedor_nome || ""}"`,
      `"${t.vendedor_cpf || ""}"`,
      `"${t.comprador_nome || ""}"`,
      `"${t.comprador_email || ""}"`,
    ]);

    const csv = [headers.join(";"), ...linhas.map((l) => l.join(";"))].join(
      "\n",
    );
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Historico_Rifas_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) =>
    status === "pago" ? "success" : status === "pendente" ? "warning" : "error";

  if (carregando)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );

  return (
    <Box sx={{ pb: 4 }}>
      {/* HEADER E CONTROLES */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          mb: 4,
          gap: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary.main"
          sx={{ borderLeft: "4px solid var(--cor-dourado-brilho)", pl: 2 }}
        >
          Todas as Movimentações
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar nome ou rifa..."
            variant="outlined"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            sx={{
              minWidth: { xs: "100%", sm: "250px" },
              bgcolor: "white",
              borderRadius: 1,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<FileDownloadIcon />}
            onClick={baixarCSV}
            disabled={historicoFiltrado.length === 0}
            sx={{ fontWeight: "bold" }}
          >
            Gerar Excel (CSV)
          </Button>
        </Box>
      </Box>

      {historicoFiltrado.length === 0 ? (
        <Paper
          sx={{
            py: 8,
            textAlign: "center",
            bgcolor: "transparent",
            border: "2px dashed #ccc",
          }}
        >
          <SearchIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
          <Typography color="text.secondary" variant="h6">
            Nenhum resultado encontrado.
          </Typography>
        </Paper>
      ) : (
        <>
          {/* MODO DESKTOP (Tabela) */}
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 2,
              maxHeight: 600,
              display: { xs: "none", md: "block" },
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {[
                    "Data Res.",
                    "Comprador",
                    "Vendedor",
                    "Rifas da Compra",
                    "Status",
                    "Valor",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      align={
                        h === "Status"
                          ? "center"
                          : h === "Valor"
                            ? "right"
                            : "left"
                      }
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {historicoFiltrado.map((t, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      {new Date(t.data_reserva).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{t.comprador_nome}</TableCell>
                    <TableCell>{t.vendedor_nome}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {t.bilhetes.join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={(t.status || "N/A").toUpperCase()}
                        size="small"
                        color={getStatusColor(t.status)}
                        variant="outlined"
                        sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
                      R$ {t.valor_total},00
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* MODO MOBILE (Cards) */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Stack spacing={2}>
              {historicoFiltrado.map((t, i) => (
                <Card
                  key={i}
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    borderLeft: "5px solid var(--cor-dourado-brilho)",
                  }}
                >
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Lote de Rifas
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="900"
                          color="primary.main"
                        >
                          {t.bilhetes.join(", ")}
                        </Typography>
                      </Box>
                      <Chip
                        label={(t.status || "N/A").toUpperCase()}
                        size="small"
                        color={getStatusColor(t.status)}
                        sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                      />
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                        {new Date(t.data_reserva).toLocaleDateString("pt-BR")}
                      </Typography>
                      <Typography variant="body2">
                        <PersonIcon
                          fontSize="small"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />
                        <strong>Comprador:</strong> {t.comprador_nome}
                      </Typography>
                      <Typography variant="body2">
                        <BadgeIcon
                          fontSize="small"
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                        <strong>Vendedor:</strong> {t.vendedor_nome}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight="bold"
                      >
                        <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} />
                        R$ {t.valor_total},00
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );
}
