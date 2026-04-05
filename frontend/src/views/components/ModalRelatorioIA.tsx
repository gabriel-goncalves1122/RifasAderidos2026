import { useState } from "react";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BadgeIcon from "@mui/icons-material/Badge";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import CancelIcon from "@mui/icons-material/Cancel";
import { TransacaoAgrupada } from "./AuditoriaTable";

const extrairDadosIA = (log: string | undefined) => {
  if (!log) return null;
  const isAprovado = log.includes("✅");
  const bancoMatch = log.match(/Banco \[(.*?)\]/);
  const idMatch = log.match(/- ID (.*?)(?: \| lido|$)/);
  const titularMatch = log.match(/Titular: (.*?)(?: -|$)/);

  return {
    isAprovado,
    mensagemBruta: log.replace(
      /✅ Pré-aprovado pela IA: |⚠️ Divergência: |❌ /,
      "",
    ),
    banco: bancoMatch ? bancoMatch[1] : null,
    idTransacao: idMatch ? idMatch[1].trim() : null,
    titularOriginal: titularMatch ? titularMatch[1].trim() : null,
  };
};

interface Props {
  open: boolean;
  onClose: () => void;
  transacoes: TransacaoAgrupada[];
  onAprovarLote: (transacoes: TransacaoAgrupada[]) => void;
  onRejeitar: (url: string | null, bilhetes: string[], motivo: string) => void;
}

