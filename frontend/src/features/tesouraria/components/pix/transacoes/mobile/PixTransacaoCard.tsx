import { Box, Paper, Stack, Typography } from "@mui/material";

import {
  AcaoValidacaoPix,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
  formatarRifasPix,
} from "../../../../utils/pixTransacoesUtils";
import { podeValidarPixTransacao } from "../../../../utils/pixValidacaoUtils";
import { PixValidacaoActions } from "../shared/PixValidacaoActions";
import { PixValidacaoChip } from "../shared/PixValidacaoChip";

interface PixTransacaoCardProps {
  transacao: PixTransacao;
  acaoEmAndamento?: AcaoValidacaoPix;
  onAceitarTransacao?: (transacaoId: string) => void | Promise<unknown>;
  onNegarTransacao?: (transacaoId: string) => void | Promise<unknown>;
}

export function PixTransacaoCard({
  transacao,
  acaoEmAndamento,
  onAceitarTransacao,
  onNegarTransacao,
}: PixTransacaoCardProps) {
  const valor =
    transacao.statusPagamento === "PAID"
      ? transacao.valorPago
      : transacao.valorBruto;

  const aderidoLabel = transacao.aderido?.nome || "Sem aderido vinculado";
  const dataLabel = formatarDataPix(
    transacao.dataPagamento || transacao.dataCriacao,
  );
  const mostrarAcoesValidacao = Boolean(
    (onAceitarTransacao || onNegarTransacao) && podeValidarPixTransacao(transacao),
  );

  return (
    <Paper
      elevation={0}
      data-testid={`pix-transacao-${transacao.id}`}
      sx={{
        p: 1.75,
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        borderLeft: "4px solid #063D31",
        boxShadow: "0 10px 24px rgba(2, 27, 22, 0.07)",
      }}
    >
      <Stack spacing={1.35}>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={1}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  color: "#021B16",
                  fontWeight: 950,
                  fontSize: "1.02rem",
                  lineHeight: 1.18,
                  wordBreak: "break-word",
                }}
              >
                {transacao.compradorNome || "Pagador não informado"}
              </Typography>

              <Typography
                sx={{
                  color: "#526760",
                  fontSize: "0.78rem",
                  mt: 0.35,
                  lineHeight: 1.25,
                }}
              >
                {dataLabel}
              </Typography>
            </Box>

            <Typography
              sx={{
                color:
                  transacao.statusPagamento === "PAID" ? "#063D31" : "#6B4E00",
                fontWeight: 950,
                fontSize: "1.28rem",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {formatarMoedaPix(valor)}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          <PixValidacaoChip transacao={transacao} />
        </Stack>

        <Box
          sx={{
            p: 1.25,
            borderRadius: 2.25,
            bgcolor: "#EAF3EF",
            border: "1px solid rgba(6, 61, 49, 0.12)",
          }}
        >
          <Typography
            sx={{
              color: "#526760",
              fontSize: "0.72rem",
              fontWeight: 850,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Aderido responsável
          </Typography>

          <Typography
            sx={{
              color: "#021B16",
              fontWeight: 850,
              fontSize: "0.94rem",
              mt: 0.25,
              lineHeight: 1.25,
            }}
          >
            {aderidoLabel}
          </Typography>
        </Box>

        <Typography sx={{ color: "#526760", fontSize: "0.84rem" }}>
          {transacao.rifas?.length
            ? `Rifas ${formatarRifasPix(transacao)}`
            : "Sem rifas vinculadas"}
        </Typography>

        {mostrarAcoesValidacao && (
          <Box
            sx={{
              pt: 0.25,
              borderTop: "1px solid rgba(2, 27, 22, 0.08)",
            }}
          >
            <PixValidacaoActions
              transacao={transacao}
              acaoEmAndamento={acaoEmAndamento}
              onAceitar={onAceitarTransacao}
              onNegar={onNegarTransacao}
              compacto
            />
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
