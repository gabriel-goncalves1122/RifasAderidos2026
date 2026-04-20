import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken & { role?: string };
}

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const db = admin.firestore();

    // --- ESTRATÉGIA DE RECUPERAÇÃO DE USUÁRIO LEGADO ---

    // 1. Tenta buscar pelo ID do documento (UID)
    let userDoc = await db.collection("usuarios").doc(decodedToken.uid).get();
    let userData = userDoc.exists ? userDoc.data() : null;

    // 2. Fallback: Se não achou, busca pelo campo email (comum em bancos antigos)
    if (!userData && decodedToken.email) {
      const emailSnap = await db
        .collection("usuarios")
        .where("email", "==", decodedToken.email)
        .limit(1)
        .get();

      if (!emailSnap.empty) {
        userData = emailSnap.docs[0].data();
      }
    }

    // 3. Normalização do Cargo: Aceita 'role' ou 'cargo'
    const cargoEfetivo = userData?.role || userData?.cargo || "aderido";

    // 4. Injeta no Request
    req.user = {
      ...decodedToken,
      role: cargoEfetivo,
    };

    next();
  } catch (error) {
    console.error("Erro na validação do token:", error);
    res.status(403).json({ error: "Token inválido ou expirado." });
  }
};

export const requireTesourariaOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Usuário não autenticado." });
    return;
  }

  // --- SUPER ADMIN FALLBACK ---
  // Se for o seu e-mail da comissão, ignora as travas do banco e libera
  const superAdmins = ["comissao0026@gmail.com"];
  if (user.email && superAdmins.includes(user.email)) {
    return next();
  }

  // Lista de cargos permitidos (mapeando todas as variações possíveis)
  const cargosPermitidos = [
    "admin",
    "presidencia",
    "diretor_tesouraria",
    "membro_tesouraria",
    "tesouraria", // Nome simplificado
    "secretaria", // Remova se quiser isolar tesouraria de secretaria
  ];

  if (!cargosPermitidos.includes(user.role || "")) {
    res.status(403).json({
      error: `Acesso negado. Seu cargo atual é: ${user.role || "aderido"}`,
    });
    return;
  }

  next();
};
