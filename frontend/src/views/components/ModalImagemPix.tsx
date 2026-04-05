import { Dialog, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  url: string | null;
  onClose: () => void;
}

export function ModalImagemPix({ url, onClose }: Props) {
  return (
    <Dialog open={!!url} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          position: "relative",
          backgroundColor: "#000",
          minHeight: "300px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "white",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <CloseIcon />
        </IconButton>
        {url && (
          <img
            src={url}
            alt="Comprovante Pix"
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
            }}
          />
        )}
      </Box>
    </Dialog>
  );
}
