import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useEffect, useState, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Box, CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { auth } from "../shared/config/firebase";

// ----------------------------------------------------------------------------
// LAZY LOADING (Code Splitting)
// Só carrega os arquivos JS dessas telas quando o usuário realmente precisar.
// ----------------------------------------------------------------------------
const DashboardPage = React.lazy(() => import("../views/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const LoginPage = React.lazy(() => import("@/features/auth/pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import("@/features/auth/pages/RegisterPage").then(m => ({ default: m.RegisterPage })));

// ----------------------------------------------------------------------------
// ANIMAÇÃO DE PÁGINA (Framer Motion)
// ----------------------------------------------------------------------------
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  return user ? <>{children}</> : <Navigate to="/" />;
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Suspense fallback={<CircularProgress />}>
              <PageTransition><LoginPage /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/login"
          element={
            <Suspense fallback={<CircularProgress />}>
              <PageTransition><LoginPage /></PageTransition>
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<CircularProgress />}>
              <PageTransition><RegisterPage /></PageTransition>
            </Suspense>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Suspense fallback={<CircularProgress />}>
                <PageTransition><DashboardPage /></PageTransition>
              </Suspense>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}
