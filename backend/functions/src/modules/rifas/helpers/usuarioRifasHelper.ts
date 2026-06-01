// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/helpers/usuarioRifasHelper.ts
// ============================================================================
import * as admin from "firebase-admin";

import { Usuario } from "../../types/models";
import { AderidoRifasContexto } from "../types/rifasTypes";

export async function buscarUsuarioPorEmail(emailLogado: string) {
  const db = admin.firestore();

  const userDocs = await db
    .collection("usuarios")
    .where("email", "==", emailLogado)
    .limit(1)
    .get();

  if (userDocs.empty) {
    throw new Error("USER_NOT_FOUND");
  }

  const userDoc = userDocs.docs[0];
  const userData = userDoc.data() as Usuario;

  return {
    id: userDoc.id,
    data: userData,
  };
}

export async function obterContextoAderidoPorEmail(
  emailLogado: string,
): Promise<AderidoRifasContexto> {
  const usuario = await buscarUsuarioPorEmail(emailLogado);

  return {
    idAderido: usuario.data.id_aderido || usuario.id,
    vendedorNome: usuario.data.nome || "Nome não registado",
    vendedorCpf: usuario.data.cpf || "CPF não registado",
  };
}
