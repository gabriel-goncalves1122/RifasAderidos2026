import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  AcaoValidacaoPix,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
  formatarRifasPix,
} from "../../../../utils/pixTransacoesUtils";
import { PixValidacaoActions } from "../shared/PixValidacaoActions";
import { PixValidacaoChip } from "../shared/PixValidacaoChip";

interface PixTransacoesTableProps {
  transacoes: PixTransacao[];
  validandoPixPorId?: Record<string, AcaoValidacaoPix | undefined>;
  onAceitarTransacao?: (transacaoId: string) => void | Promise<unknown>;
  onNegarTransacao?: (transacaoId: string) => void | Promise<unknown>;
}

export function PixTransacoesTable({
  transacoes,
  validandoPixPorId = {},
  onAceitarTransacao,
  onNegarTransacao,
}: PixTransacoesTableProps) {
  const mostrarAcoes = Boolean(onAceitarTransacao || onNegarTransacao);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.25,
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
            <TableCell>Pagador</TableCell>
            <TableCell>Aderido</TableCell>
            <TableCell>Rifas</TableCell>
            <TableCell>Situação</TableCell>
            <TableCell align="right">Valor</TableCell>
            {mostrarAcoes && <TableCell align="right">Ações</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {transacoes.map((transacao) => (
            <TableRow
              key={transacao.id}
              hover
              data-testid={`pix-transacao-${transacao.id}`}
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
                <Typography sx={{ color: "#021B16", fontWeight: 850 }}>
                  {transacao.compradorNome || "Pagador não informado"}
                </Typography>
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
                <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
                  {formatarRifasPix(transacao)}
                </Typography>
              </TableCell>

              <TableCell>
                <PixValidacaoChip transacao={transacao} />
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

              {mostrarAcoes && (
                <TableCell align="right">
                  <PixValidacaoActions
                    transacao={transacao}
                    acaoEmAndamento={validandoPixPorId[transacao.id]}
                    onAceitar={onAceitarTransacao}
                    onNegar={onNegarTransacao}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
