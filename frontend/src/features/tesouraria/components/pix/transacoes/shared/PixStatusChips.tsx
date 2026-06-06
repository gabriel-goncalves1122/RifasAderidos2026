
import { Chip } from "@mui/material";

import {
  StatusConciliacaoPix,
  StatusPagamentoPix,
} from "../../../../types/pixTransacoes";
import {
  obterLabelStatusConciliacao,
  obterLabelStatusPagamento,
} from "../../../../utils/pixTransacoesUtils";

interface StatusPagamentoChipProps {
  status: StatusPagamentoPix;
}

interface StatusConciliacaoChipProps {
  status: StatusConciliacaoPix;
}

const PAGAMENTO_STYLES: Record<
  StatusPagamentoPix,
  { color: string; bgcolor: string; border: string }
> = {
  WAITING: {
    color: "#6B4E00",
    bgcolor: "#FFF1CC",
    border: "1px solid rgba(143, 104, 0, 0.34)",
  },
  PAID: {
    color: "#FFFFFF",
    bgcolor: "#063D31",
    border: "1px solid #063D31",
  },
  AUTHORIZED: {
    color: "#FFFFFF",
    bgcolor: "#0B6B57",
    border: "1px solid #0B6B57",
  },
  IN_ANALYSIS: {
    color: "#4E3B00",
    bgcolor: "#FFF1CC",
    border: "1px solid rgba(143, 104, 0, 0.25)",
  },
  DECLINED: {
    color: "#7A1F1F",
    bgcolor: "#FDF0F0",
    border: "1px solid rgba(122, 31, 31, 0.22)",
  },
  CANCELED: {
    color: "#526760",
    bgcolor: "#F6F8F7",
    border: "1px solid rgba(2, 27, 22, 0.10)",
  },
};

const CONCILIACAO_STYLES: Record<
  StatusConciliacaoPix,
  { color: string; bgcolor: string; border: string }
> = {
  pendente: {
    color: "#6B4E00",
    bgcolor: "#FFF1CC",
    border: "1px solid rgba(143, 104, 0, 0.34)",
  },
  conciliada: {
    color: "#063D31",
    bgcolor: "#DDECE6",
    border: "1px solid rgba(6, 61, 49, 0.26)",
  },
  nao_identificada: {
    color: "#7A1F1F",
    bgcolor: "#FDF0F0",
    border: "1px solid rgba(122, 31, 31, 0.22)",
  },
  divergente: {
    color: "#7A1F1F",
    bgcolor: "#FDF0F0",
    border: "1px solid rgba(122, 31, 31, 0.22)",
  },
  cancelada: {
    color: "#526760",
    bgcolor: "#F6F8F7",
    border: "1px solid rgba(2, 27, 22, 0.10)",
  },
};

function chipSx(estilo: { color: string; bgcolor: string; border: string }) {
  return {
    height: 28,
    borderRadius: 2,
    fontWeight: 850,
    fontSize: "0.74rem",
    color: estilo.color,
    bgcolor: estilo.bgcolor,
    border: estilo.border,
    "& .MuiChip-label": {
      px: 1,
    },
  };
}

export function StatusPagamentoChip({ status }: StatusPagamentoChipProps) {
  const estilo = PAGAMENTO_STYLES[status];

  return (
    <Chip
      label={obterLabelStatusPagamento(status)}
      size="small"
      sx={chipSx(estilo)}
    />
  );
}

export function StatusConciliacaoChip({ status }: StatusConciliacaoChipProps) {
  const estilo = CONCILIACAO_STYLES[status];

  return (
    <Chip
      label={obterLabelStatusConciliacao(status)}
      size="small"
      sx={chipSx(estilo)}
    />
  );
}
