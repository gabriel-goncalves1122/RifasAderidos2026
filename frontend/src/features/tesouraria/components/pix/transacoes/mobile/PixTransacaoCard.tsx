import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import { Box, Chip, IconButton, Paper, Stack, Typography } from "@mui/material";

import { PixTransacao } from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
} from "../../../../utils/pixTransacoesUtils";
import {
  StatusConciliacaoChip,
  StatusPagamentoChip,
} from "../shared/PixStatusChips";

interface PixTransacaoCardProps {
  transacao: PixTransacao;
}

function truncarReferenceId(referenceId: string) {
  if (referenceId.length <= 28) return referenceId;

  return `${referenceId.slice(0, 18)}...${referenceId.slice(-6)}`;
}

export function PixTransacaoCard({ transacao }: PixTransacaoCardProps) {
  const valor =
    transacao.statusPagamento === "PAID"
      ? transacao.valorPago
      : transacao.valorBruto;

  const aderidoLabel = transacao.aderido?.nome || "Sem aderido vinculado";
  const dataLabel = formatarDataPix(
    transacao.dataPagamento || transacao.dataCriacao,
  );

  const copiarReferenceId = async () => {
    try {
      await navigator.clipboard?.writeText(transacao.referenceId);
    } catch {
      // Em navegadores mobile sem permissão de clipboard, a ação falha sem quebrar a UI.
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.75,
        borderRadius: 3,
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
          <StatusPagamentoChip status={transacao.statusPagamento} />
          <StatusConciliacaoChip status={transacao.statusConciliacao} />
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

        <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
          {transacao.rifas?.length ? (
            transacao.rifas.map((rifa) => (
              <Chip
                key={rifa.numero}
                label={`Rifa ${rifa.numero}`}
                size="small"
                sx={{
                  height: 28,
                  borderRadius: 2,
                  bgcolor: "#EAF3EF",
                  color: "#063D31",
                  border: "1px solid rgba(6, 61, 49, 0.14)",
                  fontWeight: 850,
                  fontSize: "0.75rem",
                }}
              />
            ))
          ) : (
            <Typography sx={{ color: "#526760", fontSize: "0.82rem" }}>
              Sem rifas vinculadas
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          sx={{
            pt: 0.25,
            borderTop: "1px solid rgba(2, 27, 22, 0.08)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#526760",
                fontSize: "0.7rem",
                fontWeight: 850,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Reference ID
            </Typography>

            <Typography
              sx={{
                color: "#021B16",
                fontSize: "0.82rem",
                fontWeight: 750,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "72vw",
              }}
              title={transacao.referenceId}
            >
              {truncarReferenceId(transacao.referenceId)}
            </Typography>
          </Box>

          <IconButton
            size="small"
            aria-label="Copiar reference ID"
            onClick={copiarReferenceId}
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              color: "#063D31",
              bgcolor: "#EAF3EF",
              flexShrink: 0,
              "&:hover": {
                bgcolor: "#DDECE6",
              },
            }}
          >
            <ContentCopyOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
