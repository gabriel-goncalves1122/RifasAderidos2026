import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from "@mui/material";

import { surfaces } from "../../styles/surfaces";
import { components } from "../../styles/components";
import type { InfoSorteio } from "../../types/sorteio";

interface HeaderFormProps {
  open: boolean;
  salvando: boolean;
  infoSorteio: InfoSorteio;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const HeaderForm = ({ open, salvando, infoSorteio, onClose, onSubmit }: HeaderFormProps) => (
  <Dialog
    open={open}
    onClose={salvando ? undefined : onClose}
    fullWidth
    maxWidth="sm"
    slotProps={{ paper: { sx: surfaces.dialog } }}
  >
    <DialogTitle sx={surfaces.dialogTitle}>
      Editar Evento Oficial
    </DialogTitle>
    <form onSubmit={onSubmit}>
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
      <DialogActions sx={surfaces.dialogActions}>
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
          sx={components.botaoNovoPremio}
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
);
