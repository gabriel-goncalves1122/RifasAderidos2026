// ============================================================================
// ARQUIVO: frontend/src/views/pages/DashboardPage.tsx
// RESPONSABILIDADE: Layout base, persistência de abas e proteção de rotas.
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
} from "@mui/material";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

// Controladores e Componentes
import { useAuthController } from "../../controllers/useAuthController";
import { AuditoriaTable } from "../components/AuditoriaTable";
import { MinhasRifasTab } from "../components/MinhasRifasTab";
import { VisaoGraficaTab } from "../components/VisaoGraficaTab";
import { HistoricoDetalhadoTab } from "../components/HistoricoDetalhadoTab";
import { PremiosTab } from "../components/PremiosTab";
import { DashboardSidebar } from "../components/DashboardSidebar"; // <-- Nosso novo componente

type Contexto = "aderido" | "tesouraria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout, loading } = useAuthController();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 1. SEGURANÇA: Verifica se o usuário tem privilégios de admin
  const isAdmin =
    usuarioAtual?.cargo === "tesouraria" ||
    usuarioAtual?.cargo === "presidencia";

  // ==========================================================================
  // ESTADOS COM PERSISTÊNCIA NA MEMÓRIA (Evita reset ao dar F5)
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

  // ==========================================================================
  // PROTEÇÕES E EFEITOS
  // ==========================================================================

  // Efeito 1: Se um Aderido tentar acessar a URL da tesouraria forçando, ele é jogado de volta
  useEffect(() => {
    if (usuarioAtual && usuarioAtual.cargo) {
      const adminReal =
        usuarioAtual.cargo === "tesouraria" ||
        usuarioAtual.cargo === "presidencia";
      if (!adminReal && contextoAtual === "tesouraria") {
        setContextoAtual("aderido");
        setAbaAtual(0);
      }
    }
  }, [usuarioAtual, contextoAtual]);

  // Efeito 2: Salva sempre a posição atual do usuário no navegador
  useEffect(() => {
    sessionStorage.setItem("dashboard_contexto", contextoAtual);
    sessionStorage.setItem("dashboard_aba", abaAtual.toString());
  }, [contextoAtual, abaAtual]);

  // Proteção Visual: Garante que a aba selecionada existe no contexto atual
  // Ex: Aderido só tem 2 abas (0 e 1). Se o estado estiver em 2, ele zera.
  const abaSegura = contextoAtual === "aderido" && abaAtual > 1 ? 0 : abaAtual;

  // ==========================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ==========================================================================
  const mudarContexto = (novoContexto: Contexto) => {
    setContextoAtual(novoContexto);
    setAbaAtual(0); // Sempre que muda de Aderido <-> Tesouraria, volta para a aba principal
  };

  const fazerLogout = () => {
    sessionStorage.clear(); // Limpa a memória para não logar com a aba antiga depois
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
        <Typography variant="h5" color="primary">
          Verificando sessão...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "background.default" }}
    >
      {/* ===================================================================== */}
      {/* 1. CABEÇALHO (HEADER) - Renderiza dinamicamente baseado no contexto   */}
      {/* ===================================================================== */}
      <AppBar position="static" elevation={4} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setMenuAberto(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
          >
            {contextoAtual === "aderido"
              ? "PORTAL DO ADERIDO"
              : "GESTÃO FINANCEIRA"}
          </Typography>
        </Toolbar>

        {/* NAVEGAÇÃO SECUNDÁRIA (Abas) */}
        <Tabs
          value={abaSegura}
          onChange={(_, newValue) => setAbaAtual(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}
        >
          {contextoAtual === "aderido"
            ? [
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
              ]
            : [
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
        </Tabs>
      </AppBar>

      {/* ===================================================================== */}
      {/* 2. MENU LATERAL (SIDEBAR) - Totalmente modularizado                   */}
      {/* ===================================================================== */}
      <DashboardSidebar
        open={menuAberto}
        isAdmin={isAdmin}
        contextoAtual={contextoAtual}
        onClose={() => setMenuAberto(false)}
        onMudarContexto={mudarContexto}
        onLogout={fazerLogout}
      />

      {/* ===================================================================== */}
      {/* 3. ÁREA DE CONTEÚDO (MAIN) - Injeta a página correta                  */}
      {/* ===================================================================== */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {/* --- TELAS DO ADERIDO --- */}
        {contextoAtual === "aderido" && abaSegura === 0 && <MinhasRifasTab />}
        {contextoAtual === "aderido" && abaSegura === 1 && (
          <PremiosTab isAdmin={isAdmin} />
        )}

        {/* --- TELAS DA TESOURARIA --- */}
        {contextoAtual === "tesouraria" && abaSegura === 0 && isAdmin && (
          <Box>
            <Typography variant="h6" mb={2} color="text.secondary">
              Lista de Comprovantes Pendentes
            </Typography>
            <AuditoriaTable />
          </Box>
        )}
        {contextoAtual === "tesouraria" && abaSegura === 1 && isAdmin && (
          <VisaoGraficaTab />
        )}
        {contextoAtual === "tesouraria" && abaSegura === 2 && isAdmin && (
          <HistoricoDetalhadoTab />
        )}
      </Container>
    </Box>
  );
}
