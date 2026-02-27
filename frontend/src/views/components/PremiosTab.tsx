// ============================================================================
// ARQUIVO: frontend/src/views/components/PremiosTab.tsx
// RESPONSABILIDADE: Orquestrar a vitrine interativa de prêmios e gerir modais.
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  CircularProgress,
} from "@mui/material";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { useRifasController } from "../../controllers/useRifasController";
import { HeroBanner } from "./HeroBanner";
import { PremioCard } from "./PremioCard";

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

  const [infoSorteio, setInfoSorteio] = useState({
    titulo: "",
    data: "",
    descricao: "",
  });
  const [premios, setPremios] = useState<any[]>([]);

  const [modalHeaderAberto, setModalHeaderAberto] = useState(false);
  const [modalPremioAberto, setModalPremioAberto] = useState(false);
  const [premioEmEdicao, setPremioEmEdicao] = useState<any>(null);

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

  const guardarHeader = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSalvando(true);
    const formData = new FormData(e.currentTarget);
    const novosDados = {
      titulo: formData.get("titulo") as string,
      data: formData.get("data") as string,
      descricao: formData.get("descricao") as string,
    };
    await salvarInfoSorteio(novosDados);
    await carregarDados();
    setModalHeaderAberto(false);
    setSalvando(false);
  };

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
    if (arquivoFoto) {
      try {
        urlDaImagem = await uploadImagemPremio(arquivoFoto);
      } catch (error) {
        console.error("Falha no upload");
      }
    }

    const dadosPremio = {
      id: premioEmEdicao.id,
      colocacao: formData.get("colocacao") as string,
      titulo: formData.get("titulo") as string,
      descricao: formData.get("descricao") as string,
      imagem_url: urlDaImagem,
    };

    await salvarPremio(dadosPremio);
    await carregarDados();
    setModalPremioAberto(false);
    setSalvando(false);
  };

  const removerPremio = async (id: string) => {
    if (
      !window.confirm(
        "Tem a certeza que deseja excluir este prêmio? A ação é irreversível.",
      )
    )
      return;
    setSalvando(true);
    await excluirPremio(id);
    await carregarDados();
    setModalPremioAberto(false);
    setSalvando(false);
  };

  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 6, pt: 2 }}>
      <HeroBanner
        infoSorteio={infoSorteio}
        isAdmin={isAdmin}
        onEditClick={() => setModalHeaderAberto(true)}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary.main"
          sx={{ borderLeft: "4px solid var(--cor-dourado-brilho)", pl: 2 }}
        >
          Prêmios
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => abrirModalPremio()}
            sx={{ borderRadius: 8 }}
          >
            Novo Prêmio
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
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
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            bgcolor: "transparent",
            border: "2px dashed #ccc",
          }}
        >
          <CardGiftcardIcon
            sx={{ fontSize: 60, color: "text.disabled", mb: 1 }}
          />
          <Typography color="text.secondary" variant="h6">
            Nenhum prêmio anunciado ainda.
          </Typography>
          <Typography color="text.disabled" variant="body2">
            A comissão atualizará esta secção em breve.
          </Typography>
        </Paper>
      )}

      {/* MODAL HEADER */}
      <Dialog
        open={modalHeaderAberto}
        onClose={() => !salvando && setModalHeaderAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
          Editar Evento Oficial
        </DialogTitle>
        <form onSubmit={guardarHeader}>
          <DialogContent dividers sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Título do Sorteio"
              name="titulo"
              defaultValue={infoSorteio.titulo}
              margin="normal"
              required
              autoFocus
            />
            <TextField
              fullWidth
              type="date"
              label="Data do Sorteio"
              name="data"
              defaultValue={infoSorteio.data}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Descrição Motivacional"
              name="descricao"
              defaultValue={infoSorteio.descricao}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setModalHeaderAberto(false)}
              disabled={salvando}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              disabled={salvando}
            >
              {salvando ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Guardar Alterações"
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* MODAL PRÊMIO */}
      <Dialog
        open={modalPremioAberto}
        onClose={() => !salvando && setModalPremioAberto(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white", pb: 2 }}>
          {premioEmEdicao?.id ? "Editar Prêmio" : "Cadastrar Novo Prêmio"}
        </DialogTitle>
        <form onSubmit={guardarNovoPremio}>
          <DialogContent dividers sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
                p: 3,
                border: "2px dashed",
                borderColor: "grey.300",
                borderRadius: 2,
                bgcolor: "grey.50",
              }}
            >
              {previewFoto ? (
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={previewFoto}
                    alt="Preview"
                    style={{
                      width: "100%",
                      maxHeight: 220,
                      objectFit: "contain",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  />
                </Box>
              ) : (
                <>
                  <PhotoCameraIcon
                    sx={{ fontSize: 40, color: "grey.400", mb: 1 }}
                  />
                  <Typography color="text.secondary" mb={2} variant="body2">
                    Anexe uma imagem ilustrativa (Opcional)
                  </Typography>
                </>
              )}
              <input
                accept="image/*"
                id="upload-foto-premio"
                type="file"
                style={{ display: "none" }}
                onChange={lidarComFoto}
                disabled={salvando}
              />
              <label htmlFor="upload-foto-premio">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCameraIcon />}
                  disabled={salvando}
                >
                  {previewFoto ? "Trocar Imagem" : "Escolher Imagem"}
                </Button>
              </label>
            </Box>

            <TextField
              fullWidth
              label="Colocação (Ex: 1º Lugar, Prêmio Extra)"
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
              label="Especificações / Detalhes"
              name="descricao"
              defaultValue={premioEmEdicao?.descricao}
              margin="normal"
              multiline
              rows={3}
              required
            />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: 3,
              py: 2,
              bgcolor: "grey.50",
            }}
          >
            {premioEmEdicao?.id ? (
              <Button
                color="error"
                onClick={() => removerPremio(premioEmEdicao.id)}
                disabled={salvando}
              >
                Excluir Definitivamente
              </Button>
            ) : (
              <Box />
            )}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => setModalPremioAberto(false)}
                disabled={salvando}
                color="inherit"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={salvando}
                sx={{ minWidth: 120 }}
              >
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
