import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";

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
            <SearchIcon sx={{ color: "#526760" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2.5,
          bgcolor: "#F6F8F7",
        },
      }}
    />
  );
}
