import { useEffect, useState } from "react";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

import { useDebounce } from "../../../../../shared/hooks/useDebounce";
import { components } from "@/shared/tokens/components";

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
        sx={components.searchField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setInputValue("")}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </Box>
  );
}
