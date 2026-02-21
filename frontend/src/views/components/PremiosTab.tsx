// ============================================================================
// ARQUIVO: frontend/src/views/components/PremiosTab.tsx
// RESPONSABILIDADE: Componente Pai que orquestra a vitrine de prêmios.
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";

import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { useRifasController } from "../../controllers/useRifasController";

// ============================================================================
// FUNÇÃO UTILITÁRIA: Formatar Data (YYYY-MM-DD -> 20 de Dezembro de 2026)
// ============================================================================
const formatarDataExtenso = (dataIso: string) => {
  if (!dataIso || !dataIso.includes("-")) return dataIso; // Se já for texto livre, não quebra
  const [ano, mes, dia] = dataIso.split("-");
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${dia} de ${meses[parseInt(mes) - 1]} de ${ano}`;
};

// ============================================================================
// COMPONENTE 1: HEADER BANNER (Cabeçalho do Sorteio)
// ============================================================================
const HeroBanner = ({ infoSorteio, isAdmin, onEditClick }: any) => (
  <Paper
    elevation={3}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2 0%, #115293 100%)",
      color: "white",
      position: "relative",
    }}
  >
    {isAdmin && (
      <IconButton
        onClick={onEditClick}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "rgba(255,255,255,0.2)",
          color: "white",
        }}
      >
        <EditIcon />
      </IconButton>
    )}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <EmojiEventsIcon sx={{ fontSize: 60, mb: 1, color: "#ffd700" }} />
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {infoSorteio.titulo}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
          color: "#90caf9",
        }}
      >
        <CalendarMonthIcon /> Data do Sorteio:{" "}
        {formatarDataExtenso(infoSorteio.data)}
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 600 }}>
        {infoSorteio.descricao}
      </Typography>
    </Box>
  </Paper>
);

// ============================================================================
// COMPONENTE 2: CARD DE PRÊMIO
// ============================================================================
const PremioCard = ({ premio, isAdmin, onEditClick }: any) => (
  <Card
    elevation={2}
    sx={{
      borderRadius: 2,
      position: "relative",
      borderTop: "4px solid #1976d2",
      height: "100%",
    }}
  >
    {isAdmin && (
      <IconButton
        size="small"
        onClick={() => onEditClick(premio)}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "white",
          boxShadow: 1,
          zIndex: 2,
        }}
      >
        <EditIcon fontSize="small" color="primary" />
      </IconButton>
    )}

    {premio.imagem_url ? (
      <CardMedia
        component="img"
        height="200"
        image={premio.imagem_url}
        alt={premio.titulo}
        sx={{ objectFit: "cover" }}
      />
    ) : (
      <Box
        sx={{
          height: 200,
          bgcolor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CardGiftcardIcon sx={{ fontSize: 60, color: "grey.400" }} />
      </Box>
    )}

    <CardContent sx={{ textAlign: "center", pt: 2 }}>
      <Typography
        variant="overline"
        color="primary"
        fontWeight="bold"
        display="block"
      >
        {premio.colocacao}
      </Typography>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {premio.titulo}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {premio.descricao}
      </Typography>
    </CardContent>
  </Card>
);

// ============================================================================
// COMPONENTE PRINCIPAL: PREMIOS TAB (Orquestrador)
// ============================================================================
export function PremiosTab({ isAdmin }: { isAdmin: boolean }) {
  const {
    buscarPremios,
    salvarInfoSorteio,
    salvarPremio,
    excluirPremio,
    uploadImagemPremio,
  } = useRifasController();

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  // Estados do Banco de Dados
  const [infoSorteio, setInfoSorteio] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });
  const [premios, setPremios] = useState<any[]>([]);

  // Estados dos Modais
  const [modalHeaderAberto, setModalHeaderAberto] = useState(false);
  const [modalPremioAberto, setModalPremioAberto] = useState(false);
  const [premioEmEdicao, setPremioEmEdicao] = useState<any>(null);

  // Estados da Imagem
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);

  const carregarDados = async () => {
    setCarregando(true);
    const dados = await buscarPremios();
    if (dados) {
      setInfoSorteio(dados.infoSorteio);
      setPremios(dados.premios);
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --------------------------------------------------------
  // AÇÕES: CABEÇALHO
  // --------------------------------------------------------
  const guardarHeader = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    const formData = new FormData(e.currentTarget);
    const novosDados = {
      titulo: formData.get("titulo") as string,
      data: formData.get("data") as string, // Agora pega o formato nativo do calendário YYYY-MM-DD
      descricao: formData.get("descricao") as string,
    };

    await salvarInfoSorteio(novosDados);
    await carregarDados(); // Recarrega os dados imediatamente
    setModalHeaderAberto(false);
    setSalvando(false);
  };

  // --------------------------------------------------------
  // AÇÕES: PRÊMIOS
  // --------------------------------------------------------
  const abrirModalPremio = (premio?: any) => {
    setPremioEmEdicao(
      premio || { colocacao: "", titulo: "", descricao: "", imagem_url: "" },
    );
    setArquivoFoto(null);
    setPreviewFoto(premio?.imagem_url || null);
    setModalPremioAberto(true);
  };

  const lidarComFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArquivoFoto(file);
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const guardarNovoPremio = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    const formData = new FormData(e.currentTarget);

    let urlDaImagem = premioEmEdicao.imagem_url;
    if (arquivoFoto) urlDaImagem = await uploadImagemPremio(arquivoFoto);

    const dadosPremio = {
      id: premioEmEdicao.id,
      colocacao: formData.get("colocacao") as string,
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      imagem_url: urlDaImagem,
    };

    await salvarPremio(dadosPremio);
    await carregarDados(); // Auto-Update na tela
    setModalPremioAberto(false);
    setSalvando(false);
  };

  const removerPremio = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este prêmio?")) return;
    setSalvando(true);
    await excluirPremio(id);
    await carregarDados(); // Auto-Update na tela
    setModalPremioAberto(false);
    setSalvando(false);
  };

  if (carregando)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ pb: 4, pt: 2 }}>
      {/* 1. RENDERIZA O BANNER */}
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={isAdmin}
        onEditClick={() => setModalHeaderAberto(true)}
      />

      {/* 2. BARRA DE TÍTULO DOS PRÊMIOS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Prêmios em Disputa
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => abrirModalPremio()}
          >
            Adicionar Prêmio
          </Button>
        )}
      </Box>

      {/* 3. GRID DOS PRÊMIOS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {premios.map((premio) => (
          <PremioCard
            key={premio.id}
            premio={premio}
            isAdmin={isAdmin}
            onEditClick={abrirModalPremio}
          />
        ))}
      </Box>
      {premios.length === 0 && (
        <Typography color="text.secondary" textAlign="center" mt={5}>
          Nenhum prêmio cadastrado.
        </Typography>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: EDITAR HEADER (Com Calendário Nativo)              */}
      {/* ========================================================= */}
      <Dialog
        open={modalHeaderAberto}
        onClose={() => setModalHeaderAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Evento</DialogTitle>
        <form onSubmit={guardarHeader}>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              defaultValue={infoSorteio.titulo}
              margin="normal"
              required
            />

            {/* O Calendário Inteligente */}
            <TextField
              fullWidth
              type="date"
              label="Data do Sorteio"
              name="data"
              defaultValue={infoSorteio.data}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }} // Mantém o texto da label em cima para não bugar o calendário
            />

            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              defaultValue={infoSorteio.descricao}
              margin="normal"
              multiline
              rows={3}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setModalHeaderAberto(false)}
              disabled={salvando}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={salvando}>
              {salvando ? "A Salvar..." : "Salvar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: EDITAR PRÊMIO (Com Upload de Foto)                 */}
      {/* ========================================================= */}
      <Dialog
        open={modalPremioAberto}
        onClose={() => setModalPremioAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {premioEmEdicao?.id ? "Editar Prêmio" : "Novo Prêmio"}
        </DialogTitle>
        <form onSubmit={guardarNovoPremio}>
          <DialogContent dividers>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
                p: 2,
                border: "1px dashed #ccc",
                borderRadius: 2,
              }}
            >
              {previewFoto ? (
                <img
                  src={previewFoto}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "contain",
                    marginBottom: 16,
                  }}
                />
              ) : (
                <Typography color="text.secondary" mb={2}>
                  Nenhuma foto anexada
                </Typography>
              )}
              <input
                accept="image/*"
                id="upload-foto-premio"
                type="file"
                style={{ display: "none" }}
                onChange={lidarComFoto}
              />
              <label htmlFor="upload-foto-premio">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                >
                  Escolher Foto
                </Button>
              </label>
            </Box>

            <TextField
              fullWidth
              label="Colocação (Ex: 1º Lugar)"
              name="colocacao"
              defaultValue={premioEmEdicao?.colocacao}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Nome do Prêmio"
              name="titulo"
              defaultValue={premioEmEdicao?.titulo}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              defaultValue={premioEmEdicao?.descricao}
              margin="normal"
              multiline
              rows={2}
              required
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
            {premioEmEdicao?.id ? (
              <Button
                color="error"
                onClick={() => removerPremio(premioEmEdicao.id)}
                disabled={salvando}
              >
                Excluir
              </Button>
            ) : (
              <Box />
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={() => setModalPremioAberto(false)}
                disabled={salvando}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="contained" disabled={salvando}>
                {salvando ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Gravar Prêmio"
                )}
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
