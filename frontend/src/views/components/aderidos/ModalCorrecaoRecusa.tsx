// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/ModalCorrecaoRecusa.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Box,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface ModalCorrecaoRecusaProps {
  open: boolean;
  onClose: () => void;
  grupoRecusado: any; // Dados do grupo selecionado
  onReenviar: (
    numeros: string[],
    novoComprovante: File,
    dadosAtualizados: any,
  ) => Promise<void>;
}

// ==========================================================================
// FUNÇÃO DE MÁSCARA (CORRETOR)
// ==========================================================================
const formatarTelefone = (valor: string) => {
  if (!valor) return "";

  // Remove tudo o que não for número
  const apenasNumeros = valor.replace(/\D/g, "");

  // Aplica a formatação (XX) XXXXX-XXXX progressivamente
  if (apenasNumeros.length <= 2) {
    return apenasNumeros.length > 0 ? `(${apenasNumeros}` : "";
  }
  if (apenasNumeros.length <= 6) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }
  if (apenasNumeros.length <= 10) {
    // Fixo (XX) XXXX-XXXX
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
  }

  // Telemóvel (XX) XXXXX-XXXX (Limita ao tamanho máximo)
  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
};

export function ModalCorrecaoRecusa({
  open,
  onClose,
  grupoRecusado,
  onReenviar,
}: ModalCorrecaoRecusaProps) {
  const [comprovante, setComprovante] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Preenche os dados automaticamente quando o modal abre
  useEffect(() => {
    if (grupoRecusado) {
      setNome(grupoRecusado.comprador || "");
      setEmail(grupoRecusado.email || "");
      // Já aplica a máscara na hora de preencher os dados antigos
      setTelefone(formatarTelefone(grupoRecusado.telefone || ""));
      setComprovante(null);
    }
  }, [grupoRecusado]);

  if (!grupoRecusado) return null;

  const handleSubmeter = async () => {
    if (!comprovante) {
      alert("Por favor, anexe o novo comprovativo.");
      return;
    }
    setEnviando(true);
    try {
      await onReenviar(grupoRecusado.bilhetes, comprovante, {
        nome,
        email,
        telefone,
      });
      onClose();
    } catch (error) {
      console.error("Erro ao reenviar:", error);
      alert("Ocorreu um erro ao reenviar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "error.main",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          Corrigir Rifas Negadas
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="error" sx={{ mb: 3 }}>
          <strong>Motivo da Recusa:</strong> {grupoRecusado.motivo}
        </Alert>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Rifas afetadas: {grupoRecusado.bilhetes.join(", ")}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Nome do Comprador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="E-mail (Opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            size="small"
          />
          <TextField
            label="Telefone do Comprador"
            value={telefone}
            onChange={handleTelefoneChange} // <-- Atualizado para usar a função de máscara
            fullWidth
            size="small"
            placeholder="(XX) XXXXX-XXXX"
            slotProps={{
              htmlInput: { maxLength: 15 }, // <-- Limite físico de caracteres
            }}
          />

          <Button
            variant="outlined"
            component="label"
            color={comprovante ? "success" : "primary"}
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 1, py: 1.5, borderStyle: "dashed", borderWidth: 2 }}
          >
            {comprovante
              ? `Anexado: ${comprovante.name}`
              : "Anexar Novo Comprovativo (PDF/Imagem)"}
            <input
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setComprovante(e.target.files[0]);
                }
              }}
            />
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={enviando}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmeter}
          variant="contained"
          color="primary"
          disabled={enviando || !comprovante}
        >
          {enviando ? "A enviar..." : "Reenviar para Análise"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
