import { Box } from "@mui/material";

import {
  AcaoValidacaoPix,
  PixTransacoesFiltros as PixTransacoesFiltrosState,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { PixEmptyState } from "../shared/PixEmptyState";
import { PixStatusLegenda } from "../shared/PixStatusLegenda";
import { PixTransacoesFiltros } from "../shared/PixTransacoesFiltros";
import { PixTransacoesTable } from "./PixTransacoesTable";

interface PixTransacoesDesktopViewProps {
  filtros: PixTransacoesFiltrosState;
  transacoes: PixTransacao[];
  onChangeFiltros: (filtros: PixTransacoesFiltrosState) => void;
  validandoPixPorId?: Record<string, AcaoValidacaoPix | undefined>;
  onAceitarTransacao?: (transacaoId: string) => void | Promise<unknown>;
  onNegarTransacao?: (transacaoId: string) => void | Promise<unknown>;
}

export function PixTransacoesDesktopView({
  filtros,
  transacoes,
  onChangeFiltros,
  validandoPixPorId,
  onAceitarTransacao,
  onNegarTransacao,
}: PixTransacoesDesktopViewProps) {
  return (
    <Box>
      <PixTransacoesFiltros filtros={filtros} onChangeFiltros={onChangeFiltros} />
      <PixStatusLegenda />

      {transacoes.length === 0 ? (
        <PixEmptyState />
      ) : (
        <PixTransacoesTable
          transacoes={transacoes}
          validandoPixPorId={validandoPixPorId}
          onAceitarTransacao={onAceitarTransacao}
          onNegarTransacao={onNegarTransacao}
        />
      )}
    </Box>
  );
}
