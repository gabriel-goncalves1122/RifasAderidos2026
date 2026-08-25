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

import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";
import { layout } from "../../../../styles/layout";
import { PixTransacao } from "../../../../types/pixTransacoes";
import {
  formatarDataPix,
  formatarMoedaPix,
  formatarRifasPix,
  obterLabelStatusPagamento,
} from "../../../../utils/pixTransacoesUtils";

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
    <Box sx={surfaces.cartaoInfo}>
      <Typography sx={typography.label}>
        {label}
      </Typography>
      <Typography
        sx={{
          ...typography.bodyDestaque,
          fontSize: "0.92rem",
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
        sx: surfaces.dialog,
      }}
    >
      <DialogTitle
        id="pix-transacao-detalhes-titulo"
        sx={{ ...typography.titulo, pr: 7 }}
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

          <Box sx={layout.gridDois}>
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
            <CampoDetalhe label="ID do Comprador" valor={transacao.compradorId} />
            <CampoDetalhe
              label="Código de autenticação"
              valor={transacao.codigoAutenticacao}
            />
            <CampoDetalhe label="NSU" valor={transacao.nsu} />
              <CampoDetalhe label="Observação" valor={transacao.observacao} />
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
