// ============================================================================
// ARQUIVO: CheckoutModal.tsx (Interface de Venda e Upload)
// ============================================================================
import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import { useRifasController } from "../../controllers/useRifasController";

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
  // --------------------------------------------------------------------------
  // 1. ESTADOS LOCAIS (Dados do Comprador)
  // --------------------------------------------------------------------------
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [comprovante, setComprovante] = useState<File | null>(null);

  // Controller que gerencia o fluxo pesado (Upload + API)
  const { finalizarVenda, loading } = useRifasController();

  // --------------------------------------------------------------------------
  // 2. CICLO DE VIDA (Lifecycle)
  // --------------------------------------------------------------------------
  // GATILHO DE LIMPEZA: Toda a vez que o modal FECHAR (!open), nós apagamos
  // a memória dele. Evita que o "Pedro" apareça como comprador da próxima rifa.
  useEffect(() => {
    if (!open) {
      setNome("");
      setTelefone("");
      setEmail("");
      setComprovante(null);
    }
  }, [open]);

  // --------------------------------------------------------------------------
  // 3. VARIÁVEIS DE CÁLCULO
  // --------------------------------------------------------------------------
  const chavePixComissao = "comissao.engenharia@unifei.edu.br";
  const PRECO_RIFA = 10.0;
  const valorTotal = numerosRifas.length * PRECO_RIFA;
  const valorFormatado = valorTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // --------------------------------------------------------------------------
  // 4. AÇÕES (Handlers)
  // --------------------------------------------------------------------------
  const handleCopiarPix = () => {
    navigator.clipboard.writeText(chavePixComissao);
    // TODO: Trocar este alert nativo feio por um Snackbar do Material UI no futuro
    alert("Chave PIX copiada para a área de transferência!");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // PROTEÇÃO: Só atualiza se o utilizador realmente selecionou um ficheiro.
    // Se ele abriu a janela e cancelou, o event.target.files fica vazio e não quebra o app.
    if (event.target.files && event.target.files.length > 0) {
      setComprovante(event.target.files[0]);
    }
  };

  const handleFinalizar = async () => {
    if (!comprovante) return;

    // Dispara a pipeline completa: Storage (Imagem) -> Backend (API) -> Banco (Firestore)
    const sucesso = await finalizarVenda({
      nome,
      telefone,
      email,
      numerosRifas,
      comprovante,
    });

    if (sucesso) {
      alert("Sucesso! Venda enviada para a tesouraria.");
      onSuccess(); // O onSuccess do pai (Dashboard) é o responsável por fechar o modal e limpar o carrinho
    }
  };

  // Regra de Negócio: O botão só acende se os dados vitais existirem
  const formValido =
    nome.trim() !== "" && telefone.trim() !== "" && comprovante !== null;

  // --------------------------------------------------------------------------
  // 5. INTERFACE (UI)
  // --------------------------------------------------------------------------
  return (
    // O Dialog bloqueia cliques fora dele se estiver a carregar (disableEscapeKeyDown não funciona nativamente no onClose do Material UI, então condicionamos)
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      {/* CABEÇALHO */}
      <DialogTitle
        sx={{ m: 0, p: 2, backgroundColor: "#1976d2", color: "white" }}
      >
        Finalizar Venda ({numerosRifas.length} selecionadas)
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading} // Bloqueia o "X" enquanto faz o upload
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* RESUMO DO CARRINHO */}
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

        {/* SEÇÃO 1: FORMULÁRIO DO COMPRADOR */}
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

        {/* SEÇÃO 2: DADOS BANCÁRIOS */}
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

        {/* SEÇÃO 3: UPLOAD DO COMPROVANTE */}
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
            disabled={loading} // Trava o botão de procurar ficheiro durante o upload
          >
            {comprovante ? "Trocar Comprovante" : "Anexar Imagem ou PDF"}
            <input
              type="file"
              hidden
              accept="image/*,application/pdf"
              onChange={handleFileChange}
            />
          </Button>
          {/* Feedback visual de que o ficheiro foi anexado */}
          {comprovante && (
            <Typography variant="body2" color="success.main" fontWeight="bold">
              ✓ Ficheiro pronto: {comprovante.name}
            </Typography>
          )}
        </Box>
      </DialogContent>

      {/* RODAPÉ E AÇÃO FINAL */}
      <DialogActions sx={{ p: 2, backgroundColor: "#f8f9fa" }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleFinalizar}
          variant="contained"
          color="success"
          disabled={!formValido || loading}
          sx={{ minWidth: 160 }} // Evita que o botão "trema" quando o texto muda para o ícone de load
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
