import { Box, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

import { surfaces } from "../../styles/surfaces";
import { SecretariaDesktopFilterBar } from "./SecretariaDesktopFilterBar";
import { SecretariaDesktopBatchBar } from "./SecretariaDesktopBatchBar";
import { SecretariaDesktopDetailPane } from "./SecretariaDesktopDetailPane";
import { SecretariaTable } from "../shared/SecretariaTable";
import { SkeletonSecretariaList } from "../shared/SkeletonSecretariaList";
import { EmptyState } from "../../../../shared/components/EmptyState";
import type {
  AderidoSecretaria,
  FormEditarAderido,
} from "@/shared/types/secretaria";
import type { SortDir } from "../../types/secretariaLocalTypes";

interface SecretariaDesktopViewProps {
  aderidosFiltrados: AderidoSecretaria[];
  loading: boolean;
  busca: string;
  sortBy: string | null;
  sortDir: SortDir;
  aderidoSelecionado: AderidoSecretaria | null;
  selectedIds: Set<string>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  onBuscaChange: (val: string) => void;
  onToggleSort: (coluna: string) => void;
  onSelecionarAderido: (aderido: AderidoSecretaria) => void;
  onCloseDetail: () => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onSalvarAderido: (id: string, dados: FormEditarAderido) => Promise<void>;
}

export function SecretariaDesktopView({
  loading,
  aderidosFiltrados,
  busca,
  sortBy,
  sortDir,
  aderidoSelecionado,
  selectedIds,
  searchInputRef,
  onBuscaChange,
  onToggleSort,
  onSelecionarAderido,
  onCloseDetail,
  onToggleSelect,
  onSelectAll,
  onClearSelection,
  onSalvarAderido,
}: SecretariaDesktopViewProps) {
  if (loading) {
    return (
      <Box sx={surfaces.paper}>
        <SecretariaDesktopFilterBar
          busca={busca}
          searchInputRef={searchInputRef}
          onBuscaChange={onBuscaChange}
        />
        <SkeletonSecretariaList isMobile={false} />
      </Box>
    );
  }

  const selectAll = () => onSelectAll();

  return (
    <Box sx={{ display: "flex", gap: 0, alignItems: "stretch", minHeight: "calc(100vh - 200px)" }}>
      <Box sx={{ flex: 1, minWidth: 0, ...surfaces.paper, display: "flex", flexDirection: "column" }}>
        <SecretariaDesktopFilterBar
          busca={busca}
          searchInputRef={searchInputRef}
          onBuscaChange={onBuscaChange}
        />

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2, mb: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <GroupIcon color="action" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
              Resultados ({aderidosFiltrados.length})
            </Typography>
          </Box>
        </Box>

        {aderidosFiltrados.length === 0 ? (
          <EmptyState
            icon={<GroupIcon sx={{ fontSize: 48 }} />}
            title="Nenhum resultado encontrado."
            description="Tente alterar os termos da pesquisa."
          />
        ) : (
          <>
            <SecretariaTable
              aderidos={aderidosFiltrados}
              sortBy={sortBy}
              sortDir={sortDir}
              selectable
              selectedIds={selectedIds}
              onToggleSort={onToggleSort}
              onSelecionar={onSelecionarAderido}
              onToggleSelect={onToggleSelect}
              onSelectAll={selectAll}
            />
            <SecretariaDesktopBatchBar
              selectedCount={selectedIds.size}
              onClearSelection={onClearSelection}
            />
          </>
        )}
      </Box>

      <SecretariaDesktopDetailPane
        aderido={aderidoSelecionado}
        onClose={onCloseDetail}
        onSalvar={onSalvarAderido}
      />
    </Box>
  );
}
