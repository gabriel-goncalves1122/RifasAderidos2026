// ============================================================================
// ARQUIVO: frontend/src/views/pages/DashboardPage.tsx
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
  Paper,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAuthController } from "../../controllers/useAuthController";
import { useRifasController } from "../../controllers/useRifasController";
import { AuditoriaTable } from "../components/AuditoriaTable";
import { MinhasRifasTab } from "../components/MinhasRifasTab";
import { RelatoriosTab } from "../components/RelatoriosTab";

type Contexto = "aderido" | "tesouraria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout } = useAuthController();
  const { buscarMinhasRifas } = useRifasController();

  // Estados Híbridos de Navegação
  const [menuAberto, setMenuAberto] = useState(false);
  const [contextoAtual, setContextoAtual] = useState<Contexto>("aderido"); // Macro (Menu Lateral)
  const [abaAtual, setAbaAtual] = useState(0); // Micro (Header Tabs)

  const [minhasRifas, setMinhasRifas] = useState<any[]>([]);

  const isAdmin =
    usuarioAtual?.cargo === "tesouraria" ||
    usuarioAtual?.cargo === "presidencia";

  const carregarDados = async () => {
    const dados = await buscarMinhasRifas();
    setMinhasRifas(dados || []);
  };

  useEffect(() => {
    carregarDados();
  }, []);

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

  // Troca o "chapéu" do usuário e zera a aba para a primeira opção do novo contexto
  const mudarContexto = (novoContexto: Contexto) => {
    setContextoAtual(novoContexto);
    setAbaAtual(0);
    setMenuAberto(false);
  };

  // ==========================================================================
  // O MENU LATERAL (Contexto Macro)
  // ==========================================================================
  const DrawerContent = (
    <Box sx={{ width: 260 }} role="presentation">
      <Box
        sx={{
          p: 2,
          bgcolor: contextoAtual === "tesouraria" ? "#1e1e1e" : "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Portal UNIFEI
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
        >
          <AccountCircleIcon fontSize="small" />
          {isAdmin ? "Comissão 2026" : "Aderido"}
        </Typography>
      </Box>
      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={contextoAtual === "aderido"}
            onClick={() => mudarContexto("aderido")}
          >
            <ListItemIcon>
              <AccountCircleIcon
                color={contextoAtual === "aderido" ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText primary="Área do Aderido" />
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
                  color={contextoAtual === "tesouraria" ? "primary" : "inherit"}
                />
              </ListItemIcon>
              <ListItemText primary="Painel da Tesouraria" />
            </ListItemButton>
          </ListItem>
        )}
      </List>

      <Divider sx={{ mt: "auto" }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Sair da Conta"
              sx={{ color: "error.main" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* HEADER HÍBRIDO (APP BAR + TABS) */}
      <AppBar
        position="static"
        sx={{
          bgcolor: contextoAtual === "tesouraria" ? "#1e1e1e" : "primary.main",
        }}
      >
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
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            {contextoAtual === "aderido"
              ? "Portal do Aderido"
              : "Gestão Financeira"}
          </Typography>
        </Toolbar>

        {/* AS ABAS DE NAVEGAÇÃO (Micro Contexto) */}
        <Tabs
          value={abaAtual}
          onChange={(_, newValue) => setAbaAtual(newValue)}
          textColor="inherit"
          indicatorColor="secondary"
          variant="fullWidth"
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
                  label="Exportar Dados"
                  icon={<PeopleAltIcon />}
                  iconPosition="start"
                />,
              ]}
        </Tabs>
      </AppBar>

      <Drawer anchor="left" open={menuAberto} onClose={toggleDrawer(false)}>
        {DrawerContent}
      </Drawer>

      {/* ÁREA DE CONTEÚDO */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {/* ============================================================== */}
        {/* CONTEXTO: ADERIDO */}
        {/* ============================================================== */}
        {contextoAtual === "aderido" && abaAtual === 0 && (
          <MinhasRifasTab
            minhasRifas={minhasRifas}
            usuarioAtual={usuarioAtual}
            onAtualizacao={carregarDados}
          />
        )}

        {/* ============================================================== */}
        {/* CONTEXTO: TESOURARIA */}
        {/* ============================================================== */}
        {contextoAtual === "tesouraria" && abaAtual === 0 && isAdmin && (
          <Box>
            <Typography variant="h6" mb={2} color="text.secondary">
              Lista de Comprovantes Pendentes
            </Typography>
            <AuditoriaTable onAtualizacao={carregarDados} />
          </Box>
        )}

        {/* TELA 4: EXPORTAÇÃO E DASHBOARD (Tesouraria) */}
        {contextoAtual === "tesouraria" && abaAtual === 1 && isAdmin && (
          <RelatoriosTab />
        )}
      </Container>
    </Box>
  );
}
