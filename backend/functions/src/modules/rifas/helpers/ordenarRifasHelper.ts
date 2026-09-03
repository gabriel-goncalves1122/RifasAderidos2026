// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/helpers/ordenarRifasHelper.ts
// ============================================================================
import { Bilhete } from "../../types/models";

export function ordenarRifasPorNumero(bilhetes: Bilhete[]) {
  return [...bilhetes].sort((a, b) => {
    const numA = parseInt(a.numero || "0", 10) || 0;
    const numB = parseInt(b.numero || "0", 10) || 0;

    return numA - numB;
  });
}
