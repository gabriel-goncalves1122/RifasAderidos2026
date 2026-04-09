// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ImportacaoCard.tsx
// ============================================================================
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import { useRef, useState } from "react";
import { useCompactacao } from "../../../controllers/useCompactacao";

interface Props {
  onImportar: (ficheiro: File) => Promise<void>;
}

export function ImportacaoCard({ onImportar }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingImport, setLoadingImport] = useState(false);

  // O nosso novo Hook de Exportação/ZIP
  const { solicitarCompactacao, loadingCompactacao, erroCompactacao } =
    useCompactacao();

  // ==========================================================================
  // FUNÇÃO: INJETAR CSV
  // ==========================================================================
  const handleSelecaoArquivo = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("Por favor, selecione um ficheiro .csv");
      return;
    }

    setLoadingImport(true);
    try {
      await onImportar(file);
    } finally {
      setLoadingImport(false);
      // Limpa o input para poder importar o mesmo ficheiro novamente se necessário
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // ==========================================================================
  // FUNÇÃO: EXPORTAR BACKUP / RELATÓRIO (ZIP)
  // ==========================================================================
  const handleDownloadRelatorio = async () => {
    // Você pode enviar os IDs ou nomes dos ficheiros que quer que o backend compacte.
    // Neste caso, vamos enviar uma flag para o backend saber que queremos um "backup_geral".
    const sucesso = await solicitarCompactacao("Backup_Secretaria", [
      "backup_geral",
    ]);

    if (!sucesso) {
      alert("Ops, algo falhou na exportação: " + erroCompactacao);
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        borderLeft: "5px solid #1976d2",
        bgcolor: "#f8fafd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
      }}
    >
      <Box sx={{ flex: "1 1 300px" }}>
        <Typography variant="h6" color="primary.dark" fontWeight="bold">
          Gestão de Dados (Keeper)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Faça o upload do CSV para injetar aderidos ou descarregue o backup
          oficial.
        </Typography>
      </Box>

      {/* Input invisível para a janela de upload do Windows/Mac */}
      <input
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleSelecaoArquivo}
      />

      <Stack
        direction="row"
        spacing={2}
        flexWrap="wrap"
        useFlexGap
        sx={{ gap: { xs: 2, sm: 0 } }}
      >
        {/* BOTÃO 1: EXPORTAR (ZIP) */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownloadRelatorio}
          disabled={loadingCompactacao || loadingImport}
          startIcon={
            loadingCompactacao ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <FolderZipIcon />
            )
          }
          sx={{ px: 3, py: 1 }}
        >
          {loadingCompactacao ? "A Compactar..." : "Exportar Dados (ZIP)"}
        </Button>

        {/* BOTÃO 2: IMPORTAR CSV */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current?.click()}
          disabled={loadingImport || loadingCompactacao}
          startIcon={
            loadingImport ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <UploadFileIcon />
            )
          }
          sx={{ px: 3, py: 1 }}
        >
          {loadingImport ? "Processando..." : "Injetar CSV"}
        </Button>
      </Stack>
    </Paper>
  );
}
