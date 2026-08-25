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

import { colors } from "@/shared/tokens/colors";
import { components } from "@/shared/tokens/components";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";
import {
  PixTransacao,
} from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
} from "../../../../utils/pixTransacoesUtils";
import { PixTransacaoDetalhesDialog } from "../shared/PixTransacaoDetalhesDialog";

interface PixTransacoesTableProps {
  transacoes: PixTransacao[];
}

export function PixTransacoesTable({
  transacoes,
}: PixTransacoesTableProps) {
  const [transacaoDetalhada, setTransacaoDetalhada] =
    useState<PixTransacao | null>(null);

  return (
    <>
      <Paper
        elevation={0}
        sx={{ ...surfaces.paper, overflow: "hidden" }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{ ...components.tabelaCabecalho, "& th": { ...components.tabelaCabecalho["& th"], fontSize: "0.75rem" } }}
            >
              <TableCell sx={{ width: 54 }} />
              <TableCell>Data</TableCell>
              <TableCell>Pagador</TableCell>
              <TableCell align="right">Valor / Status</TableCell>
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
                    ...components.linhaTabela,
                    "&:hover": {
                      bgcolor: colors.fundoSuave,
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${colors.verdeEscuro}`,
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
                        color: colors.verdeEscuro,
                        bgcolor: colors.verdeClaro,
                        "&:hover": {
                          bgcolor: colors.verdeHover,
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

                  <TableCell sx={{ color: colors.cinzaTexto, fontWeight: 700 }}>
                    {formatarDataPix(
                      transacao.dataPagamento || transacao.dataCriacao,
                    )}
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ color: colors.pretoEsverdeado, fontWeight: 850 }}>
                      {transacao.compradorNome || "Pagador não informado"}
                    </Typography>
                    <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.82rem" }}>
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
                              ? colors.verdeEscuro
                              : colors.alertaTexto,
                          fontWeight: 950,
                        }}
                      >
                        {formatarMoedaPix(valor)}
                      </Typography>
                    </Stack>
                  </TableCell>
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
