// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/ModalCorrecaoRecusa.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Checkbox,
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
  FormControlLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

import {
  DadosCorrecaoRecusa,
  GrupoRifasRecusadas,
} from "./types/painelAderido";
import { obterDicaCorrecaoRecusa } from "./utils/obterDicaCorrecaoRecusa";

interface ModalCorrecaoRecusaProps {
  open: boolean;
  onClose: () => void;
  grupoRecusado: GrupoRifasRecusadas | null;
  onCorrigirDados: (
    numeros: string[],
    dadosAtualizados: DadosCorrecaoRecusa,
  ) => Promise<boolean>;
}

const formatarTelefone = (valor: string) => {
  if (!valor) return "";

  const apenasNumeros = valor.replace(/\D/g, "");

  if (apenasNumeros.length <= 2) {
    return apenasNumeros.length > 0 ? `(${apenasNumeros}` : "";
  }
  if (apenasNumeros.length <= 6) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }
  if (apenasNumeros.length <= 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
  }

  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
};

export function ModalCorrecaoRecusa({
  open,
  onClose,
  grupoRecusado,
  onCorrigirDados,
}: ModalCorrecaoRecusaProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [dadosVerificados, setDadosVerificados] = useState(false);

  useEffect(() => {
    if (grupoRecusado) {
      setNome(grupoRecusado.comprador || "");
      setEmail(grupoRecusado.email || "");
      setTelefone(formatarTelefone(grupoRecusado.telefone || ""));
      setErro(null);
      setDadosVerificados(false);
    }
  }, [grupoRecusado]);

  if (!grupoRecusado) return null;

  const handleSubmeter = async () => {
    if (!nome.trim() || !telefone.trim()) {
      setErro("Informe nome e telefone para enviar a correção.");
      return;
    }

    if (!dadosVerificados) {
      setErro("Confirme que os dados foram verificados antes de reenviar.");
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      const sucesso = await onCorrigirDados(grupoRecusado.bilhetes, {
        nome: nome.trim(),
        email: email.trim(),
        telefone,
      });

      if (!sucesso) {
        setErro(
          "Correção de dados indisponível no momento. Tente novamente mais tarde.",
        );
        return;
      }

      onClose();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Erro ao corrigir dados:", error);
      }

      setErro(
        "Correção de dados indisponível no momento. Tente novamente mais tarde.",
      );
    } finally {
      setEnviando(false);
    }
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatarTelefone(e.target.value));
  };
  const dicaCorrecao = obterDicaCorrecaoRecusa(grupoRecusado.motivo);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#FFFFFF",
          color: "#021B16",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(2, 27, 22, 0.10)",
        }}
      >
        <Typography variant="h6" component="div" fontWeight="bold">
          Corrigir dados
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#063D31" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 2,
            bgcolor: "#FFF7E0",
            color: "#6B4E00",
            "& .MuiAlert-icon": {
              color: "#6B4E00",
            },
          }}
        >
          <Typography fontWeight={900} sx={{ mb: 0.5 }}>
            Por que foi recusada?
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {grupoRecusado.motivo}
          </Typography>
          <Typography variant="body2" fontWeight={800}>
            Dica: {dicaCorrecao}
          </Typography>
        </Alert>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Rifas para corrigir: {grupoRecusado.bilhetes.join(", ")}
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
            onChange={handleTelefoneChange}
            fullWidth
            size="small"
            placeholder="(XX) XXXXX-XXXX"
            slotProps={{
              htmlInput: { maxLength: 15 },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={dadosVerificados}
                onChange={(event) => setDadosVerificados(event.target.checked)}
                sx={{
                  color: "#063D31",
                  "&.Mui-checked": {
                    color: "#063D31",
                  },
                }}
              />
            }
            label="Verifiquei os dados"
            sx={{
              color: "#021B16",
              "& .MuiFormControlLabel-label": {
                fontWeight: 800,
              },
            }}
          />

          {erro && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {erro}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={enviando}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmeter}
          variant="contained"
          startIcon={<EditIcon />}
          disabled={
            enviando || !nome.trim() || !telefone.trim() || !dadosVerificados
          }
          sx={{
            bgcolor: "#063D31",
            "&:hover": {
              bgcolor: "#021B16",
            },
          }}
        >
          {enviando ? "Enviando..." : "Corrigir e Reenviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
