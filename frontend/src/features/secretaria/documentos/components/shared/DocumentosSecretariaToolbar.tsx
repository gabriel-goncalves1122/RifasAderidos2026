import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { secretariaComponents } from "../../../styles/components";
import { documentosSecretariaStyles } from "../../styles/documentosSecretariaStyles";
import { AREAS_DOCUMENTOS_COMISSAO } from "../../constants/documentosAreas";
import type { AreaDocumentoComissao } from "../../types/documentosSecretariaTypes";

interface DocumentosSecretariaToolbarProps {
  busca: string;
  area: AreaDocumentoComissao | "todas";
  onBuscaChange: (value: string) => void;
  onAreaChange: (value: AreaDocumentoComissao | "todas") => void;
}

export function DocumentosSecretariaToolbar({
  busca,
  area,
  onBuscaChange,
  onAreaChange,
}: DocumentosSecretariaToolbarProps) {
  return (
    <Box sx={documentosSecretariaStyles.toolbar}>
      <TextField
        fullWidth
        value={busca}
        placeholder="Pesquisar por título, arquivo ou responsável..."
        onChange={(event) => onBuscaChange(event.target.value)}
        sx={secretariaComponents.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <FormControl fullWidth sx={documentosSecretariaStyles.areaSelect}>
        <InputLabel id="documentos-area-label">Área</InputLabel>
        <Select
          labelId="documentos-area-label"
          label="Área"
          value={area}
          onChange={(event) =>
            onAreaChange(event.target.value as AreaDocumentoComissao | "todas")
          }
        >
          <MenuItem value="todas">Todas as áreas</MenuItem>
          {AREAS_DOCUMENTOS_COMISSAO.map((areaComissao) => (
            <MenuItem key={areaComissao} value={areaComissao}>
              {areaComissao}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
