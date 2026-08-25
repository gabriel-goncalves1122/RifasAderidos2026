import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Button, CircularProgress, Stack, Tooltip } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { components } from "@/shared/tokens/components";
import {
  AcaoValidacaoPix,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { obterAuditoriaValidacaoPix } from "../../../../utils/pixValidacaoUtils";

interface PixValidacaoActionsProps {
  transacao: PixTransacao;
  acaoEmAndamento?: AcaoValidacaoPix;
  onAceitar?: (transacaoId: string) => void | Promise<unknown>;
  onNegar?: (transacaoId: string) => void | Promise<unknown>;
  compacto?: boolean;
}

function obterTooltipAcao(
  acao: "aceitar" | "negar",
  bloqueio: string,
  acaoEmAndamento?: AcaoValidacaoPix,
) {
  if (acaoEmAndamento) return "Validação Pix em andamento.";
  if (bloqueio) return bloqueio;

  return acao === "aceitar"
    ? "Aceitar compra confirmada pelo banco."
    : "Negar compra confirmada pelo banco.";
}

export function PixValidacaoActions({
  transacao,
  acaoEmAndamento,
  onAceitar,
  onNegar,
  compacto = false,
}: PixValidacaoActionsProps) {
  const auditoria = obterAuditoriaValidacaoPix(transacao);

  if (!onAceitar && !onNegar) return null;
  if (!auditoria.podeAceitar && !auditoria.podeNegar) return null;

  const desabilitarAceite = !auditoria.podeAceitar || Boolean(acaoEmAndamento);
  const desabilitarNegacao = !auditoria.podeNegar || Boolean(acaoEmAndamento);

  return (
    <Stack
      direction="row"
      spacing={0.75}
      justifyContent={compacto ? "flex-start" : "flex-end"}
      flexWrap="wrap"
      useFlexGap
    >
      <Tooltip
        title={obterTooltipAcao(
          "aceitar",
          auditoria.mensagemBloqueio,
          acaoEmAndamento,
        )}
      >
        <span>
          <Button
            type="button"
            size="small"
            disabled={desabilitarAceite}
            startIcon={
              acaoEmAndamento === "aceitar" ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )
            }
            onClick={() => onAceitar?.(transacao.id)}
            sx={{
              ...components.botaoAceitar,
              minWidth: compacto ? 96 : 104,
            }}
          >
            Aceitar
          </Button>
        </span>
      </Tooltip>

      <Tooltip
        title={obterTooltipAcao(
          "negar",
          auditoria.mensagemBloqueio,
          acaoEmAndamento,
        )}
      >
        <span>
          <Button
            type="button"
            size="small"
            disabled={desabilitarNegacao}
            startIcon={
              acaoEmAndamento === "negar" ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <BlockOutlinedIcon fontSize="small" />
              )
            }
            onClick={() => onNegar?.(transacao.id)}
            sx={{
              ...components.botaoNegar,
              minWidth: compacto ? 88 : 96,
            }}
          >
            Negar
          </Button>
        </span>
      </Tooltip>
    </Stack>
  );
}
