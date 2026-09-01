import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { surfaces } from "@/shared/tokens/surfaces";
import { typographyScale as typography } from "@/shared/tokens/typography";
import { layout } from "../../../../styles/layout";
import { useTesourariaLayout } from "../../../../hooks/useTesourariaLayout";
import { PixTransacao } from "../../../../types/pixTransacoes";
import { PixTransacaoAcoes } from "./PixTransacaoAcoes";
import {
  formatarDataPix,
  formatarMoedaPix,
  formatarRifasPix,
  obterLabelStatusPagamento,
} from "../../../../utils/pixTransacoesUtils";

interface PixTransacaoDetalhesDialogProps {
  transacao: PixTransacao | null;
  onClose: () => void;
  onAceitar: (id: string) => Promise<void>;
  onNegar: (id: string, motivo: string) => Promise<void>;
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
  onAceitar,
  onNegar,
}: PixTransacaoDetalhesDialogProps) {
  const { isMobile } = useTesourariaLayout();
  if (!transacao) return null;
  const valor =
    transacao.statusPagamento === "PAID"
      ? transacao.valorPago
      : transacao.valorBruto;

  const conteudoDetalhes = (
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
  );

  const acoes = (
    <PixTransacaoAcoes 
      transacao={transacao} 
      onConcluido={onClose} 
      onAceitar={onAceitar} 
      onNegar={onNegar} 
    />
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open
        onClose={onClose}
        PaperProps={{
          sx: layout.drawerPaper,
        }}
      >
        <Stack spacing={2} sx={{ pb: 2 }}>
          <Box sx={layout.drawerPullHandle} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ ...typography.titulo, fontSize: "1.2rem" }}>
              Detalhes da transação Pix
            </Typography>
            <IconButton onClick={onClose} size="small" sx={{ color: colors.cinzaTexto }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflowY: "auto", px: 0.5, pb: 2 }}>
            {conteudoDetalhes}
          </Box>
          <Box sx={{ pt: 1, borderTop: `1px solid ${colors.borda}` }}>
            {acoes}
          </Box>
        </Stack>
      </Drawer>
    );
  }

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
        {conteudoDetalhes}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
        {acoes}
      </DialogActions>
    </Dialog>
  );
}
