import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, InputAdornment, TextField } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { components } from "@/shared/tokens/components";

import { PixTransacoesFiltrosProps } from "./pixTransacoesFiltrosTypes";

export function PixTransacoesCampoBusca({ filtros, onChangeFiltros }: PixTransacoesFiltrosProps) {
  return (
    <TextField
      fullWidth
      size="small"
      placeholder="Buscar Pix"
      value={filtros.busca}
      onChange={(event) =>
        onChangeFiltros({ ...filtros, busca: event.target.value })
      }
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: colors.textoSuave }} />
          </InputAdornment>
        ),
        endAdornment: filtros.busca ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => onChangeFiltros({ ...filtros, busca: "" })}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          bgcolor: components.searchField.backgroundColor,
        },
      }}
    />
  );
}
