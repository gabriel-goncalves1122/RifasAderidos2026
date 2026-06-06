import { Box, Stack, Typography } from "@mui/material";

import {
  PixTransacoesFiltros as PixTransacoesFiltrosState,
  PixTransacao,
} from "../../../../types/pixTransacoes";
import { PixEmptyState } from "../shared/PixEmptyState";
import { PixTransacoesFiltros } from "../shared/PixTransacoesFiltros";
import { PixTransacaoCard } from "./PixTransacaoCard";

interface PixTransacoesMobileViewProps {
  filtros: PixTransacoesFiltrosState;
  transacoes: PixTransacao[];
  onChangeFiltros: (filtros: PixTransacoesFiltrosState) => void;
}

export function PixTransacoesMobileView({
  filtros,
  transacoes,
  onChangeFiltros,
}: PixTransacoesMobileViewProps) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          py: 0.75,
          bgcolor: "background.default",
        }}
      >
        <PixTransacoesFiltros filtros={filtros} onChangeFiltros={onChangeFiltros} />
      </Box>

      <Box>
        <Typography
          sx={{
            color: "#021B16",
            fontWeight: 900,
            fontSize: "1rem",
            mb: 0.25,
          }}
        >
          Últimas transações Pix
        </Typography>

        <Typography sx={{ color: "#526760", fontSize: "0.84rem" }}>
          {transacoes.length} transação(ões) encontradas
        </Typography>
      </Box>

      {transacoes.length === 0 ? (
        <PixEmptyState />
      ) : (
        <Stack spacing={1.5} sx={{ pl: 1, pr: 0.25 }}>
          {transacoes.map((transacao) => (
            <PixTransacaoCard key={transacao.id} transacao={transacao} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
