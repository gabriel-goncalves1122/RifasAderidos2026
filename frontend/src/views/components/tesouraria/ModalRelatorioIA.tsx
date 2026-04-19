// ============================================================================
// ARQUIVO: frontend/src/views/components/tesouraria/ModalRelatorioIA.tsx
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { TransacaoAgrupada } from "./AuditoriaTable";
import { CardAuditoriaIA } from "./CardAuditoriaIA";
import { ModalInspecaoIA } from "./ModalInspencaoIA";

// Função utilitária para fatiar as strings
export const extrairDadosIA = (log: string | undefined) => {
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
            sx={{ borderLeft: "5px solid", borderColor: "success.main", mb: 2 }}
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
            <AccordionDetails sx={{ bgcolor: "white", p: { xs: 1, sm: 2 } }}>
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
                      onClick={() => onAprovarLote(aprovadas)}
                      startIcon={<CheckCircleIcon />}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Aprovar todos os {aprovadas.length}
                    </Button>
                  </Box>
                  {aprovadas.map((t) => (
                    <CardAuditoriaIA
                      key={t.comprovante_url || t.bilhetes[0]}
                      transacao={t}
                      sucesso={true}
                      dadosExtraidos={extrairDadosIA(
                        t.ia_mensagem || t.log_automacao,
                      )}
                      motivo={motivos[t.comprovante_url || t.bilhetes[0]] || ""}
                      onMotivoChange={(m) =>
                        setMotivos((prev) => ({
                          ...prev,
                          [t.comprovante_url || t.bilhetes[0]]: m,
                        }))
                      }
                      onInspecionar={() => setTransacaoComparacao(t)}
                      onRecusar={() => {}}
                    />
                  ))}
                </>
              )}
            </AccordionDetails>
          </Accordion>

          <Accordion
            defaultExpanded
            sx={{ borderLeft: "5px solid", borderColor: "warning.main" }}
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
            <AccordionDetails sx={{ bgcolor: "white", p: { xs: 1, sm: 2 } }}>
              {divergentes.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2, textAlign: "center" }}
                >
                  A IA não encontrou nenhuma divergência! O lote foi perfeito.
                </Typography>
              ) : (
                divergentes.map((t) => (
                  <CardAuditoriaIA
                    key={t.comprovante_url || t.bilhetes[0]}
                    transacao={t}
                    sucesso={false}
                    dadosExtraidos={extrairDadosIA(
                      t.ia_mensagem || t.log_automacao,
                    )}
                    motivo={motivos[t.comprovante_url || t.bilhetes[0]] || ""}
                    onMotivoChange={(m) =>
                      setMotivos((prev) => ({
                        ...prev,
                        [t.comprovante_url || t.bilhetes[0]]: m,
                      }))
                    }
                    onInspecionar={() => setTransacaoComparacao(t)}
                    onRecusar={() =>
                      handleRecusar(
                        t.comprovante_url || t.bilhetes[0],
                        t.comprovante_url,
                        t.bilhetes,
                      )
                    }
                  />
                ))
              )}
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        <DialogActions
          sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #eee" }}
        >
          <Button onClick={onClose} variant="outlined" color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <ModalInspecaoIA
        transacao={transacaoComparacao}
        dadosOcr={extrairDadosIA(
          transacaoComparacao?.ia_mensagem ||
            transacaoComparacao?.log_automacao,
        )}
        onClose={() => setTransacaoComparacao(null)}
      />
    </>
  );
}
