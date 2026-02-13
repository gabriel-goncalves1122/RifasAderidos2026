// src/routes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";

// Note os "../" aqui:
import { auth } from "../config/firebase";
import { LoginPage } from "../views/pages/LoginPage";
import { DashboardPage } from "../views/pages/DashboardPage";

// ... (O resto do código de PrivateRoute e AppRoutes continua exatamente igual) ...
// Middleware para proteger rotas privadas
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta o estado de autenticação do Firebase em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se tem usuário, renderiza a página. Se não, joga pro Login.
  return user ? <>{children}</> : <Navigate to="/" />;
}

// Definição das Rotas da Aplicação
export function AppRoutes() {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/" element={<LoginPage />} />

      {/* Rota Privada */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />

      {/* Fallback: Qualquer rota não mapeada cai no Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
