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
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

// Controladores e Componentes
import { useAuthController } from "../../controllers/useAuthController";
import { useRifasController } from "../../controllers/useRifasController";
import { AuditoriaTable } from "../components/AuditoriaTable";
import { MinhasRifasTab } from "../components/MinhasRifasTab";
import { VisaoGraficaTab } from "../components/VisaoGraficaTab";
import { HistoricoDetalhadoTab } from "../components/HistoricoDetalhadoTab";

// Define os "chapéus" que o usuário pode vestir na plataforma
type Contexto = "aderido" | "tesouraria";

export function DashboardPage() {
  const { usuarioAtual, handleLogout } = useAuthController();
  const { buscarMinhasRifas } = useRifasController();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta se é celular

  // ==========================================================================
  // ESTADOS DE NAVEGAÇÃO HÍBRIDA
  // ==========================================================================
  const [menuAberto, setMenuAberto] = useState(false);
  const [contextoAtual, setContextoAtual] = useState<Contexto>("aderido"); // Macro (Menu Lateral)
  const [abaAtual, setAbaAtual] = useState(0); // Micro (Header Tabs)

  const [minhasRifas, setMinhasRifas] = useState<any[]>([]);

  // Verificação de segurança de rotas
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
    setAbaAtual(0); // Volta sempre para a aba 0 ao trocar de menu
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
          Portal da Comissão
        </Typography>
        <Typography
          variant="body2"
          sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
        >
          <AccountCircleIcon fontSize="small" />
          {isAdmin ? "Acesso Administrativo" : "Aderido"}
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
      {/* ========================================================================== */}
      {/* HEADER HÍBRIDO (APP BAR + TABS)                                            */}
      {/* ========================================================================== */}
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
          variant={isMobile ? "scrollable" : "fullWidth"} // Evita que esprema no celular
          scrollButtons={isMobile ? "auto" : false}
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
                // BUG CORRIGIDO: Agora temos os 3 botões correspondentes às 3 telas da tesouraria
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
                  label="Histórico e CSV"
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
      {/* ÁREA DE CONTEÚDO (RENDERIZAÇÃO CONDICIONAL)                                */}
      {/* ========================================================================== */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {/* --- CONTEXTO: ADERIDO --- */}
        {contextoAtual === "aderido" && abaAtual === 0 && (
          <MinhasRifasTab
            minhasRifas={minhasRifas}
            usuarioAtual={usuarioAtual}
            onAtualizacao={carregarDados}
          />
        )}

        {contextoAtual === "aderido" && abaAtual === 1 && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CardGiftcardIcon
              sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h5" color="text.secondary">
              Prêmios em Breve
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A comissão anunciará os prêmios do sorteio nesta aba.
            </Typography>
          </Box>
        )}

        {/* --- CONTEXTO: TESOURARIA --- */}
        {contextoAtual === "tesouraria" && abaAtual === 0 && isAdmin && (
          <Box>
            <Typography variant="h6" mb={2} color="text.secondary">
              Lista de Comprovantes Pendentes
            </Typography>
            <AuditoriaTable onAtualizacao={carregarDados} />
          </Box>
        )}

        {contextoAtual === "tesouraria" && abaAtual === 1 && isAdmin && (
          <VisaoGraficaTab />
        )}

        {contextoAtual === "tesouraria" && abaAtual === 2 && isAdmin && (
          <HistoricoDetalhadoTab />
        )}
      </Container>
    </Box>
  );
}
