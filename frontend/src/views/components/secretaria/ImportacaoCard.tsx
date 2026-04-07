// ============================================================================
// ARQUIVO: frontend/src/views/components/ImportacaoCard.tsx
// ============================================================================
import { Box, Typography, Button, Paper } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";

interface Props {
  onImportar: () => void;
}

export function ImportacaoCard({ onImportar }: Props) {
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
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h6" color="primary.dark" fontWeight="bold">
          Importação de Aderidos (Keeper)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Faça o upload do Excel oficial para injetar novos e-mails.
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadFileIcon />}
        onClick={onImportar}
        sx={{ px: 4, py: 1 }}
      >
        Injetar Lista
      </Button>
    </Paper>
  );
}
