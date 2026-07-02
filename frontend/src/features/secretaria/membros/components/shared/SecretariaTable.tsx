import {
  Avatar,
  Box,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import { CargoChip } from "./CargoChip";
import { StatusChip } from "./StatusChip";
import type { AderidoSecretaria } from "@/shared/types/secretaria";
import type { SortDir } from "../../types/secretariaLocalTypes";
import { surfaces } from "../../../styles/surfaces";

interface SecretariaTableProps {
  aderidos: AderidoSecretaria[];
  sortBy: string | null;
  sortDir: SortDir;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSort: (coluna: string) => void;
  onSelecionar: (aderido: AderidoSecretaria) => void;
  onToggleSelect?: (id: string) => void;
  onSelectAll?: () => void;
}

function SortIcon({ coluna, sortBy, sortDir }: { coluna: string; sortBy: string | null; sortDir: SortDir }) {
  if (sortBy !== coluna) return <UnfoldMoreIcon sx={{ fontSize: 14, ml: 0.5, opacity: 0.4 }} />;
  return sortDir === "asc"
    ? <ArrowUpwardIcon sx={{ fontSize: 14, ml: 0.5 }} />
    : <ArrowDownwardIcon sx={{ fontSize: 14, ml: 0.5 }} />;
}

export function SecretariaTable({
  aderidos,
  sortBy,
  sortDir,
  selectable,
  selectedIds,
  onToggleSort,
  onSelecionar,
  onToggleSelect,
  onSelectAll,
}: SecretariaTableProps) {
  if (aderidos.length === 0) return null;

  const allSelected = selectable && selectedIds && selectedIds.size === aderidos.length;

  return (
    <TableContainer sx={{ flex: 1, overflow: "auto", minHeight: 400 }}>
      <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead sx={surfaces.tableHead}>
          <TableRow>
            {selectable && (
              <TableCell sx={{ width: 48, px: 1 }}>
                <Checkbox
                  size="small"
                  checked={allSelected}
                  indeterminate={selectedIds && selectedIds.size > 0 && !allSelected}
                  onChange={onSelectAll}
                />
              </TableCell>
            )}
            <TableCell sx={{ cursor: "pointer" }} onClick={() => onToggleSort("nome")}>
              <strong>Usuário</strong>
              <SortIcon coluna="nome" sortBy={sortBy} sortDir={sortDir} />
            </TableCell>
            <TableCell sx={{ cursor: "pointer" }} onClick={() => onToggleSort("email")}>
              <strong>E-mail</strong>
              <SortIcon coluna="email" sortBy={sortBy} sortDir={sortDir} />
            </TableCell>
            <TableCell sx={{ cursor: "pointer" }} onClick={() => onToggleSort("cargo")}>
              <strong>Cargo</strong>
              <SortIcon coluna="cargo" sortBy={sortBy} sortDir={sortDir} />
            </TableCell>
            <TableCell align="center" sx={{ cursor: "pointer" }} onClick={() => onToggleSort("status")}>
              <strong>Status</strong>
              <SortIcon coluna="status" sortBy={sortBy} sortDir={sortDir} />
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {aderidos.map((aderido) => {
            const isSelected = selectedIds?.has(aderido.id);

            return (
              <TableRow
                key={aderido.id}
                hover
                selected={isSelected}
                sx={{
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  "&:hover": { bgcolor: "rgba(0, 0, 0, 0.02) !important" },
                  "&:hover .row-actions": { opacity: 1 }
                }}
              >
                {selectable && (
                  <TableCell sx={{ width: 48, px: 1 }}>
                    <Checkbox
                      size="small"
                      checked={!!isSelected}
                      onChange={() => onToggleSelect?.(aderido.id)}
                    />
                  </TableCell>
                )}
                <TableCell onClick={() => onSelecionar(aderido)}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: aderido.status_cadastro === "ativo" ? "primary.main" : "grey.400",
                      }}
                    >
                      {aderido.nome ? aderido.nome.charAt(0).toUpperCase() : "?"}
                    </Avatar>
                    <Typography
                      variant="body2"
                      fontWeight={aderido.status_cadastro === "ativo" ? "bold" : "normal"}
                      color={aderido.nome ? "text.primary" : "text.disabled"}
                    >
                      {aderido.nome || "Não definido"}
                    </Typography>
                  </Stack>
                </TableCell>

                <TableCell onClick={() => onSelecionar(aderido)}>
                  <Typography variant="body2">{aderido.email}</Typography>
                </TableCell>

                <TableCell onClick={() => onSelecionar(aderido)}>
                  <CargoChip cargo={aderido.cargo} />
                </TableCell>

                <TableCell align="center" onClick={() => onSelecionar(aderido)}>
                  <StatusChip status={aderido.status_cadastro} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
