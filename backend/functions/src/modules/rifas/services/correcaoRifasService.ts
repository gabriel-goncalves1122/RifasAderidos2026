// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/correcaoRifasService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Bilhete } from "../../types/models";
import { DadosCorrecaoRifas } from "../types/rifasTypes";
import { obterContextoAderidoPorEmail } from "../helpers/usuarioRifasHelper";

export class CorrecaoRifasService {
  static async corrigirRifasRecusadas(
    emailLogado: string,
    numerosRifas: string[],
    dadosAtualizados: DadosCorrecaoRifas,
  ): Promise<boolean> {
    const db = admin.firestore();

    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);
    const batch = db.batch();

    try {
      for (const numero of numerosRifas) {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        const bilheteSnap = await bilheteRef.get();

        if (!bilheteSnap.exists) continue;

        const dadosBilhete = bilheteSnap.data() as Bilhete;

        const podeCorrigir =
          dadosBilhete?.vendedor_id === contextoAderido.idAderido &&
          dadosBilhete?.status === "recusado";

        if (!podeCorrigir) continue;

        const updateBilhete: Partial<Bilhete> & Record<string, any> = {
          status: "pendente",
          comprador_nome: dadosAtualizados.nome,
          comprador_email: dadosAtualizados.email || null,
          comprador_telefone: dadosAtualizados.telefone || null,
          comprovante_url: dadosAtualizados.comprovanteUrl,
          motivo_recusa: null,
          log_automacao: null,
          data_reserva: new Date().toISOString(),
        };

        batch.update(bilheteRef, updateBilhete);
      }

      await batch.commit();

      return true;
    } catch (error) {
      console.error("[CorrecaoRifasService] Erro ao corrigir rifas:", error);

      throw new Error("Falha ao salvar a correção no banco de dados.");
    }
  }
}