export function ModalRelatorioIA({
  open,
  onClose,
  transacoes,
  onAprovarLote,
  onRejeitar,
}: Props) {
  const [transacaoComparacao, setTransacaoComparacao] =
    useState<TransacaoAgrupada | null>(null);
  const [motivos, setMotivos] = useState<Record<string, string>>({}); // Guarda os textos de cada card divergente

  const aprovadas = transacoes.filter((t) => t.log_automacao?.includes("✅"));
  const divergentes = transacoes.filter(
    (t) => t.log_automacao && !t.log_automacao.includes("✅"),
  );

  const atualizarMotivo = (id: string, texto: string) => {
    setMotivos((prev) => ({ ...prev, [id]: texto }));
  };

  const renderCardDetalhe = (t: TransacaoAgrupada, sucesso: boolean) => {
    const dados = extrairDadosIA(t.log_automacao);
    const idIdentificador = t.comprovante_url || t.bilhetes[0];

    return (
      <Box
        key={idIdentificador}
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "#fafafa",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight="bold"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "primary.dark",
              }}
            >
              <BadgeIcon fontSize="small" /> Aderido: {t.vendedor_nome}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <PersonIcon fontSize="small" /> Comprador Informado:{" "}
              {t.comprador_nome}
            </Typography>
          </Box>
          <Chip
            label={`R$ ${(t.bilhetes.length * 10).toFixed(2).replace(".", ",")}`}
            size="small"
            color="default"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Typography
          variant="body2"
          color={sucesso ? "success.main" : "error.main"}
          fontWeight="bold"
          mb={1.5}
        >
          {sucesso
            ? "✔️ Validado na Tesouraria"
            : `⚠️ ${dados?.mensagemBruta || t.log_automacao}`}
        </Typography>

        {dados && (dados.banco || dados.idTransacao) && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
              gap: 1.5,
              bgcolor: "white",
              p: 1.5,
              borderRadius: 1,
              border: "1px dashed #e0e0e0",
            }}
          >
            {dados.banco && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <AccountBalanceIcon fontSize="inherit" /> Banco Origem
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {dados.banco}
                </Typography>
              </Box>
            )}
            {dados.idTransacao && (
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <ReceiptIcon fontSize="inherit" /> ID da Transação
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ wordBreak: "break-all", fontFamily: "monospace" }}
                >
                  {dados.idTransacao}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* BOTÃO DA IMAGEM LADO A LADO */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<VisibilityIcon />}
              disabled={!t.comprovante_url}
              onClick={() => setTransacaoComparacao(t)}
            >
              Comparar Comprovante
            </Button>
          </Box>

          {/* CAIXA DE TEXTO E RECUSA DIRETO NO RELATÓRIO (Apenas se for Divergente) */}
          {!sucesso && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: 1,
                p: 1.5,
                bgcolor: "#ffeeee",
                borderRadius: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Mensagem para o Aderido"
                variant="outlined"
                color="error"
                placeholder="Explique o motivo da recusa..."
                value={motivos[idIdentificador] || ""}
                onChange={(e) =>
                  atualizarMotivo(idIdentificador, e.target.value)
                }
              />
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() =>
                  onRejeitar(
                    t.comprovante_url,
                    t.bilhetes,
                    motivos[idIdentificador] || "",
                  )
                }
              >
                Recusar Comprovante
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const dadosComparacao = transacaoComparacao
    ? extrairDadosIA(transacaoComparacao.log_automacao)
    : null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FactCheckIcon /> Relatório Detalhado da IA
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: { xs: 2, sm: 3 }, bgcolor: "#ffffff" }}>
          <DialogContentText sx={{ mb: 3, fontWeight: "bold" }}>
            Cruze os nomes do sistema com os titulares reais.
          </DialogContentText>

          <Accordion
            defaultExpanded
            sx={{ borderLeft: "4px solid #4caf50", mb: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="success.dark">
                Pré-Aprovados ({aprovadas.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {aprovadas.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhum comprovante validado.
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{ mb: 3, display: "flex", justifyContent: "center" }}
                  >
                    {/* BOTÃO DE APROVAÇÃO EM LOTE */}
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => onAprovarLote(aprovadas)}
                      startIcon={<CheckCircleIcon />}
                    >
                      Aprovar os {aprovadas.length} comprovantes validados
                    </Button>
                  </Box>
                  {aprovadas.map((t) => renderCardDetalhe(t, true))}
                </>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            defaultExpanded
            sx={{ borderLeft: "4px solid #ff9800", boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="warning.dark">
                Divergências ({divergentes.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {divergentes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma divergência!
                </Typography>
              ) : (
                divergentes.map((t) => renderCardDetalhe(t, false))
              )}
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "#f9f9f9" }}>
          <Button
            onClick={onClose}
            variant="contained"
            color="primary"
            size="large"
          >
            Voltar para Auditoria
          </Button>
        </DialogActions>
      </Dialog>

      {/* SUB-MODAL DE ACAREAÇÃO (MANTIDO IGUAL) */}
      <Dialog
        open={!!transacaoComparacao}
        onClose={() => setTransacaoComparacao(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: "#1e1e1e",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CompareArrowsIcon /> Modo de Acareação
          </Box>
          <IconButton
            onClick={() => setTransacaoComparacao(null)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 0,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            bgcolor: "#f5f5f5",
          }}
        >
          <Box
            sx={{
              flex: { md: 6 },
              bgcolor: "#000",
              minHeight: "50vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            {transacaoComparacao?.comprovante_url && (
              <img
                src={transacaoComparacao.comprovante_url}
                alt="Comprovante"
                style={{
                  maxWidth: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              flex: { md: 4 },
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: "white",
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Dados Extraídos pela IA
            </Typography>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <ReceiptIcon fontSize="small" /> ID da Transação:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f0f4ff",
                  borderRadius: 1,
                  border: "1px dashed #bcccff",
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ wordBreak: "break-all", fontFamily: "monospace" }}
                >
                  {dadosComparacao?.idTransacao || "Não identificado"}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AssignmentIndIcon fontSize="small" /> Titular LIDO:
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={0.5}>
                {dadosComparacao?.titularOriginal || "Não identificado"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AccountBalanceIcon fontSize="small" /> Banco LIDO:
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={0.5}>
                {dadosComparacao?.banco || "Não identificado"}
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <PersonIcon fontSize="small" /> Comprador Informado:
              </Typography>
              <Typography variant="body1" fontWeight="bold" mt={0.5}>
                {transacaoComparacao?.comprador_nome}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
