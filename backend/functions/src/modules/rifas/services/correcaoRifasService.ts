// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/correcaoRifasService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Bilhete } from "../../types/models";
import { DadosCorrecaoRifas } from "../types/rifasTypes";
import { obterContextoAderidoPorEmail } from "../helpers/usuarioRifasHelper";

function validarDadosCorrecao(numerosRifas: string[], dados: DadosCorrecaoRifas) {
  if (!Array.isArray(numerosRifas) || numerosRifas.length === 0) {
    throw new Error("INVALID_DATA");
  }

  if (!String(dados.nome || "").trim() || !String(dados.telefone || "").trim()) {
    throw new Error("INVALID_DATA");
  }

  if (!dados.comprovanteUrl) {
    throw new Error("INVALID_DATA");
  }
}

export class CorrecaoRifasService {
  static async corrigirRifasRecusadas(
    emailLogado: string,
    numerosRifas: string[],
    dadosAtualizados: DadosCorrecaoRifas,
  ): Promise<boolean> {
    validarDadosCorrecao(numerosRifas, dadosAtualizados);

    const db = admin.firestore();
    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);

    try {
      await db.runTransaction(async (transaction) => {
        for (const numero of numerosRifas) {
          const bilheteRef = db.collection("bilhetes").doc(numero);
          const bilheteSnap = await transaction.get(bilheteRef);

          if (!bilheteSnap.exists) continue;

          const dadosBilhete = bilheteSnap.data() as Bilhete;

          const podeCorrigir =
            dadosBilhete?.vendedor_id === contextoAderido.idAderido &&
            dadosBilhete?.status === "recusado";

          if (!podeCorrigir) continue;

          transaction.update(bilheteRef, {
            status: "pendente",
            comprador_nome: dadosAtualizados.nome,
            comprovante_url: dadosAtualizados.comprovanteUrl,
            motivo_recusa: null,
            log_automacao: null,
            data_reserva: new Date().toISOString(),
          });
        }
      });

      return true;
    } catch (error) {
      console.error("[CorrecaoRifasService] Erro ao corrigir rifas:", error);

      throw new Error("Falha ao salvar a correção no banco de dados.");
    }
  }
}
