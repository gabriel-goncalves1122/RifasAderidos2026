import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { PixTransacao } from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
  formatarRifasPix,
  obterLabelStatusConciliacao,
  obterLabelStatusPagamento,
} from "../../../../utils/pixTransacoesUtils";
import { obterAuditoriaValidacaoPix } from "../../../../utils/pixValidacaoUtils";
import { PixValidacaoChip } from "./PixValidacaoChip";

interface PixTransacaoDetalhesDialogProps {
  transacao: PixTransacao | null;
  onClose: () => void;
}

function CampoDetalhe({
  label,
  valor,
}: {
  label: string;
  valor?: string | number | null;
}) {
  return (
    <Box
      sx={{
        p: 1.35,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        border: "1px solid rgba(2, 27, 22, 0.08)",
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          color: "#526760",
          fontSize: "0.72rem",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: "#021B16",
          fontSize: "0.92rem",
          fontWeight: 850,
          mt: 0.35,
          overflowWrap: "anywhere",
        }}
      >
        {valor || "Não informado"}
      </Typography>
    </Box>
  );
}

export function PixTransacaoDetalhesDialog({
  transacao,
  onClose,
}: PixTransacaoDetalhesDialogProps) {
  if (!transacao) return null;

  const auditoria = obterAuditoriaValidacaoPix(transacao);
  const valor =
    transacao.statusPagamento === "PAID"
      ? transacao.valorPago
      : transacao.valorBruto;

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="pix-transacao-detalhes-titulo"
      PaperProps={{
        sx: {
          borderRadius: 2.25,
        },
      }}
    >
      <DialogTitle
        id="pix-transacao-detalhes-titulo"
        sx={{
          pr: 7,
          color: "#021B16",
          fontWeight: 950,
        }}
      >
        Detalhes da transação Pix
        <IconButton
          aria-label="Fechar detalhes da transação Pix"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            borderRadius: 2,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1, pb: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <PixValidacaoChip transacao={transacao} />
            <Typography
              component="span"
              sx={{
                alignSelf: "center",
                color: "#526760",
                fontSize: "0.86rem",
              }}
            >
              {auditoria.descricao}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 1.25,
            }}
          >
            <CampoDetalhe label="Pagador" valor={transacao.compradorNome} />
            <CampoDetalhe label="E-mail" valor={transacao.compradorEmail} />
            <CampoDetalhe label="Documento" valor={transacao.compradorDocumento} />
            <CampoDetalhe label="Telefone" valor={transacao.compradorTelefone} />
            <CampoDetalhe
              label="Valor"
              valor={formatarMoedaPix(valor)}
            />
            <CampoDetalhe
              label="Data"
              valor={formatarDataPix(
                transacao.dataPagamento || transacao.dataCriacao,
              )}
            />
            <CampoDetalhe
              label="Status do pagamento"
              valor={obterLabelStatusPagamento(transacao.statusPagamento)}
            />
            <CampoDetalhe
              label="Status do vínculo"
              valor={obterLabelStatusConciliacao(transacao.statusConciliacao)}
            />
            <CampoDetalhe label="Aderido" valor={transacao.aderido?.nome} />
            <CampoDetalhe
              label="Tipo de aderido"
              valor={
                transacao.aderido?.modalidade_adesao === "meio"
                  ? "Meio-aderido"
                  : transacao.aderido
                    ? "Aderido"
                    : "Não vinculado"
              }
            />
            <CampoDetalhe label="Rifas" valor={formatarRifasPix(transacao)} />
            <CampoDetalhe label="Venda" valor={transacao.vendaId} />
            <CampoDetalhe
              label="Código de autenticação"
              valor={transacao.codigoAutenticacao}
            />
            <CampoDetalhe label="NSU" valor={transacao.nsu} />
            <CampoDetalhe label="Observação" valor={transacao.observacao} />
            <CampoDetalhe
              label="Motivo da negativa"
              valor={transacao.motivoNegacao}
            />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
