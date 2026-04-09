import * as admin from "firebase-admin";

// Inicializa a aplicação Admin apenas se ainda não tiver sido inicializada
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();
