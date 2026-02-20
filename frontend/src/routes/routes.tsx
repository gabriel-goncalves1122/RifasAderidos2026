// ============================================================================
// ARQUIVO: routes.tsx (Orquestrador de Navegação e Segurança)
// ============================================================================
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";

import { auth } from "../config/firebase";
import { LoginPage } from "../views/pages/LoginPage";
import { DashboardPage } from "../views/pages/DashboardPage";
import { RegisterPage } from "../views/pages/RegisterPage"; // <-- NOVO IMPORT ADICIONADO!

// ----------------------------------------------------------------------------
// MIDDLEWARE DE ROTA PRIVADA (O "Leão de Chácara" do Frontend)
// ----------------------------------------------------------------------------
// Este componente envolve as telas sensíveis (como o Dashboard). A sua missão
// é checar o cofre do Firebase: "Este usuário tem uma sessão ativa?".
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // O useEffect roda na primeira vez que a rota é chamada
  useEffect(() => {
    // "onAuthStateChanged" é um olheiro em tempo real. Se o token do usuário
    // expirar no meio da navegação, ele atualiza o estado na hora.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Função de limpeza (cleanup): desliga o olheiro quando saímos da tela, economizando memória
    return () => unsubscribe();
  }, []);

  // Enquanto o Firebase busca o token na rede, travamos a tela num loading
  // para evitar que o usuário veja um "flash" da tela de login por acidente.
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

  // A Decisão: Tem usuário? Renderiza a página (children). Não tem? Chuta de volta pro Login.
  return user ? <>{children}</> : <Navigate to="/" />;
}

// ----------------------------------------------------------------------------
// MAPEAMENTO DAS ROTAS DA APLICAÇÃO
// ----------------------------------------------------------------------------
export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas (Qualquer pessoa na internet pode acessar) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />{" "}
      {/* <-- NOVA TELA CONECTADA AQUI! */}
      {/* Rotas Privadas (Envelopadas pelo nosso Middleware) */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      {/* Fallback (Curinga): Se alguém digitar site.com/rota-que-nao-existe, volta pro Login */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
