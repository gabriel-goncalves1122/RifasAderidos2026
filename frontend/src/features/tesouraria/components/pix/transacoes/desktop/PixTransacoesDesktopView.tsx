import { Box } from "@mui/material";

import {
  AcaoValidacaoPix,
  PixTransacoesFiltros as PixTransacoesFiltrosState,
  PixTransacoesResumo,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { PixEmptyState } from "../shared/PixEmptyState";
import { PixTransacoesFiltros } from "../shared/PixTransacoesFiltros";
import { PixTransacoesResumoCards } from "../shared/PixTransacoesResumoCards";
import { PixTransacoesTable } from "./PixTransacoesTable";

interface PixTransacoesDesktopViewProps {
  resumo: PixTransacoesResumo;
  filtros: PixTransacoesFiltrosState;
  transacoes: PixTransacao[];
  onChangeFiltros: (filtros: PixTransacoesFiltrosState) => void;
  validandoPixPorId?: Record<string, AcaoValidacaoPix | undefined>;
  onAceitarTransacao?: (transacaoId: string) => void | Promise<unknown>;
  onNegarTransacao?: (transacaoId: string) => void | Promise<unknown>;
}

export function PixTransacoesDesktopView({
  resumo,
  filtros,
  transacoes,
  onChangeFiltros,
  validandoPixPorId,
  onAceitarTransacao,
  onNegarTransacao,
}: PixTransacoesDesktopViewProps) {
  return (
    <Box>
      <PixTransacoesResumoCards resumo={resumo} />
      <PixTransacoesFiltros filtros={filtros} onChangeFiltros={onChangeFiltros} />

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
