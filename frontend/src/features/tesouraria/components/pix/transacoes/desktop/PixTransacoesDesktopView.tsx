import { Box } from "@mui/material";

import {
  PixTransacoesFiltros as PixTransacoesFiltrosState,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { PixEmptyState } from "../shared/PixEmptyState";
import { PixTransacoesFiltros } from "../shared/PixTransacoesFiltros";
import { PixTransacoesTable } from "./PixTransacoesTable";

interface PixTransacoesDesktopViewProps {
  filtros: PixTransacoesFiltrosState;
  transacoes: PixTransacao[];
  onChangeFiltros: (filtros: PixTransacoesFiltrosState) => void;
  onAceitar: (id: string) => Promise<void>;
  onNegar: (id: string, motivo: string) => Promise<void>;
}

export function PixTransacoesDesktopView({
  filtros,
  transacoes,
  onChangeFiltros,
  onAceitar,
  onNegar,
}: PixTransacoesDesktopViewProps) {
  return (
    <Box>
      <PixTransacoesFiltros filtros={filtros} onChangeFiltros={onChangeFiltros} />

      {transacoes.length === 0 ? (
        <PixEmptyState />
      ) : (
        <PixTransacoesTable
          transacoes={transacoes}
          onAceitar={onAceitar}
          onNegar={onNegar}
        />
      )}
    </Box>
  );
}
