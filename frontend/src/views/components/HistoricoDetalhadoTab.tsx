// ============================================================================
// ARQUIVO: frontend/src/views/components/HistoricoDetalhadoTab.tsx
// RESPONSABILIDADE: Buscar transações, agrupar por lote, filtrar e renderizar
// de forma responsiva (Tabela no PC, Cards no Mobile) sem scroll lateral.
// ============================================================================
import React, { useState, useEffect } from "react";
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
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import { useRifasController } from "../../controllers/useRifasController";

export function HistoricoDetalhadoTab() {
  const { buscarHistoricoDetalhado } = useRifasController();
  const [carregando, setCarregando] = useState(true);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<any[]>([]);

  // Estado do Filtro
  const [termoBusca, setTermoBusca] = useState("");

  // Carrega os dados granulares
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const dadosDetalhados = await buscarHistoricoDetalhado();

      // Garante que é um array, mesmo que o Firebase mande um objeto
      if (Array.isArray(dadosDetalhados)) {
        setHistoricoTransacoes(dadosDetalhados);
      } else if (dadosDetalhados && typeof dadosDetalhados === "object") {
        setHistoricoTransacoes(Object.values(dadosDetalhados));
      } else {
        setHistoricoTransacoes([]);
      }

      setCarregando(false);
    };
    carregar();
  }, []);

  // ==========================================================================
  // OTIMIZAÇÃO E AGRUPAMENTO (LOTE) - SUA LÓGICA ORIGINAL RESTAURADA
  // ==========================================================================
  const historicoAgrupado = Object.values(
    historicoTransacoes.reduce(
      (acc, curr) => {
        const chaveAgrupamento = curr.data_reserva + curr.comprador_nome;

        if (!acc[chaveAgrupamento]) {
          acc[chaveAgrupamento] = {
            data_reserva: curr.data_reserva,
            data_pagamento: curr.data_pagamento,
            vendedor_nome: curr.vendedor_nome,
            vendedor_cpf: curr.vendedor_cpf,
            comprador_nome: curr.comprador_nome,
            comprador_email: curr.comprador_email,
            status: curr.status,
            bilhetes: [curr.numero_rifa || curr.numero], // Tenta os dois nomes por segurança
            valor_total: curr.valor || 10,
          };
        } else {
          acc[chaveAgrupamento].bilhetes.push(curr.numero_rifa || curr.numero);
          acc[chaveAgrupamento].valor_total += curr.valor || 10;
        }
        return acc;
      },
      {} as Record<string, any>,
    ),
  ).sort(
    (a: any, b: any) =>
      new Date(b.data_reserva).getTime() - new Date(a.data_reserva).getTime(),
  );

  // ==========================================================================
  // FILTRO DE BUSCA (Por Comprador, Vendedor ou Rifa)
  // ==========================================================================
  const historicoFiltrado = historicoAgrupado.filter((transacao: any) => {
    if (!termoBusca) return true;

    const termo = termoBusca.toLowerCase();
    const comprador = (transacao.comprador_nome || "").toLowerCase();
    const vendedor = (transacao.vendedor_nome || "").toLowerCase();
    const rifas = transacao.bilhetes.join(", ").toLowerCase();

    return (
      comprador.includes(termo) ||
      vendedor.includes(termo) ||
      rifas.includes(termo)
    );
  });

  // ==========================================================================
  // EXPORTADOR CSV (Agora exporta a lista filtrada)
  // ==========================================================================
  const baixarCSVDeralhado = () => {
    if (historicoFiltrado.length === 0) return;

    const headers = [
      "Data Reserva",
      "Data Pagamento",
      "Status",
      "Rifas",
      "Qtd",
      "Valor Total (R$)",
      "Vendedor",
      "CPF Vendedor",
      "Comprador",
      "Email Comprador",
    ];
    const linhas = historicoFiltrado.map((t: any) => [
      t.data_reserva
        ? new Date(t.data_reserva).toLocaleDateString("pt-BR")
        : "-",
      t.data_pagamento && t.data_pagamento !== "-"
        ? new Date(t.data_pagamento).toLocaleDateString("pt-BR")
        : "-",
      (t.status || "desconhecido").toUpperCase(),
      `"${t.bilhetes.join(", ")}"`,
      t.bilhetes.length,
      t.valor_total,
      `"${t.vendedor_nome || ""}"`,
      `"${t.vendedor_cpf || ""}"`,
      `"${t.comprador_nome || ""}"`,
      `"${t.comprador_email || ""}"`,
    ]);

    const conteudoCSV = [
      headers.join(";"),
      ...linhas.map((linha) => linha.join(";")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + conteudoCSV], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `Historico_Rifas_Agrupado_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      {/* ================================================================== */}
      {/* CABEÇALHO E CONTROLES (Busca e Exportação)                         */}
      {/* ================================================================== */}
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
            flexGrow: 1,
            justifyContent: "flex-end",
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
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="success"
            startIcon={<FileDownloadIcon />}
            onClick={baixarCSVDeralhado}
            disabled={historicoFiltrado.length === 0}
            sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
          >
            Gerar Excel (CSV)
          </Button>
        </Box>
      </Box>

      {historicoFiltrado.length === 0 ? (
        <Paper
          elevation={0}
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
          {/* ================================================================== */}
          {/* MODO DESKTOP / TABLET (Tabela Original)                            */}
          {/* ================================================================== */}
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
                  <TableCell
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Data Res.
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Comprador
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Vendedor
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Rifas da Compra
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Valor
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicoFiltrado.map((transacao: any, index: number) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.02)" } }}
                  >
                    <TableCell>
                      {new Date(transacao.data_reserva).toLocaleDateString(
                        "pt-BR",
                      )}
                    </TableCell>
                    <TableCell>{transacao.comprador_nome}</TableCell>
                    <TableCell>{transacao.vendedor_nome}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: "200px",
                          wordWrap: "break-word",
                          fontWeight: "bold",
                        }}
                      >
                        {transacao.bilhetes.join(", ")}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={(
                          transacao.status || "desconhecido"
                        ).toUpperCase()}
                        size="small"
                        color={
                          transacao.status === "pago"
                            ? "success"
                            : transacao.status === "pendente"
                              ? "warning"
                              : "error"
                        }
                        variant="outlined"
                        sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: "bold", color: "success.main" }}
                    >
                      R$ {transacao.valor_total},00
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ================================================================== */}
          {/* MODO MOBILE (Lista de Cards - Resolve o Scroll Lateral)            */}
          {/* ================================================================== */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Stack spacing={2}>
              {historicoFiltrado.map((transacao: any, index: number) => (
                <Card
                  key={index}
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
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Lote de Rifas
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight="900"
                          color="primary.main"
                          sx={{ wordWrap: "break-word", lineHeight: 1.2 }}
                        >
                          {transacao.bilhetes.join(", ")}
                        </Typography>
                      </Box>
                      <Chip
                        label={(
                          transacao.status || "desconhecido"
                        ).toUpperCase()}
                        size="small"
                        color={
                          transacao.status === "pago"
                            ? "success"
                            : transacao.status === "pendente"
                              ? "warning"
                              : "error"
                        }
                        sx={{ fontWeight: "bold", fontSize: "0.7rem", ml: 1 }}
                      />
                    </Box>

                    <Divider sx={{ mb: 1.5 }} />

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "text.secondary",
                        }}
                      >
                        <CalendarTodayIcon fontSize="small" />
                        {new Date(transacao.data_reserva).toLocaleDateString(
                          "pt-BR",
                        )}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <PersonIcon fontSize="small" color="secondary" />
                        <strong>Comprador:</strong>{" "}
                        {transacao.comprador_nome || "-"}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <BadgeIcon fontSize="small" color="primary" />
                        <strong>Vendedor:</strong>{" "}
                        {transacao.vendedor_nome || "-"}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 0.5,
                          color: "success.main",
                          fontWeight: "bold",
                        }}
                      >
                        <AttachMoneyIcon fontSize="small" />
                        Valor Total: R$ {transacao.valor_total},00
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
