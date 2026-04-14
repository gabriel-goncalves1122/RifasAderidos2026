import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

// Estendemos a interface Request do Express para incluir os dados do usuário
export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

// Adicione esta função abaixo do validateToken
export const requireTesourariaOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Já temos o UID do utilizador que fez o pedido (graças ao validateToken que rodou antes)
    const uid = req.user?.uid;
    if (!uid) {
      res.status(401).json({ error: "Usuário não identificado." });
      return;
    }

    // 2. Vamos ao Firestore ver qual é o cargo dele
    const db = admin.firestore();
    const userSnap = await db
      .collection("usuarios")
      .where("uid", "==", uid)
      .get();

    if (userSnap.empty) {
      res
        .status(403)
        .json({ error: "Usuário não encontrado na base de dados." });
      return;
    }

    const cargoDoUsuario = userSnap.docs[0].data().cargo || "";

    // 3. Verificamos se ele tem o cargo necessário (Pode ajustar os nomes aos seus constants.ts)
    const cargosPermitidos = [
      "admin",
      "presidencia",
      "diretor_tesouraria",
      "vice_tesouraria",
      "membro_tesouraria",
      "diretor_secretaria", // Se a secretaria também puder mexer
    ];

    if (!cargosPermitidos.includes(cargoDoUsuario)) {
      res
        .status(403)
        .json({
          error:
            "Acesso Negado: Esta ação requer privilégios de Tesouraria/Admin.",
        });
      return;
    }

    // Se passar, segue para a rota
    next();
  } catch (error) {
    console.error("Erro ao validar cargo:", error);
    res.status(500).json({ error: "Erro interno ao validar permissões." });
  }
};

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // 1. Verifica se o header de Autorização foi enviado
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Não autorizado. Faltando token de autenticação (Bearer Token).",
    });
    return;
  }

  // 2. Extrai o token (Remove a palavra "Bearer ")
  const idToken = authHeader.split("Bearer ")[1];

  try {
    // 3. Valida o token com os servidores do Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // 4. Injeta os dados do usuário (UID, email) na requisição para as próximas funções usarem
    req.user = decodedToken;

    // 5. Permite que a requisição siga para a rota final
    next();
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    res.status(403).json({
      error: "Não autorizado. Token inválido, expirado ou revogado.",
    });
    return;
  }
};
