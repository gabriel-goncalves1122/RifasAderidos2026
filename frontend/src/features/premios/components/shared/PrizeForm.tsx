import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Box, Typography } from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import { surfaces } from "@/shared/tokens/surfaces";
import { components } from "@/shared/tokens/components";
import { colors } from "@/shared/tokens/colors";
import type { PremioData } from "../../types/premio";

interface PrizeFormProps {
  open: boolean;
  salvando: boolean;
  premioEmEdicao: PremioData | null;
  previewFoto: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onDelete: (id: string) => void;
  onFotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PrizeForm = ({
  open,
  salvando,
  premioEmEdicao,
  previewFoto,
  onClose,
  onSubmit,
  onDelete,
  onFotoChange,
}: PrizeFormProps) => (
  <Dialog
    open={open}
    onClose={salvando ? undefined : onClose}
    fullWidth
    maxWidth="sm"
    slotProps={{ paper: { sx: surfaces.dialog } }}
  >
    <DialogTitle sx={surfaces.dialogTitle}>
      {premioEmEdicao?.id ? "Editar Prêmio" : "Cadastrar Novo Prêmio"}
    </DialogTitle>
    <form onSubmit={onSubmit}>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
            p: 2.5,
            border: "2px dashed",
            borderColor: "rgba(2, 27, 22, 0.14)",
            borderRadius: 2,
            bgcolor: colors.fundoSuave,
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
                  maxHeight: 200,
                  objectFit: "contain",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              />
            </Box>
          ) : (
            <>
              <PhotoCameraIcon
                sx={{ fontSize: 36, color: colors.cinzaIcone, mb: 1 }}
              />
              <Typography color="text.secondary" mb={1.5} variant="body2">
                Anexe uma imagem ilustrativa (Opcional)
              </Typography>
            </>
          )}
          <input
            accept="image/*"
            id="upload-foto-premio"
            type="file"
            style={{ display: "none" }}
            onChange={onFotoChange}
            disabled={salvando}
          />
          <label htmlFor="upload-foto-premio">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCameraIcon />}
              disabled={salvando}
              sx={components.botaoSecundario}
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
      <DialogActions sx={surfaces.dialogActions}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {premioEmEdicao?.id ? (
            <Button
              onClick={() => onDelete(premioEmEdicao.id!)}
              disabled={salvando}
              sx={components.botaoExcluir}
            >
              Excluir Definitivamente
            </Button>
          ) : null}
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <Button
            onClick={onClose}
            disabled={salvando}
            sx={components.botaoCancelar}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={salvando}
            sx={{ ...components.botaoNovoPremio, minWidth: 120 }}
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
);
