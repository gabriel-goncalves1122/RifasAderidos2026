import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  TextField,
  Collapse,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
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
    ? new Date(transacao.data_reserva).toLocaleDateString("pt-BR")
    : "N/A";
  const valorTotal = (transacao.bilhetes.length * 10)
    .toFixed(2)
    .replace(".", ",");
  const isAprovado = transacao.log_automacao?.includes("✅");

  const handleRejeitarClick = () => {
    if (!caixaRecusaAberta) {
      setCaixaRecusaAberta(true); // Abre a caixa de texto
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
        borderColor: isAprovado ? "success.main" : "warning.main",
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <CalendarTodayIcon fontSize="small" /> {dataFormatada}
          </Typography>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="success.main"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <AttachMoneyIcon /> {valorTotal}
          </Typography>
        </Box>

        {transacao.log_automacao && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: isAprovado ? "#e8f5e9" : "#fff3e0",
              borderRadius: 1,
              border: "1px solid",
              borderColor: isAprovado ? "#c8e6c9" : "#ffe0b2",
            }}
          >
            <Typography
              variant="body2"
              fontWeight="bold"
              color={isAprovado ? "success.dark" : "warning.dark"}
            >
              {transacao.log_automacao}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary">
              Vendido por:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <BadgeIcon fontSize="small" color="primary" />{" "}
              {transacao.vendedor_nome}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Comprado por:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <PersonIcon fontSize="small" color="secondary" />{" "}
              {transacao.comprador_nome}
            </Typography>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Rifas ({transacao.bilhetes.length}):
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
          {transacao.bilhetes.map((num: string) => (
            <Chip
              key={num}
              label={num}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: "bold" }}
            />
          ))}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          flexDirection: "column",
          px: 2,
          pb: 2,
          pt: 1,
          bgcolor: "#f9f9f9",
          borderTop: "1px solid #eee",
          gap: 1,
        }}
      >
        {/* Barra Superior de Ações */}
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
            variant="outlined"
            size="small"
            startIcon={<VisibilityIcon />}
            disabled={!transacao.comprovante_url}
            onClick={() => onVerPix(transacao.comprovante_url!)}
          >
            Ver Pix
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
                Aprovar
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
              {caixaRecusaAberta ? "Confirmar Recusa" : "Rejeitar"}
            </Button>
          </Box>
        </Box>

        {/* Caixa de Texto que abre apenas se clicar em Rejeitar */}
        <Collapse in={caixaRecusaAberta} sx={{ width: "100%" }}>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Motivo da Recusa (Mensagem para o aderido)"
              variant="outlined"
              color="error"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ex: O comprovante é de outro banco..."
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
