import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Chip,
  CircularProgress, // NOVO: O ícone de carregamento do Material UI
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";

// NOVO: Importando o nosso controlador que faz o serviço pesado
import { useRifasController } from "../../services/useRifasController";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numerosRifas: string[];
}

export function CheckoutModal({
  open,
  onClose,
  onSuccess,
  numerosRifas,
}: CheckoutModalProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);

  // NOVO: Puxando a função de venda e o estado de carregamento do nosso Hook
  const { finalizarVenda, loading } = useRifasController();

  const chavePixComissao = "comissao.engenharia@unifei.edu.br";
  const PRECO_RIFA = 10.0;
  const valorTotal = numerosRifas.length * PRECO_RIFA;
  const valorFormatado = valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixComissao);
    alert("Chave PIX copiada para a área de transferência!");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setComprovante(event.target.files[0]);
    }
  };

  // NOVO: A função agora é assíncrona (async) porque vai esperar o upload terminar
  const handleFinalizar = async () => {
    if (!comprovante) return;

    // Dispara a função real que envia para o Firebase Storage e depois pro Backend Node.js
    const sucesso = await finalizarVenda({
      nome,
      telefone,
      email,
      numerosRifas,
      comprovante,
    });

    if (sucesso) {
      alert("Sucesso! Venda enviada para a tesouraria.");
      // Limpa os campos para a próxima venda
      setNome("");
      setTelefone("");
      setEmail("");
      setComprovante(null);
      onSuccess(); // Fecha o modal e limpa o carrinho no Dashboard
    }
  };

  // A validação agora trava o botão se estiver faltando dados OU se estiver carregando (loading)
  const formValido =
    nome.trim() !== "" && telefone.trim() !== "" && comprovante !== null;

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#1976d2", color: "white" }}
      >
        Finalizar Venda ({numerosRifas.length} selecionadas)
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading} // Não deixa fechar o modal no meio do envio
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Números selecionados:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {numerosRifas.map((numero) => (
              <Chip key={numero} label={numero} color="primary" size="small" />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          1. Dados do Comprador
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <TextField
            label="Nome Completo *"
            variant="outlined"
            size="small"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={loading}
            required
          />
          <TextField
            label="WhatsApp (com DDD) *"
            variant="outlined"
            size="small"
            fullWidth
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            disabled={loading}
            placeholder="(35) 99999-9999"
            required
          />
          <TextField
            label="E-mail (Opcional)"
            variant="outlined"
            size="small"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            helperText="Enviaremos o recibo para este e-mail."
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          2. Pagamento PIX ({valorFormatado})
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, backgroundColor: "#f5f5f5", textAlign: "center" }}
        >
          <QrCode2Icon sx={{ fontSize: 60, color: "#333", mb: 1 }} />
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Transfira <strong>{valorFormatado}</strong> para a chave abaixo:
          </Typography>
          <TextField
            value={chavePixComissao}
            disabled
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleCopiarPix}
                    edge="end"
                    color="primary"
                    disabled={loading}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Divider sx={{ mb: 3 }} />

        <Typography
          variant="subtitle1"
          fontWeight="bold"
          gutterBottom
          color="primary"
        >
          3. Enviar Comprovante
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            component="label"
            variant={comprovante ? "outlined" : "contained"}
            color={comprovante ? "success" : "primary"}
            startIcon={<CloudUploadIcon />}
            fullWidth
            disabled={loading}
          >
            {comprovante ? "Trocar Comprovante" : "Anexar Imagem ou PDF"}
            <input
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </Button>
          {comprovante && (
            <Typography variant="body2" color="success.main">
              Arquivo: {comprovante.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleFinalizar}
          variant="contained"
          color="success"
          disabled={!formValido || loading}
          sx={{ minWidth: 160 }} // Garante que o botão não encolha quando o ícone aparecer
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Confirmar Venda"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
