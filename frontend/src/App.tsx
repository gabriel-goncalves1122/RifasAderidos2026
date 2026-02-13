import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./views/pages/LoginPage";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";

// Componente simples para proteger rotas (Middleare de Frontend)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta mudanças na autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  return user ? <>{children}</> : <Navigate to="/" />;
}

// Vamos mover a lista de bilhetes para um componente Dashboard depois
// Por enquanto, vou criar um placeholder aqui
const DashboardPlaceholder = () => (
  <div className="p-8 text-center">
    <h1 className="text-2xl font-bold text-green-600">Bem-vindo, Aderido!</h1>
    <p>Aqui entrará a lista de rifas.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPlaceholder />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
