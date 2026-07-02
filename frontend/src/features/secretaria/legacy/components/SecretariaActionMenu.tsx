import { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface SecretariaActionMenuProps {
  onExportar: () => void;
  onImportarClick: () => void;
  disabled?: boolean;
}

export function SecretariaActionMenu({
  onExportar,
  onImportarClick,
  disabled,
}: SecretariaActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<MoreVertIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      >
        Ações
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onImportarClick();
          }}
        >
          <ListItemIcon><FileUploadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Injetar CSV</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={() => {
            handleClose();
            onExportar();
          }}
        >
          <ListItemIcon><FileDownloadIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Exportar Dados (ZIP)</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
