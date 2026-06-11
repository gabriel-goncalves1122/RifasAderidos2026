import { Box, Paper, Stack, Typography } from "@mui/material";

import { colors } from "../../../../styles/colors";
import { surfaces } from "../../../../styles/surfaces";
import { typography } from "../../../../styles/typography";
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
        ...surfaces.paperComSombra,
        p: 1.75,
        borderLeft: `4px solid ${colors.verdeEscuro}`,
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
                  color: colors.pretoEsverdeado,
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
                  color: colors.cinzaTexto,
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
                  transacao.statusPagamento === "PAID" ? colors.verdeEscuro : colors.alertaTexto,
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
            ...surfaces.fundoVerdeClaro,
            p: 1.25,
            borderRadius: 2.25,
            border: "1px solid rgba(6, 61, 49, 0.12)",
          }}
        >
          <Typography
            sx={{ ...typography.label, fontWeight: 850 }}
          >
            Aderido responsável
          </Typography>

          <Typography
            sx={{
              color: colors.pretoEsverdeado,
              fontWeight: 850,
              fontSize: "0.94rem",
              mt: 0.25,
              lineHeight: 1.25,
            }}
          >
            {aderidoLabel}
          </Typography>
        </Box>

        <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.84rem" }}>
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
