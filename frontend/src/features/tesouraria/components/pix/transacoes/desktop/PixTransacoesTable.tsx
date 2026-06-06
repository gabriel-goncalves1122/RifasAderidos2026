import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { PixTransacao } from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
} from "../../../../utils/pixTransacoesUtils";
import {
  StatusConciliacaoChip,
  StatusPagamentoChip,
} from "../shared/PixStatusChips";

interface PixTransacoesTableProps {
  transacoes: PixTransacao[];
}

export function PixTransacoesTable({ transacoes }: PixTransacoesTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        bgcolor: "#FFFFFF",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "#F6F8F7",
              "& th": {
                color: "#526760",
                fontWeight: 900,
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              },
            }}
          >
            <TableCell>Data</TableCell>
            <TableCell>Pagador / Reference ID</TableCell>
            <TableCell>Aderido</TableCell>
            <TableCell>Rifas</TableCell>
            <TableCell>Status Pix</TableCell>
            <TableCell>Conciliação</TableCell>
            <TableCell align="right">Valor</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {transacoes.map((transacao) => (
            <TableRow
              key={transacao.id}
              hover
              sx={{
                "& td": {
                  borderColor: "rgba(2, 27, 22, 0.08)",
                },
              }}
            >
              <TableCell sx={{ color: "#526760", fontWeight: 700 }}>
                {formatarDataPix(
                  transacao.dataPagamento || transacao.dataCriacao,
                )}
              </TableCell>

              <TableCell>
                <Box>
                  <Typography sx={{ color: "#021B16", fontWeight: 850 }}>
                    {transacao.compradorNome || "Pagador não informado"}
                  </Typography>

                  <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
                    {transacao.referenceId}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>
                <Typography sx={{ color: "#021B16", fontWeight: 850 }}>
                  {transacao.aderido?.nome || "Sem aderido"}
                </Typography>

                <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
                  {transacao.aderido?.modalidade_adesao === "meio"
                    ? "Meio-aderido"
                    : transacao.aderido
                      ? "Aderido"
                      : "Não vinculado"}
                </Typography>
              </TableCell>

              <TableCell>
                <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                  {transacao.rifas && transacao.rifas.length > 0 ? (
                    transacao.rifas.map((rifa) => (
                      <Chip
                        key={rifa.numero}
                        label={rifa.numero}
                        size="small"
                        sx={{
                          height: 24,
                          borderRadius: 1.5,
                          bgcolor: "#EAF3EF",
                          color: "#063D31",
                          border: "1px solid rgba(6, 61, 49, 0.18)",
                          fontWeight: 850,
                        }}
                      />
                    ))
                  ) : (
                    <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
                      Sem rifas
                    </Typography>
                  )}
                </Box>
              </TableCell>

              <TableCell>
                <StatusPagamentoChip status={transacao.statusPagamento} />
              </TableCell>

              <TableCell>
                <StatusConciliacaoChip status={transacao.statusConciliacao} />
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  color:
                    transacao.statusPagamento === "PAID" ? "#063D31" : "#6B4E00",
                  fontWeight: 950,
                }}
              >
                {formatarMoedaPix(
                  transacao.statusPagamento === "PAID"
                    ? transacao.valorPago
                    : transacao.valorBruto,
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
