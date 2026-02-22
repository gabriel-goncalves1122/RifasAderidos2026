// ============================================================================
// ARQUIVO: frontend/src/views/pages/DashboardPage.tsx
// RESPONSABILIDADE: Layout base, persistência de abas e proteção assíncrona.
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from "@mui/icons-material/Logout";

// Controladores e Componentes
import { useAuthController } from "../../controllers/useAuthController";
import { AuditoriaTable } from "../components/AuditoriaTable";
import { MinhasRifasTab } from "../components/MinhasRifasTab";
import { VisaoGraficaTab } from "../components/VisaoGraficaTab";
import { HistoricoDetalhadoTab } from "../components/HistoricoDetalhadoTab";
import { PremiosTab } from "../components/PremiosTab";

type Contexto = "aderido" | "tesouraria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout } = useAuthController();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Verificação de segurança (Lida com o tempo de resposta do Firebase)
  const isAdmin =
    usuarioAtual?.cargo === "tesouraria" ||
    usuarioAtual?.cargo === "presidencia";

  // ==========================================================================
  // ESTADOS COM PERSISTÊNCIA NA MEMÓRIA
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
  // PROTEÇÃO CONTRA BUGS DE F5 (Atualização de Página)
  // ==========================================================================
  // 1. Expulsão Segura: Só atua se o Firebase já tiver trazido o "cargo" do utilizador
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

  // 2. Gravação em tempo real na memória
  useEffect(() => {
    sessionStorage.setItem("dashboard_contexto", contextoAtual);
    sessionStorage.setItem("dashboard_aba", abaAtual.toString());
  }, [contextoAtual, abaAtual]);

  // 3. Blindagem Visual: Garante que a aba nunca aponta para um número que não existe
  const abaSegura = contextoAtual === "aderido" && abaAtual > 1 ? 0 : abaAtual;

  // ==========================================================================
  // AÇÕES
  // ==========================================================================
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setMenuAberto(open);
    };

  const mudarContexto = (novoContexto: Contexto) => {
    setContextoAtual(novoContexto);
    setAbaAtual(0);
    setMenuAberto(false);
  };

  // ==========================================================================
  // O MENU LATERAL (Drawer)
  // ==========================================================================
  const DrawerContent = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box
        sx={{
          p: 3,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "4px solid var(--cor-dourado-brilho)",
        }}
      >
        <img
          src="/images/PNG (1080x1080).png"
          alt="Logo Comissão"
          style={{ width: "90px", height: "auto", marginBottom: "12px" }}
        />
        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Portal da Comissão
        </Typography>
        <Typography
          variant="body2"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mt: 1,
            color: "secondary.light",
          }}
        >
          <AccountCircleIcon fontSize="small" />
          {isAdmin ? "Acesso Administrativo" : "Aderido"}
        </Typography>
      </Box>

      <List sx={{ mt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={contextoAtual === "aderido"}
            onClick={() => mudarContexto("aderido")}
          >
            <ListItemIcon>
              <AccountCircleIcon
                sx={{
                  color:
                    contextoAtual === "aderido" ? "secondary.main" : "inherit",
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary="Área do Aderido"
              sx={{
                fontWeight: contextoAtual === "aderido" ? "bold" : "normal",
              }}
            />
          </ListItemButton>
        </ListItem>

        {isAdmin && (
          <ListItem disablePadding>
            <ListItemButton
              selected={contextoAtual === "tesouraria"}
              onClick={() => mudarContexto("tesouraria")}
            >
              <ListItemIcon>
                <AdminPanelSettingsIcon
                  sx={{
                    color:
                      contextoAtual === "tesouraria"
                        ? "secondary.main"
                        : "inherit",
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary="Painel da Tesouraria"
                sx={{
                  fontWeight:
                    contextoAtual === "tesouraria" ? "bold" : "normal",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              sessionStorage.clear(); // Limpa a memória ao sair da conta
              handleLogout();
            }}
          >
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Sair da Conta"
              sx={{ color: "error.main", fontWeight: "bold" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        bgcolor: "background.default",
        pb: 6,
      }}
    >
      {/* HEADER HÍBRIDO */}
      <AppBar position="static" elevation={4} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
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

        {/* Repare que o value agora usa o 'abaSegura' */}
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

      <Drawer anchor="left" open={menuAberto} onClose={toggleDrawer(false)}>
        {DrawerContent}
      </Drawer>

      {/* ========================================================================== */}
      {/* ÁREA DE CONTEÚDO (RENDERIZAÇÃO CONDICIONAL BASEADA NA ABA SEGURA)          */}
      {/* ========================================================================== */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {/* --- CONTEXTO: ADERIDO --- */}
        {contextoAtual === "aderido" && abaSegura === 0 && <MinhasRifasTab />}
        {contextoAtual === "aderido" && abaSegura === 1 && (
          <PremiosTab isAdmin={isAdmin} />
        )}

        {/* --- CONTEXTO: TESOURARIA --- */}
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
