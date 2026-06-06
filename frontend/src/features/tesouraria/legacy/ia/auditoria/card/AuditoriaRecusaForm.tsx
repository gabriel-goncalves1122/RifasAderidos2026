import { Box, Button, Collapse, TextField } from "@mui/material";

import { auditoriaCardStyles } from "../../auditoriaCardStyles";

interface AuditoriaRecusaFormProps {
  aberto: boolean;
  motivo: string;
  onChangeMotivo: (motivo: string) => void;
  onCancelar: () => void;
}

export function AuditoriaRecusaForm({
  aberto,
  motivo,
  onChangeMotivo,
  onCancelar,
}: AuditoriaRecusaFormProps) {
  return (
    <Collapse in={aberto} sx={{ width: "100%" }}>
      <Box sx={auditoriaCardStyles.recusaContainer}>
        <Box sx={auditoriaCardStyles.recusaBox}>
          <TextField
            fullWidth
            size="small"
            label="Motivo da recusa"
            variant="outlined"
            color="error"
            value={motivo}
            onChange={(event) => onChangeMotivo(event.target.value)}
            placeholder="Ex: valor divergente, comprovante ilegível, titular diferente..."
            helperText="Esse motivo será enviado ao aderido para correção."
          />

          <Button size="small" color="inherit" sx={{ mt: 1 }} onClick={onCancelar}>
            Cancelar recusa
          </Button>
        </Box>
      </Box>
    </Collapse>
  );
}
