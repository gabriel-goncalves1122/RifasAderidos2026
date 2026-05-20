// ============================================================================
// ARQUIVO: frontend/src/views/components/AuditoriaCard.tsx
// ============================================================================
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  TextField,
  Collapse,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { TransacaoAgrupada } from "./AuditoriaTable";

interface Props {
  transacao: TransacaoAgrupada;
  isProcessando: boolean;
  onVerPix: (url: string) => void;
  onAprovar: (url: string | null, bilhetes: string[]) => void;
  onRejeitar: (url: string | null, bilhetes: string[], motivo: string) => void;
}

export function AuditoriaCard({
  transacao,
  isProcessando,
  onVerPix,
  onAprovar,
  onRejeitar,
}: Props) {
  const [caixaRecusaAberta, setCaixaRecusaAberta] = useState(false);
  const [motivo, setMotivo] = useState("");

  const dataFormatada = transacao.data_reserva
    ? new Date(transacao.data_reserva).toLocaleString("pt-BR")
    : "Data Desconhecida";

  const valorTotal = transacao.valor_total.toFixed(2).replace(".", ",");

  const msgIA = transacao.ia_mensagem || transacao.log_automacao;
  const isAprovadoIA =
    transacao.ia_resultado === "APROVADO" || msgIA?.includes("✅");
  const isDivergenteIA =
    transacao.ia_resultado === "DIVERGENTE" ||
    transacao.ia_resultado === "ERRO" ||
    msgIA?.includes("⚠️") ||
    msgIA?.includes("❌");

  const handleRejeitarClick = () => {
    if (!caixaRecusaAberta) {
      setCaixaRecusaAberta(true);
    } else {
      onRejeitar(transacao.comprovante_url, transacao.bilhetes, motivo);
      setCaixaRecusaAberta(false);
      setMotivo("");
    }
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        borderLeft: "6px solid",
        borderColor: isAprovadoIA
          ? "success.main"
          : isDivergenteIA
            ? "warning.main"
            : "primary.main",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Reserva: {dataFormatada}
          </Typography>
          {msgIA && (
            <Chip
              icon={<SmartToyIcon />}
              label={
                isAprovadoIA ? "Pré-Aprovado pela IA" : "Divergência Detectada"
              }
              color={isAprovadoIA ? "success" : "warning"}
              size="small"
              variant="outlined"
            />
          )}
        </Box>

        {msgIA && (
          <Alert
            severity={isAprovadoIA ? "success" : "warning"}
            sx={{
              mb: 2,
              py: 0,
              "& .MuiAlert-message": { fontSize: "0.85rem" },
            }}
          >
            <strong>Relatório OCR:</strong> {msgIA}
          </Alert>
        )}

        {/* CORREÇÃO: Substituímos o <Grid> que dava erro por <Box display="grid"> */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{ p: 1.5, bgcolor: "#f5f5f5", borderRadius: 2, height: "100%" }}
          >
            <Typography
              variant="caption"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 1, display: "block" }}
            >
              O QUE PROCURAR NA IMAGEM:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AttachMoneyIcon color="success" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1}
                >
                  Valor do PIX
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="success.main"
                  lineHeight={1}
                >
                  R$ {valorTotal}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <PersonSearchIcon color="action" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1}
                >
                  Nome do Titular
                </Typography>
                <Typography variant="body2" fontWeight="bold" lineHeight={1}>
                  {transacao.comprador_nome}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              p: 1.5,
              border: "1px dashed #e0e0e0",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="bold"
              sx={{ mb: 1, display: "block" }}
            >
              INFORMAÇÕES DA VENDA:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <AssignmentIndIcon fontSize="small" color="primary" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1}
                >
                  Vendedor Responsável
                </Typography>
                <Typography variant="body2" fontWeight="bold" lineHeight={1}>
                  {transacao.vendedor_nome}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <ReceiptLongIcon fontSize="small" color="action" />
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  lineHeight={1}
                >
                  Números Reservados ({transacao.bilhetes.length})
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}
                >
                  {transacao.bilhetes.map((num: string) => (
                    <Chip
                      key={num}
                      label={num}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: "0.7rem" }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>

      <CardActions
        sx={{
          flexDirection: "column",
          px: 2,
          pb: 2,
          pt: 1,
          bgcolor: "#fafafa",
          borderTop: "1px solid #eee",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Button
            variant="contained"
            color="info"
            size="small"
            disableElevation
            startIcon={<VisibilityIcon />}
            disabled={!transacao.comprovante_url}
            onClick={() => onVerPix(transacao.comprovante_url!)}
          >
            Ver Imagem do PIX
          </Button>
          <Box sx={{ display: "flex", gap: 1 }}>
            {!caixaRecusaAberta && (
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={isProcessando}
                onClick={() =>
                  onAprovar(transacao.comprovante_url, transacao.bilhetes)
                }
                startIcon={
                  isProcessando ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <CheckCircleIcon />
                  )
                }
              >
                Aprovar Pagamento
              </Button>
            )}
            <Button
              variant={caixaRecusaAberta ? "contained" : "outlined"}
              color="error"
              size="small"
              disabled={isProcessando}
              onClick={handleRejeitarClick}
              startIcon={caixaRecusaAberta ? <SendIcon /> : <CancelIcon />}
            >
              {caixaRecusaAberta ? "Confirmar Recusa" : "Reprovar"}
            </Button>
          </Box>
        </Box>
        <Collapse in={caixaRecusaAberta} sx={{ width: "100%" }}>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Motivo da Recusa (Obrigatório)"
              variant="outlined"
              color="error"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: O PIX é de outro banco, imagem muito desfocada..."
            />
            <Button
              size="small"
              color="inherit"
              sx={{ mt: 1 }}
              onClick={() => setCaixaRecusaAberta(false)}
            >
              Cancelar
            </Button>
          </Box>
        </Collapse>
      </CardActions>
    </Card>
  );
}
