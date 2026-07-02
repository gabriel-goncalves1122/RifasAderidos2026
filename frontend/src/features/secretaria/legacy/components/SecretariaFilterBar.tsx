import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { secretariaComponents } from "../../styles/components";

interface SecretariaFilterBarProps {
  busca: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onBuscaChange: (val: string) => void;
}

export function SecretariaFilterBar({
  busca,
  searchInputRef,
  onBuscaChange,
}: SecretariaFilterBarProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Pesquisar por nome ou e-mail..."
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        inputRef={searchInputRef}
        sx={secretariaComponents.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
