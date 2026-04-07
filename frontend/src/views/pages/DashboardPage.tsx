// ============================================================================
// ARQUIVO: frontend/src/views/pages/DashboardPage.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Container,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { useAuthController } from "../../controllers/useAuthController";
import { AuditoriaTable } from "../components/tesouraria/AuditoriaTable";
import { MinhasRifasTab } from "../components/aderidos/MinhasRifasTab";
import { VisaoGraficaTab } from "../components/tesouraria/VisaoGraficaTab";
import { HistoricoDetalhadoTab } from "../components/tesouraria/HistoricoDetalhadoTab";
import { PremiosTab } from "../components/premios/PremiosTab";
import { SecretariaView } from "./SecretariaPage";
import { DashboardSidebar } from "../components/comuns/DashboardSidebar";

export type Contexto = "aderido" | "tesouraria" | "secretaria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout, loading } = useAuthController();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // ==========================================================================
  // SEGURANÇA E SISTEMA DE CARGOS (RBAC)
  // ==========================================================================
  const cargo = usuarioAtual?.cargo;

  // O Admin/Presidência tem a chave-mestra para tudo
  const isSuperAdmin = cargo === "admin" || cargo === "presidencia";

  // Permissões específicas (se for Admin, tem automaticamente)
  const hasTesourariaAccess = isSuperAdmin || cargo === "tesouraria";
  const hasSecretariaAccess = isSuperAdmin || cargo === "secretaria";

  // ==========================================================================

  const [menuAberto, setMenuAberto] = useState(false);
  const [contextoAtual, setContextoAtual] = useState<Contexto>(() => {
    return (
      (sessionStorage.getItem("dashboard_contexto") as Contexto) || "aderido"
    );
  });
  const [abaAtual, setAbaAtual] = useState<number>(() => {
    const salva = sessionStorage.getItem("dashboard_aba");
    return salva !== null ? parseInt(salva, 10) : 0;
  });

  // Proteção de Rota: Expulsa o utilizador se não tiver permissão para o contexto atual
  useEffect(() => {
    if (usuarioAtual) {
      if (contextoAtual === "tesouraria" && !hasTesourariaAccess) {
        setContextoAtual("aderido");
        setAbaAtual(0);
      }
      if (contextoAtual === "secretaria" && !hasSecretariaAccess) {
        setContextoAtual("aderido");
        setAbaAtual(0);
      }
    }
  }, [usuarioAtual, contextoAtual, hasTesourariaAccess, hasSecretariaAccess]);

  useEffect(() => {
    sessionStorage.setItem("dashboard_contexto", contextoAtual);
    sessionStorage.setItem("dashboard_aba", abaAtual.toString());
  }, [contextoAtual, abaAtual]);

  const abaSegura =
    (contextoAtual === "aderido" || contextoAtual === "secretaria") &&
    abaAtual > 1
      ? 0
      : abaAtual;

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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const renderTituloHeader = () => {
    if (contextoAtual === "aderido") return "PORTAL DO ADERIDO";
    if (contextoAtual === "tesouraria") return "GESTÃO FINANCEIRA";
    return "SECRETARIA DA COMISSÃO";
  };

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      <AppBar position="static" elevation={4} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={() => setMenuAberto(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
          >
            {renderTituloHeader()}
          </Typography>
        </Toolbar>

        <Tabs
          value={abaSegura}
          onChange={(_, newValue) => setAbaAtual(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}
        >
          {contextoAtual === "aderido" && [
            <Tab
              key={0}
              label="Minhas Rifas"
              icon={<ConfirmationNumberIcon />}
              iconPosition="start"
            />,
            <Tab
              key={1}
              label="Prêmios"
              icon={<EmojiEventsIcon />}
              iconPosition="start"
            />,
          ]}

          {contextoAtual === "tesouraria" && [
            <Tab
              key={0}
              label="Aprovar Pix"
              icon={<FactCheckIcon />}
              iconPosition="start"
            />,
            <Tab
              key={1}
              label="Desempenho"
              icon={<AssessmentIcon />}
              iconPosition="start"
            />,
            <Tab
              key={2}
              label="Histórico"
              icon={<ReceiptLongIcon />}
              iconPosition="start"
            />,
          ]}

          {contextoAtual === "secretaria" && [
            <Tab
              key={0}
              label="Gestão de Aderidos"
              icon={<GroupAddIcon />}
              iconPosition="start"
            />,
          ]}
        </Tabs>
      </AppBar>

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
        {/* --- TELAS DO ADERIDO --- */}
        {contextoAtual === "aderido" && abaSegura === 0 && <MinhasRifasTab />}
        {contextoAtual === "aderido" && abaSegura === 1 && (
          <PremiosTab isAdmin={isSuperAdmin} />
        )}

        {/* --- TELAS DA TESOURARIA --- */}
        {contextoAtual === "tesouraria" &&
          abaSegura === 0 &&
          hasTesourariaAccess && (
            <Box>
              <Typography variant="h6" mb={2} color="text.secondary">
                Lista de Comprovantes Pendentes
              </Typography>
              <AuditoriaTable />
            </Box>
          )}
        {contextoAtual === "tesouraria" &&
          abaSegura === 1 &&
          hasTesourariaAccess && <VisaoGraficaTab />}
        {contextoAtual === "tesouraria" &&
          abaSegura === 2 &&
          hasTesourariaAccess && <HistoricoDetalhadoTab />}

        {/* --- TELAS DA SECRETARIA --- */}
        {contextoAtual === "secretaria" &&
          abaSegura === 0 &&
          hasSecretariaAccess && <SecretariaView />}
      </Container>
    </Box>
  );
}
