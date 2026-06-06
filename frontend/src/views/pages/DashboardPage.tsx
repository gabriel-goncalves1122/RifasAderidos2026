// ============================================================================
// ARQUIVO: frontend/src/views/pages/DashboardPage.tsx
// ============================================================================
import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { MinhasRifasTab } from "@/features/aderidos/MinhasRifasTab";
import { useAuthController } from "@/features/auth/hooks/useAuthController";
import { PremiosTab } from "@/features/premios/PremiosTab";
import { SecretariaView } from "@/features/secretaria/pages/SecretariaPage";
import { AuditoriaComprasPage } from "@/features/tesouraria/pages/AuditoriaComprasPage";
import { DesempenhoPage } from "@/features/tesouraria/pages/DesempenhoPage";
import { TesourariaPixPage } from "@/features/tesouraria/pages/TesourariaPixPage";
import { DashboardSidebar } from "@/shared/components/DashboardSidebar";
import { DashboardHeader } from "@/views/components/dashboard/DashboardHeader";

export type Contexto = "aderido" | "tesouraria" | "secretaria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout, loading } = useAuthController();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cargo = usuarioAtual?.cargo;

  // Admin e presidência mantêm acesso completo aos contextos administrativos.
  const isSuperAdmin = cargo === "admin" || cargo === "presidencia";

  const hasTesourariaAccess = isSuperAdmin || cargo === "tesouraria";
  const hasSecretariaAccess = isSuperAdmin || cargo === "secretaria";

  const [menuAberto, setMenuAberto] = useState(false);

  const [contextoAtual, setContextoAtual] = useState<Contexto>(() => {
    return (
      (sessionStorage.getItem("dashboard_contexto") as Contexto) || "aderido"
    );
  });

  const [abaAtual, setAbaAtual] = useState<number>(() => {
    const abaSalva = sessionStorage.getItem("dashboard_aba");

    return abaSalva !== null ? Number.parseInt(abaSalva, 10) : 0;
  });

  // Garante que o usuário não permaneça em um contexto sem permissão após login,
  // refresh ou troca manual de sessão.
  useEffect(() => {
    if (!usuarioAtual) return;

    if (contextoAtual === "tesouraria" && !hasTesourariaAccess) {
      setContextoAtual("aderido");
      setAbaAtual(0);
    }

    if (contextoAtual === "secretaria" && !hasSecretariaAccess) {
      setContextoAtual("aderido");
      setAbaAtual(0);
    }
  }, [usuarioAtual, contextoAtual, hasTesourariaAccess, hasSecretariaAccess]);

  // Mantém a última navegação do usuário dentro do painel.
  useEffect(() => {
    sessionStorage.setItem("dashboard_contexto", contextoAtual);
    sessionStorage.setItem("dashboard_aba", abaAtual.toString());
  }, [contextoAtual, abaAtual]);

  const limiteAbasPorContexto: Record<Contexto, number> = {
    aderido: 1,
    tesouraria: 2,
    secretaria: 0,
  };

  const abaSegura =
    abaAtual > limiteAbasPorContexto[contextoAtual] ? 0 : abaAtual;

  const mudarContexto = (novoContexto: Contexto) => {
    setContextoAtual(novoContexto);
    setAbaAtual(0);
  };

  const fazerLogout = () => {
    sessionStorage.clear();
    handleLogout();
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <DashboardHeader
        contextoAtual={contextoAtual}
        abaAtual={abaSegura}
        isMobile={isMobile}
        onOpenMenu={() => setMenuAberto(true)}
        onChangeAba={setAbaAtual}
      />

      <DashboardSidebar
        open={menuAberto}
        isSuperAdmin={isSuperAdmin}
        hasTesourariaAccess={hasTesourariaAccess}
        hasSecretariaAccess={hasSecretariaAccess}
        contextoAtual={contextoAtual}
        onClose={() => setMenuAberto(false)}
        onMudarContexto={mudarContexto}
        onLogout={fazerLogout}
      />

      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {contextoAtual === "aderido" && abaSegura === 0 && <MinhasRifasTab />}

        {contextoAtual === "aderido" && abaSegura === 1 && (
          <PremiosTab isAdmin={isSuperAdmin} />
        )}

        {contextoAtual === "tesouraria" &&
          abaSegura === 0 &&
          hasTesourariaAccess && <TesourariaPixPage />}

        {contextoAtual === "tesouraria" &&
          abaSegura === 1 &&
          hasTesourariaAccess && <DesempenhoPage />}

        {contextoAtual === "tesouraria" &&
          abaSegura === 2 &&
          hasTesourariaAccess && <AuditoriaComprasPage />}

        {contextoAtual === "secretaria" &&
          abaSegura === 0 &&
          hasSecretariaAccess && <SecretariaView />}
      </Container>
    </Box>
  );
}
