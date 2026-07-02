// ============================================================================
// ARQUIVO: backend/functions/src/shared/middlewares/authMiddleware.ts
// ============================================================================
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken & {
    role?: string;
    cargo?: string;
  };
}

function obterSuperAdmins(): string[] {
  const envValue = process.env.SUPER_ADMIN_EMAILS || "";

  return envValue
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

const CARGOS_TESOURARIA_OU_ADMIN = [
  "admin",
  "presidencia",
  "diretor_tesouraria",
  "membro_tesouraria",
  "tesouraria",
  "secretaria",
];

const CARGOS_SECRETARIA_OU_ADMIN = [
  "admin",
  "presidencia",
  "secretaria",
  "diretor_secretaria",
  "vice_secretaria",
  "membro_secretaria",
];

export const validateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Mantém o contrato com o frontend: Authorization: Bearer <token>.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Faltando token de autenticação.",
    });
    return;
  }

  const idToken = authHeader.replace("Bearer ", "").trim();

  if (!idToken) {
    res.status(401).json({
      error: "Faltando token de autenticação.",
    });
    return;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Garante o contrato mínimo usado pelos controllers e pelos testes.
    // A busca no Firestore abaixo apenas enriquece permissões, mas não deve bloquear req.user.
    req.user = decodedToken;

    try {
      const db = admin.firestore();

      // Primeiro tenta o vínculo moderno pelo UID do Firebase Auth.
      let userDoc = await db.collection("usuarios").doc(decodedToken.uid).get();
      let userData = userDoc.exists ? userDoc.data() : null;

      // Fallback para bases antigas onde o usuário era localizado por e-mail.
      if (!userData && decodedToken.email) {
        const emailSnap = await db
          .collection("usuarios")
          .where("email", "==", decodedToken.email)
          .limit(1)
          .get();

        if (!emailSnap.empty) {
          userDoc = emailSnap.docs[0];
          userData = userDoc.data();
        }
      }

      // Só adiciona cargo quando existe documento no Firestore.
      // Isso evita quebrar testes unitários que validam apenas o payload do Firebase.
      if (userData) {
        const cargoEfetivo = userData.role || userData.cargo || "aderido";

        req.user = {
          ...decodedToken,
          role: cargoEfetivo,
          cargo: cargoEfetivo,
        };
      }
    } catch (firestoreError) {
      // Em testes unitários o Firestore pode estar mockado parcialmente.
      // A autenticação continua válida porque o token já foi aprovado pelo Firebase.
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          "Aviso: não foi possível carregar cargo do usuário:",
          firestoreError,
        );
      }
    }

    next();
  } catch (error) {
    console.error("Erro na validação do token:", error);

    res.status(403).json({
      error: "Token inválido, expirado ou revogado.",
    });
  }
};

export const requireTesourariaOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      error: "Usuário não autenticado.",
    });
    return;
  }

  // Libera acesso para super-admins configurados via env var SUPERVISOR_ADMIN_EMAILS
  if (user.email) {
    const superAdmins = obterSuperAdmins();

    if (superAdmins.includes(user.email.toLowerCase())) {
      next();
      return;
    }
  }

  const cargoEfetivo = user.role || user.cargo || "aderido";

  if (!CARGOS_TESOURARIA_OU_ADMIN.includes(cargoEfetivo)) {
    res.status(403).json({
      error: `Acesso negado. Seu cargo atual é: ${cargoEfetivo}`,
    });
    return;
  }

  next();
};

export const requireSecretariaOrAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({
      error: "Usuário não autenticado.",
    });
    return;
  }

  if (user.email) {
    const superAdmins = obterSuperAdmins();

    if (superAdmins.includes(user.email.toLowerCase())) {
      next();
      return;
    }
  }

  const cargoEfetivo = user.role || user.cargo || "aderido";

  if (!CARGOS_SECRETARIA_OU_ADMIN.includes(cargoEfetivo)) {
    res.status(403).json({
      error: `Acesso negado. Seu cargo atual é: ${cargoEfetivo}`,
    });
    return;
  }

  next();
};
