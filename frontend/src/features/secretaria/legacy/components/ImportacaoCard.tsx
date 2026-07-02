import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Stack,
  Collapse,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useRef, useState } from "react";

import { useCompactacao } from "../../legacy/hooks/useCompactacao";

interface ImportacaoCardProps {
  onImportar: (ficheiro: File) => Promise<void>;
  collapsible?: boolean;
}

export function ImportacaoCard({ onImportar, collapsible }: ImportacaoCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loadingImport, setLoadingImport] = useState(false);
  const [expanded, setExpanded] = useState(!collapsible);

  const { solicitarCompactacao, loadingCompactacao, erroCompactacao } =
    useCompactacao();

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
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDownloadRelatorio = async () => {
    const sucesso = await solicitarCompactacao("Backup_Secretaria", [
      "backup_geral",
    ]);

    if (!sucesso) {
      alert("Ops, algo falhou na exportação: " + erroCompactacao);
    }
  };

  const content = (
    <Box
      sx={{
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
          Faça o upload do CSV para injetar aderidos ou descarregue o backup oficial.
        </Typography>
      </Box>

      <input
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={handleSelecaoArquivo}
      />

      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleDownloadRelatorio}
          disabled={loadingCompactacao || loadingImport}
          startIcon={
            loadingCompactacao ? <CircularProgress size={20} color="inherit" /> : <FolderZipIcon />
          }
          sx={{ px: 3, py: 1 }}
        >
          {loadingCompactacao ? "A Compactar..." : "Exportar Dados (ZIP)"}
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => inputRef.current?.click()}
          disabled={loadingImport || loadingCompactacao}
          startIcon={
            loadingImport ? <CircularProgress size={20} color="inherit" /> : <UploadFileIcon />
          }
          sx={{ px: 3, py: 1 }}
        >
          {loadingImport ? "Processando..." : "Injetar CSV"}
        </Button>
      </Stack>
    </Box>
  );

  if (collapsible) {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          borderLeft: "5px solid #1976d2",
          bgcolor: "#f8fafd",
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
          onClick={() => setExpanded(!expanded)}
        >
          <Typography variant="subtitle2" fontWeight="bold" color="primary.dark">
            Gestão de Dados (Keeper)
          </Typography>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>{content}</Box>
        </Collapse>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 2,
        borderLeft: "5px solid #1976d2",
        bgcolor: "#f8fafd",
      }}
    >
      {content}
    </Paper>
  );
}
