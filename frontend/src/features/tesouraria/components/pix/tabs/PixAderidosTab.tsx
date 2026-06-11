import { useMemo, useState } from "react";
import { Box } from "@mui/material";

import { PixTransacao } from "../../../types/pixTransacoes";
import {
  agruparPixAderidos,
  PixAderidoResumo,
} from "../../../utils/pixAderidosUtils";
import { PixAderidoDetalhesDrawer } from "./aderidos/PixAderidoDetalhesDrawer";
import { PixAderidoResumoCard } from "./aderidos/PixAderidoResumoCard";
import { layout } from "../../../styles/layout";

interface PixAderidosTabProps {
  transacoes: PixTransacao[];
}

export function PixAderidosTab({
  transacoes,
}: PixAderidosTabProps) {
  const [aderidoSelecionado, setAderidoSelecionado] =
    useState<PixAderidoResumo | null>(null);

  const resumoPorAderido = useMemo(
    () => agruparPixAderidos(transacoes),
    [transacoes],
  );

  const fecharDetalhes = () => setAderidoSelecionado(null);

  return (
    <>
      <Box sx={layout.cardsGrid}>
        {resumoPorAderido.map((aderido) => (
          <PixAderidoResumoCard
            key={aderido.chave}
            aderido={aderido}
            onSelecionar={setAderidoSelecionado}
          />
        ))}
      </Box>

      <PixAderidoDetalhesDrawer
        aderido={aderidoSelecionado}
        onClose={fecharDetalhes}
      />
    </>
  );
}
