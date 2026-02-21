// ============================================================================
// ARQUIVO: frontend/src/views/components/HistoricoDetalhadoTab.tsx
// RESPONSABILIDADE: Buscar todas as transações, agrupar por lote de compra,
// renderizar a tabela de auditoria e permitir a exportação em CSV.
// ============================================================================
import { useState, useEffect } from "react";
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
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRifasController } from "../../controllers/useRifasController";

export function HistoricoDetalhadoTab() {
  const { buscarHistoricoDetalhado } = useRifasController();
  const [carregando, setCarregando] = useState(true);
  const [historicoTransacoes, setHistoricoTransacoes] = useState<any[]>([]);

  // Carrega os dados granulares (grão a grão) do backend apenas 1 vez ao abrir a aba
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      const dadosDetalhados = await buscarHistoricoDetalhado();
      if (dadosDetalhados) {
        setHistoricoTransacoes(dadosDetalhados);
      }
      setCarregando(false);
    };
    carregar();
  }, []);

  // ==========================================================================
  // OTIMIZAÇÃO E AGRUPAMENTO (LOTE)
  // Como o backend manda rifa por rifa, nós usamos o 'reduce' para juntar
  // rifas compradas no mesmo milissegundo pela mesma pessoa em uma linha só.
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
            bilhetes: [curr.numero_rifa],
            valor_total: curr.valor,
          };
        } else {
          // Se a chave já existe, apenas injeta a nova rifa no array e soma o valor
          acc[chaveAgrupamento].bilhetes.push(curr.numero_rifa);
          acc[chaveAgrupamento].valor_total += curr.valor;
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
  // EXPORTADOR CSV
  // Gera um arquivo Excel cru, usando ponto e vírgula para separar as colunas.
  // ==========================================================================
  const baixarCSVDeralhado = () => {
    if (historicoAgrupado.length === 0) return;

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
    const linhas = historicoAgrupado.map((t: any) => [
      new Date(t.data_reserva).toLocaleDateString("pt-BR"),
      t.data_pagamento !== "-"
        ? new Date(t.data_pagamento).toLocaleDateString("pt-BR")
        : "-",
      t.status.toUpperCase(),
      `"${t.bilhetes.join(", ")}"`, // As aspas evitam que as vírgulas dentro da string criem colunas novas no Excel
      t.bilhetes.length,
      t.valor_total,
      `"${t.vendedor_nome}"`,
      `"${t.vendedor_cpf}"`,
      `"${t.comprador_nome}"`,
      `"${t.comprador_email}"`,
    ]);

    const conteudoCSV = [
      headers.join(";"),
      ...linhas.map((linha) => linha.join(";")),
    ].join("\n");
    // O '\uFEFF' na frente avisa ao Excel que o arquivo tem codificação UTF-8 (mantém os acentos corretos)
    const blob = new Blob(["\uFEFF" + conteudoCSV], {
      type: "text/csv;charset=utf-8;",
    });

    // Simula um link clicável e executa o download
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

  // Feedback de carregamento (Skeleton spinner)
  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Todas as Movimentações
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<FileDownloadIcon />}
          onClick={baixarCSVDeralhado}
          disabled={historicoAgrupado.length === 0}
        >
          Gerar Relatório Excel (CSV)
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={1}
        sx={{ borderRadius: 2, maxHeight: 600 }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Data Res.</strong>
              </TableCell>
              <TableCell>
                <strong>Comprador</strong>
              </TableCell>
              <TableCell>
                <strong>Vendedor (Aderido)</strong>
              </TableCell>
              <TableCell>
                <strong>Rifas da Compra</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Valor</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historicoAgrupado.map((transacao: any, index: number) => (
              <TableRow key={index} hover>
                <TableCell>
                  {new Date(transacao.data_reserva).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>{transacao.comprador_nome}</TableCell>
                <TableCell>{transacao.vendedor_nome}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{ maxWidth: "200px", wordWrap: "break-word" }}
                  >
                    {transacao.bilhetes.join(", ")}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={transacao.status.toUpperCase()}
                    size="small"
                    color={transacao.status === "pago" ? "success" : "warning"}
                    variant="outlined"
                    sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  R$ {transacao.valor_total},00
                </TableCell>
              </TableRow>
            ))}
            {historicoAgrupado.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhuma venda registrada até o momento.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
