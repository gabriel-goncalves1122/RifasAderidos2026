import { useEffect, useState } from "react";
import {
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GroupIcon from "@mui/icons-material/Group";

import { useDebounce } from "../../../../../shared/hooks/useDebounce";
import { SecretariaMobileFAB } from "./SecretariaMobileFAB";
import { SecretariaMobileSwipeableCard } from "./SecretariaMobileSwipeableCard";
import { SkeletonSecretariaList } from "../shared/SkeletonSecretariaList";
import { EmptyState } from "../../../../../shared/components/EmptyState";
import type { AderidoSecretaria } from "@/shared/types/secretaria";
import { safeAreaStickyTop } from "@/shared/tokens/safeArea";
import { secretariaComponents } from "../../../styles/components";

interface SecretariaMobileViewProps {
  aderidosFiltrados: AderidoSecretaria[];
  loading: boolean;
  busca: string;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onBuscaChange: (val: string) => void;
  onSelecionarAderido: (aderido: AderidoSecretaria) => void;
  onNovaAdesao: () => void;
}

export function SecretariaMobileView({
  aderidosFiltrados,
  loading,
  busca,
  searchInputRef,
  onBuscaChange,
  onSelecionarAderido,
  onNovaAdesao,
}: SecretariaMobileViewProps) {
  const [inputValue, setInputValue] = useState(busca);
  const valorDebounced = useDebounce(inputValue, 250);

  useEffect(() => {
    if (valorDebounced !== busca) {
      onBuscaChange(valorDebounced);
    }
  }, [valorDebounced]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          ...safeAreaStickyTop,
          zIndex: 10,
          bgcolor: "#fafafa",
          pt: 1,
          pb: 1,
          mx: -2,
          px: 2,
          mb: 0.5,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pesquisar..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          inputRef={searchInputRef}
          size="small"
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

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1.5 }}>
        <GroupIcon color="action" fontSize="small" />
        <Typography variant="body2" fontWeight="bold" color="text.primary">
          Resultados ({aderidosFiltrados.length})
        </Typography>
      </Box>

      {loading ? (
        <SkeletonSecretariaList isMobile />
      ) : aderidosFiltrados.length === 0 ? (
        <EmptyState
          icon={<GroupIcon sx={{ fontSize: 48 }} />}
          title="Nenhum resultado encontrado."
          description="Tente alterar os termos da pesquisa."
        />
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pb: 12 }}>
          {aderidosFiltrados.map((aderido) => (
            <SecretariaMobileSwipeableCard
              key={aderido.id}
              aderido={aderido}
              onSelecionar={onSelecionarAderido}
            />
          ))}
        </Box>
      )}

      <SecretariaMobileFAB onClick={onNovaAdesao} />
    </>
  );
}
