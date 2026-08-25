import { Stack } from "@mui/material";

import { TransacaoTesouraria } from "../../../types/auditoriaCompras";
import { AuditoriaCompraCard } from "./AuditoriaCompraCard";

interface AuditoriaComprasCardListProps {
  compras: TransacaoTesouraria[];
  onVerComprovante: (compra: TransacaoTesouraria) => void;
  onEditar: (compra: TransacaoTesouraria) => void;
  onVerDetalhes: (compra: TransacaoTesouraria) => void;
  onReenviarEmailComprovante: (compra: TransacaoTesouraria) => void;
  reenviandoEmailComprovanteId?: string | null;
}

export function AuditoriaComprasCardList({
  compras,
  onVerComprovante,
  onEditar,
  onVerDetalhes,
  onReenviarEmailComprovante,
  reenviandoEmailComprovanteId,
}: AuditoriaComprasCardListProps) {
  return (
    <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
      {compras.map((compra) => (
        <AuditoriaCompraCard
          key={compra.id}
          compra={compra}
          onVerComprovante={onVerComprovante}
          onEditar={onEditar}
          onVerDetalhes={onVerDetalhes}
          onReenviarEmailComprovante={onReenviarEmailComprovante}
          reenviandoEmailComprovante={
            Boolean(compra.compradorId) &&
            compra.compradorId === reenviandoEmailComprovanteId
          }
        />
      ))}
    </Stack>
  );
}
