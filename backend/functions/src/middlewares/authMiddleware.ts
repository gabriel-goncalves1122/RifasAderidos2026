import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

// Estendemos a interface Request do Express para incluir os dados do usuário
export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

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
