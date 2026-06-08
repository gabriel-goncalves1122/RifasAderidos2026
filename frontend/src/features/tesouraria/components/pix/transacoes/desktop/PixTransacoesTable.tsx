import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  IconButton,
  Paper,
  Stack,
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
} from "../../../../utils/pixTransacoesUtils";
import { PixTransacaoDetalhesDialog } from "../shared/PixTransacaoDetalhesDialog";
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
  const [transacaoDetalhada, setTransacaoDetalhada] =
    useState<PixTransacao | null>(null);

  return (
    <>
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
              <TableCell sx={{ width: 54 }} />
              <TableCell>Data</TableCell>
              <TableCell>Pagador</TableCell>
              <TableCell align="right">Valor / Status</TableCell>
              {mostrarAcoes && <TableCell align="right">Ações</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {transacoes.map((transacao) => {
              const valor =
                transacao.statusPagamento === "PAID"
                  ? transacao.valorPago
                  : transacao.valorBruto;

              return (
                <TableRow
                  key={transacao.id}
                  hover
                  tabIndex={0}
                  data-testid={`pix-transacao-${transacao.id}`}
                  onClick={() => setTransacaoDetalhada(transacao)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setTransacaoDetalhada(transacao);
                    }
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "background-color 160ms ease",
                    "& td": {
                      borderColor: "rgba(2, 27, 22, 0.08)",
                    },
                    "&:hover": {
                      bgcolor: "#F6F8F7",
                    },
                    "&:focus-visible": {
                      outline: "2px solid #063D31",
                      outlineOffset: -2,
                    },
                  }}
                >
                  <TableCell>
                    <IconButton
                      aria-label={`Abrir detalhes da transação Pix ${transacao.compradorNome || transacao.id}`}
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setTransacaoDetalhada(transacao);
                      }}
                      sx={{
                        borderRadius: 2,
                        color: "#063D31",
                        bgcolor: "#EAF3EF",
                        "&:hover": {
                          bgcolor: "#DDECE6",
                        },
                      }}
                    >
                      <ExpandMoreIcon
                        sx={{
                          transform: "rotate(-90deg)",
                          fontSize: 20,
                        }}
                      />
                    </IconButton>
                  </TableCell>

                  <TableCell sx={{ color: "#526760", fontWeight: 700 }}>
                    {formatarDataPix(
                      transacao.dataPagamento || transacao.dataCriacao,
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: "#021B16", fontWeight: 850 }}>
                      {transacao.compradorNome || "Pagador não informado"}
                    </Typography>
                    <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
                      {transacao.compradorEmail ||
                        transacao.aderido?.nome ||
                        "Sem e-mail informado"}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Stack alignItems="flex-end" spacing={0.75}>
                      <Typography
                        sx={{
                          color:
                            transacao.statusPagamento === "PAID"
                              ? "#063D31"
                              : "#6B4E00",
                          fontWeight: 950,
                        }}
                      >
                        {formatarMoedaPix(valor)}
                      </Typography>
                      <PixValidacaoChip transacao={transacao} />
                    </Stack>
                  </TableCell>

                  {mostrarAcoes && (
                    <TableCell align="right">
                      <Box
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                      >
                        <PixValidacaoActions
                          transacao={transacao}
                          acaoEmAndamento={validandoPixPorId[transacao.id]}
                          onAceitar={onAceitarTransacao}
                          onNegar={onNegarTransacao}
                        />
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <PixTransacaoDetalhesDialog
        transacao={transacaoDetalhada}
        onClose={() => setTransacaoDetalhada(null)}
      />
    </>
  );
}
