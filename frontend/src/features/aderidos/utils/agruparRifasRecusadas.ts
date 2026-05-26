// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/utils/agruparRifasRecusadas.ts
// ============================================================================
import { GrupoRifasRecusadas, RifaAderido } from "../types/painelAderido";

export function agruparRifasRecusadas(
  rifas: RifaAderido[],
): GrupoRifasRecusadas[] {
  const rifasRecusadas = rifas.filter((rifa) => rifa.status === "recusado");

  const grupos = rifasRecusadas.reduce<Record<string, GrupoRifasRecusadas>>(
    (acc, rifa) => {
      const dataBase = rifa.data_reserva
        ? rifa.data_reserva.split("T")[0]
        : "sem-data";

      // A chave preserva agrupamentos de uma mesma tentativa de pagamento.
      const chaveGrupo = `${rifa.comprador_nome}-${dataBase}-${rifa.motivo_recusa}`;

      if (!acc[chaveGrupo]) {
        acc[chaveGrupo] = {
          comprador: rifa.comprador_nome || "Desconhecido",
          email: rifa.comprador_email || "",
          telefone: rifa.comprador_telefone || "",
          data: rifa.data_reserva || null,
          motivo: rifa.motivo_recusa || "Sem motivo informado",
          bilhetes: [],
        };
      }

      acc[chaveGrupo].bilhetes.push(rifa.numero);

      return acc;
    },
    {},
  );

  return Object.values(grupos);
}
