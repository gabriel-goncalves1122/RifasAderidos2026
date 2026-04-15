// ============================================================================
// ARQUIVO: frontend/src/views/components/tesouraria/CardAuditoriaIA.tsx
// ============================================================================
import { Box, Typography, Button, TextField, Alert } from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SendIcon from "@mui/icons-material/Send";
import { TransacaoAgrupada } from "./AuditoriaTable";

interface Props {
  transacao: TransacaoAgrupada;
  sucesso: boolean;
  dadosExtraidos: any;
  motivo: string;
  onMotivoChange: (novoMotivo: string) => void;
  onInspecionar: () => void;
  onRecusar: () => void;
}

export function CardAuditoriaIA({
  transacao,
  sucesso,
  dadosExtraidos,
  motivo,
  onMotivoChange,
  onInspecionar,
  onRecusar,
}: Props) {
  const valor = (transacao.bilhetes.length * 10).toFixed(2).replace(".", ",");
  const msgReal = transacao.ia_mensagem || transacao.log_automacao;

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        border: "1px solid",
        borderColor: sucesso ? "success.light" : "warning.light",
        borderRadius: 2,
        bgcolor: sucesso ? "#fcfdfc" : "#fffcf2",
      }}
    >
      {/* CABEÇALHO DO CARD - Responsivo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          mb: 1.5,
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="subtitle2"
            fontWeight="bold"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <AssignmentIndIcon fontSize="small" color="primary" /> Vendedor:{" "}
            {transacao.vendedor_nome}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
          >
            <PersonSearchIcon fontSize="small" color="action" /> Comprador
            Esperado: <strong>{transacao.comprador_nome}</strong>
          </Typography>
        </Box>
        <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
          <Typography variant="h6" fontWeight="bold" color="success.main">
            R$ {valor}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {transacao.bilhetes.length} rifas
          </Typography>
        </Box>
      </Box>

      {/* ALERTA DA IA */}
      <Alert
        severity={sucesso ? "success" : "warning"}
        sx={{ mb: 2, py: 0, wordBreak: "break-word" }}
      >
        {dadosExtraidos?.mensagemBruta || msgReal || "Sem parecer da IA"}
      </Alert>

      {/* DADOS EXTRAÍDOS - Stack responsivo no mobile */}
      {dadosExtraidos &&
        (dadosExtraidos.banco || dadosExtraidos.idTransacao) && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 2fr" },
              gap: 1.5,
              mb: 2,
            }}
          >
            {dadosExtraidos.banco && (
              <Box
                sx={{
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
                  Banco de Origem
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {dadosExtraidos.banco}
                </Typography>
              </Box>
            )}
            {dadosExtraidos.titularLido && (
              <Box
                sx={{
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
                  Titular Vinculado (IA)
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {dadosExtraidos.titularLido}
                </Typography>
              </Box>
            )}
            {dadosExtraidos.idTransacao && (
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
                  {dadosExtraidos.idTransacao}
                </Typography>
              </Box>
            )}
          </Box>
        )}

      {/* ÁREA DE AÇÕES - Empilhada no Mobile */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
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
          disabled={!transacao.comprovante_url}
          onClick={onInspecionar}
          sx={{ width: { xs: "100%", md: "auto" } }}
        >
          Inspecionar Imagem
        </Button>

        {!sucesso && (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flex: 1,
              gap: 1,
              maxWidth: { md: "60%" },
            }}
          >
            <TextField
              fullWidth
              size="small"
              label="Motivo da Recusa"
              variant="outlined"
              color="error"
              placeholder="Ex: ID Divergente"
              value={motivo}
              onChange={(e) => onMotivoChange(e.target.value)}
            />
            <Button
              variant="contained"
              color="error"
              endIcon={<SendIcon />}
              onClick={onRecusar}
              sx={{ width: { xs: "100%", sm: "auto" }, minWidth: "120px" }}
            >
              Recusar
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
