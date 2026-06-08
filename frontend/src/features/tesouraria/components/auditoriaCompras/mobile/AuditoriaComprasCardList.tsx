import { Stack } from "@mui/material";

import { CompraAuditavel } from "../../../types/auditoriaCompras";
import { AuditoriaCompraCard } from "./AuditoriaCompraCard";

interface AuditoriaComprasCardListProps {
  compras: CompraAuditavel[];
  onVerComprovante: (compra: CompraAuditavel) => void;
  onEditar: (compra: CompraAuditavel) => void;
  onVerDetalhes: (compra: CompraAuditavel) => void;
  onReenviarEmailComprovante: (compra: CompraAuditavel) => void;
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
            Boolean(compra.comprador_id) &&
            compra.comprador_id === reenviandoEmailComprovanteId
          }
        />
      ))}
    </Stack>
  );
}
