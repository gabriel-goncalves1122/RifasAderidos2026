import { Box, Stack, Typography } from "@mui/material";

import {
  AcaoValidacaoPix,
  PixTransacoesFiltros as PixTransacoesFiltrosState,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { PixEmptyState } from "../shared/PixEmptyState";
import { PixStatusLegenda } from "../shared/PixStatusLegenda";
import { PixTransacoesFiltros } from "../shared/PixTransacoesFiltros";
import { PixTransacaoCard } from "./PixTransacaoCard";

interface PixTransacoesMobileViewProps {
  filtros: PixTransacoesFiltrosState;
  transacoes: PixTransacao[];
  onChangeFiltros: (filtros: PixTransacoesFiltrosState) => void;
  validandoPixPorId?: Record<string, AcaoValidacaoPix | undefined>;
  onAceitarTransacao?: (transacaoId: string) => void | Promise<unknown>;
  onNegarTransacao?: (transacaoId: string) => void | Promise<unknown>;
}

export function PixTransacoesMobileView({
  filtros,
  transacoes,
  onChangeFiltros,
  validandoPixPorId = {},
  onAceitarTransacao,
  onNegarTransacao,
}: PixTransacoesMobileViewProps) {
  return (
    <Stack spacing={2}>
      <PixTransacoesFiltros filtros={filtros} onChangeFiltros={onChangeFiltros} />

      <Box>
        <Typography
          sx={{
            color: "#021B16",
            fontWeight: 900,
            fontSize: "1rem",
            mb: 0.25,
          }}
        >
          Validar transações
        </Typography>

        <Typography sx={{ color: "#526760", fontSize: "0.84rem" }}>
          {transacoes.length} transação(ões) encontradas
        </Typography>
      </Box>

      <PixStatusLegenda colapsavel />

      {transacoes.length === 0 ? (
        <PixEmptyState />
      ) : (
        <Stack spacing={1.5} sx={{ pl: 1, pr: 0.25 }}>
          {transacoes.map((transacao) => (
            <PixTransacaoCard
              key={transacao.id}
              transacao={transacao}
              acaoEmAndamento={validandoPixPorId[transacao.id]}
              onAceitarTransacao={onAceitarTransacao}
              onNegarTransacao={onNegarTransacao}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
