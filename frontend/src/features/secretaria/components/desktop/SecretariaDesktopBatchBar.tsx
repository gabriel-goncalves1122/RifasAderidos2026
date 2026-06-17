import { Box, Button, Chip, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupIcon from "@mui/icons-material/Group";

interface SecretariaDesktopBatchBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onExportarSelecionados: () => void;
  onAtivarSelecionados: () => void;
  onAlterarCargoSelecionados: () => void;
}

export function SecretariaDesktopBatchBar({
  selectedCount,
  onClearSelection,
  onExportarSelecionados,
  onAtivarSelecionados,
  onAlterarCargoSelecionados,
}: SecretariaDesktopBatchBarProps) {
  if (selectedCount === 0) return null;

  const btnSx = {
    color: "text.primary",
    borderColor: "divider",
    "&:hover": { borderColor: "text.primary", bgcolor: "action.hover" },
    borderRadius: 4,
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 40,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        boxShadow: "0 12px 48px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        py: 1.5,
        bgcolor: "#fff",
        color: "text.primary",
        borderRadius: 8,
      }}
    >
      <GroupIcon fontSize="small" />
      <Typography variant="body2" fontWeight={700}>
        {selectedCount} selecionado{selectedCount !== 1 ? "s" : ""}
      </Typography>

      <Box sx={{ flex: 1 }} />

      <Button
        size="small"
        variant="outlined"
        startIcon={<CheckCircleOutlineIcon />}
        onClick={onAtivarSelecionados}
        sx={btnSx}
      >
        Ativar
      </Button>

      <Button
        size="small"
        variant="outlined"
        startIcon={<ManageAccountsIcon />}
        onClick={onAlterarCargoSelecionados}
        sx={btnSx}
      >
        Alterar cargo
      </Button>

      <Button
        size="small"
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={onExportarSelecionados}
        sx={btnSx}
      >
        Exportar
      </Button>

      <Chip
        label="Limpar seleção"
        size="small"
        onDelete={onClearSelection}
        deleteIcon={<ClearIcon />}
        sx={{ color: "text.secondary", bgcolor: "action.hover", "&:hover": { bgcolor: "action.selected" } }}
      />
    </Box>
  );
}
