// ============================================================================
// ARQUIVO: frontend/src/views/components/ModalRelatorioIA.tsx
// ============================================================================
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
  IconButton,
  TextField,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SendIcon from "@mui/icons-material/Send";
import { TransacaoAgrupada } from "./AuditoriaTable";

// Função para tentar extrair os dados da string que a API Python nos envia
const extrairDadosIA = (log: string | undefined) => {
  if (!log) return null;
  const bancoMatch = log.match(/Banco \[(.*?)\]/);
  const idMatch = log.match(/- ID (.*?)(?: \| lido|$)/);
  const titularMatch = log.match(/Titular: (.*?)(?: -|$)/);

  return {
    mensagemBruta: log.replace(
      /✅ Pré-aprovado pela IA: |⚠️ Divergência: |❌ /,
      "",
    ),
    banco: bancoMatch ? bancoMatch[1] : null,
    idTransacao: idMatch ? idMatch[1].trim() : null,
    titularLido: titularMatch ? titularMatch[1].trim() : null,
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
  const [motivos, setMotivos] = useState<Record<string, string>>({});

  const aprovadas = transacoes.filter((t) => {
    const msg = t.ia_mensagem || t.log_automacao;
    return t.ia_resultado === "APROVADO" || msg?.includes("✅");
  });

  const divergentes = transacoes.filter((t) => {
    const msg = t.ia_mensagem || t.log_automacao;
    return (
      t.ia_resultado === "DIVERGENTE" ||
      t.ia_resultado === "ERRO" ||
      msg?.includes("⚠️") ||
      msg?.includes("❌") ||
      (!t.ia_resultado && !msg?.includes("✅"))
    );
  });

  const handleRecusar = (
    idIdentificador: string,
    url: string | null,
    bilhetes: string[],
  ) => {
    onRejeitar(
      url,
      bilhetes,
      motivos[idIdentificador] ||
        "Comprovativo rejeitado pela Tesouraria (via IA).",
    );
    setMotivos((prev) => ({ ...prev, [idIdentificador]: "" }));
  };

  const renderCardDetalhe = (t: TransacaoAgrupada, sucesso: boolean) => {
    const msgReal = t.ia_mensagem || t.log_automacao;
    const dados = extrairDadosIA(msgReal);
    const idIdentificador = t.comprovante_url || t.bilhetes[0];
    const valor = (t.bilhetes.length * 10).toFixed(2).replace(".", ",");

    return (
      <Box
        key={idIdentificador}
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid",
          borderColor: sucesso ? "success.light" : "warning.light",
          borderRadius: 2,
          bgcolor: sucesso ? "#fcfdfc" : "#fffcf2",
        }}
      >
        {/* CABEÇALHO DO CARD */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
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
                color: "text.primary",
              }}
            >
              <AssignmentIndIcon fontSize="small" color="primary" /> Vendedor:{" "}
              {t.vendedor_nome}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
            >
              <PersonSearchIcon fontSize="small" color="action" /> Comprador
              Esperado: <strong>{t.comprador_nome}</strong>
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              R$ {valor}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t.bilhetes.length} rifas
            </Typography>
          </Box>
        </Box>

        {/* ALERTA DA IA */}
        <Alert severity={sucesso ? "success" : "warning"} sx={{ mb: 2, py: 0 }}>
          {msgReal || "Sem parecer da IA"}
        </Alert>

        {/* DADOS EXTRAÍDOS (Substituído o Grid por Box display="grid" seguro) */}
        {dados && (dados.banco || dados.idTransacao) && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
              gap: 1.5,
              mb: 2,
            }}
          >
            {dados.banco && (
              <Box
                sx={{
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 1,
                  border: "1px solid #eee",
                  height: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Banco de Origem
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {dados.banco}
                </Typography>
              </Box>
            )}
            {dados.titularLido && (
              <Box
                sx={{
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 1,
                  border: "1px solid #eee",
                  height: "100%",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Titular Lido no Comprovante
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {dados.titularLido}
                </Typography>
              </Box>
            )}
            {dados.idTransacao && (
              <Box
                sx={{
                  gridColumn: "1 / -1",
                  p: 1,
                  bgcolor: "white",
                  borderRadius: 1,
                  border: "1px solid #eee",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  ID da Transação Extraído
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

        {/* ÁREA DE AÇÕES */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: { sm: "center" },
            justifyContent: "space-between",
            mt: 2,
            pt: 2,
            borderTop: "1px dashed #e0e0e0",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            color="primary"
            startIcon={<VisibilityIcon />}
            disabled={!t.comprovante_url}
            onClick={() => setTransacaoComparacao(t)}
          >
            Inspecionar Imagem
          </Button>

          {!sucesso && (
            <Box
              sx={{ display: "flex", flex: 1, gap: 1, maxWidth: { sm: "60%" } }}
            >
              <TextField
                fullWidth
                size="small"
                label="Motivo da Recusa"
                variant="outlined"
                color="error"
                placeholder="Ex: Não encontrei o ID no sistema..."
                value={motivos[idIdentificador] || ""}
                onChange={(e) =>
                  setMotivos((prev) => ({
                    ...prev,
                    [idIdentificador]: e.target.value,
                  }))
                }
              />
              <Button
                variant="contained"
                color="error"
                sx={{ minWidth: "130px" }}
                endIcon={<SendIcon />}
                onClick={() =>
                  handleRecusar(idIdentificador, t.comprovante_url, t.bilhetes)
                }
              >
                Recusar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const dadosComparacao = transacaoComparacao
    ? extrairDadosIA(
        transacaoComparacao.ia_mensagem || transacaoComparacao.log_automacao,
      )
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
            bgcolor: "#2c3e50",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FactCheckIcon /> Relatório Analítico da Inteligência Artificial
        </DialogTitle>

        <DialogContent sx={{ mt: 2, p: { xs: 2, sm: 3 }, bgcolor: "#f8f9fa" }}>
          <DialogContentText sx={{ mb: 3 }}>
            O OCR analisou as imagens e comparou os IDs com a sua base de dados
            bancária. Revise as divergências com atenção.
          </DialogContentText>

          <Accordion
            defaultExpanded
            sx={{
              borderLeft: "5px solid",
              borderColor: "success.main",
              mb: 2,
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "#f4fcf5" }}
            >
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="success.dark">
                Pré-Aprovados com Sucesso ({aprovadas.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "white" }}>
              {aprovadas.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  Nenhum comprovante 100% validado pela IA neste lote.
                </Typography>
              ) : (
                <>
                  <Box
                    sx={{
                      mb: 3,
                      display: "flex",
                      justifyContent: "center",
                      p: 2,
                      bgcolor: "#f4fcf5",
                      borderRadius: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => onAprovarLote(aprovadas)}
                      startIcon={<CheckCircleIcon />}
                    >
                      Carimbar e Aprovar todos os {aprovadas.length}{" "}
                      comprovantes
                    </Button>
                  </Box>
                  {aprovadas.map((t) => renderCardDetalhe(t, true))}
                </>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            defaultExpanded
            sx={{
              borderLeft: "5px solid",
              borderColor: "warning.main",
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ bgcolor: "#fffdf5" }}
            >
              <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="warning.dark">
                Requerem Auditoria Manual ({divergentes.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "white" }}>
              {divergentes.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  A IA não encontrou nenhuma divergência! O lote foi perfeito.
                </Typography>
              ) : (
                divergentes.map((t) => renderCardDetalhe(t, false))
              )}
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        <DialogActions
          sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #eee" }}
        >
          <Button onClick={onClose} variant="outlined" color="primary">
            Fechar e Voltar à Fila Principal
          </Button>
        </DialogActions>
      </Dialog>

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
            bgcolor: "#111",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CompareArrowsIcon /> Inspetor de Comprovativo (Acareação)
          </Box>
          <IconButton
            onClick={() => setTransacaoComparacao(null)}
            sx={{ color: "white" }}
            size="small"
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
            bgcolor: "#eee",
          }}
        >
          <Box
            sx={{
              flex: { md: 7 },
              bgcolor: "#222",
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
                alt="Comprovante Pix"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: "4px",
                }}
              />
            )}
          </Box>

          <Box
            sx={{
              flex: { md: 5 },
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              bgcolor: "white",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              sx={{
                borderBottom: "2px solid",
                borderColor: "primary.main",
                pb: 1,
              }}
            >
              Dados Extraídos (OCR)
            </Typography>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <ReceiptLongIcon fontSize="small" /> ID da Transação Pix:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "#f8f9fa",
                  borderRadius: 1,
                  border: "1px solid #ddd",
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{
                    wordBreak: "break-all",
                    fontFamily: "monospace",
                    color: dadosComparacao?.idTransacao
                      ? "text.primary"
                      : "error.main",
                  }}
                >
                  {dadosComparacao?.idTransacao || "NÃO LOCALIZADO NA IMAGEM"}
                </Typography>
              </Box>
            </Box>

            {/* O segundo Box seguro no lugar do Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                >
                  <PersonSearchIcon fontSize="small" /> Titular (Lido):
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  mt={0.5}
                  color={
                    dadosComparacao?.titularLido
                      ? "text.primary"
                      : "text.secondary"
                  }
                >
                  {dadosComparacao?.titularLido || "Desconhecido"}
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
                  <AccountBalanceIcon fontSize="small" /> Banco (Lido):
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  mt={0.5}
                  color={
                    dadosComparacao?.banco ? "text.primary" : "text.secondary"
                  }
                >
                  {dadosComparacao?.banco || "Desconhecido"}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                mt: "auto",
                p: 2,
                bgcolor: "#fffdf5",
                borderRadius: 2,
                border: "1px dashed #ffc107",
              }}
            >
              <Typography
                variant="caption"
                color="warning.dark"
                fontWeight="bold"
                display="block"
                mb={1}
              >
                EXPECTATIVA DO SISTEMA:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                O aderente informou que o titular da conta pagadora seria:
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color="text.primary"
              >
                {transacaoComparacao?.comprador_nome}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
