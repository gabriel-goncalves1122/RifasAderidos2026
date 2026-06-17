import { useEffect, useState } from "react";
import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { secretariaComponents } from "../../styles/components";

interface SecretariaDesktopFilterBarProps {
  busca: string;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  onBuscaChange: (val: string) => void;
}

export function SecretariaDesktopFilterBar({
  busca,
  searchInputRef,
  onBuscaChange,
}: SecretariaDesktopFilterBarProps) {
  const [inputValue, setInputValue] = useState(busca);
  const valorDebounced = useDebounce(inputValue, 250);

  useEffect(() => {
    if (valorDebounced !== busca) {
      onBuscaChange(valorDebounced);
    }
  }, [valorDebounced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        size="small"
        fullWidth
        placeholder="Pesquisar por nome ou e-mail..."
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        inputRef={searchInputRef}
        sx={secretariaComponents.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
