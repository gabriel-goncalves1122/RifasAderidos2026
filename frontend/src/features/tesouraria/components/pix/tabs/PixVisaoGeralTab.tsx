import { useMemo } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { PixTransacoesResumoCards } from "../transacoes/shared/PixTransacoesResumoCards";
import {
  PixTransacoesResumo,
  PixTransacao,
} from "../../../types/pixTransacoes";
import { montarDadosTemporaisPix } from "../../../utils/pixVisaoGeralUtils";
import { PixRecebimentosTemporalChart } from "./visaoGeral/PixRecebimentosTemporalChart";
import { PixVisaoGeralKpisMobile } from "./visaoGeral/PixVisaoGeralKpisMobile";

interface PixVisaoGeralTabProps {
  resumo: PixTransacoesResumo;
  transacoes: PixTransacao[];
}

export function PixVisaoGeralTab({
  resumo,
  transacoes,
}: PixVisaoGeralTabProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dadosTemporais = useMemo(
    () => montarDadosTemporaisPix(transacoes),
    [transacoes],
  );

  return (
    <Box sx={{ pb: { xs: 2, sm: 0 } }}>
      {isMobile ? (
        <PixVisaoGeralKpisMobile resumo={resumo} />
      ) : (
        <PixTransacoesResumoCards resumo={resumo} />
      )}

      <PixRecebimentosTemporalChart
        dadosTemporais={dadosTemporais}
        isMobile={isMobile}
        resumo={resumo}
      />
    </Box>
  );
}
