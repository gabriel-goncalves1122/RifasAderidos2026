// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/aderidoRifasService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Bilhete } from "../../types/models";
import { ordenarRifasPorNumero } from "../helpers/ordenarRifasHelper";
import { buscarUsuarioPorEmail } from "../helpers/usuarioRifasHelper";

export class AderidoRifasService {
  static async buscarPorAderido(emailLogado: string): Promise<Bilhete[]> {
    const db = admin.firestore();

    const usuario = await buscarUsuarioPorEmail(emailLogado);
    const idAderido = usuario.data.id_aderido || usuario.id;

    const bilhetesSnapshot = await db
      .collection("bilhetes")
      .where("vendedor_id", "==", idAderido)
      .get();

    const bilhetes = bilhetesSnapshot.docs.map((doc) => doc.data() as Bilhete);

    return ordenarRifasPorNumero(bilhetes);
  }
}
