// ============================================================================
// ARQUIVO: frontend/src/views/pages/TesourariaPage.tsx (NOVA TELA)
// ============================================================================
import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Ícones
import MenuIcon from "@mui/icons-material/Menu";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Componentes
import { AuditoriaTable } from "../components/AuditoriaTable";
import { useAuthController } from "../../controllers/useAuthController";

type ViewState = "auditoria" | "aderidos";

export function TesourariaPage() {
  const navigate = useNavigate();
  const { usuarioAtual } = useAuthController();
  const [menuAberto, setMenuAberto] = useState(false);
  const [visaoAtual, setVisaoAtual] = useState<ViewState>("auditoria");

  // Se um espertinho tentar acessar a rota digitando na URL sem ser admin, é expulso
  if (usuarioAtual && usuarioAtual.cargo === "membro") {
    navigate("/");
    return null;
  }

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

  const mudarVisao = (novaVisao: ViewState) => {
    setVisaoAtual(novaVisao);
    setMenuAberto(false); // Fecha o menu lateral no mobile após clicar
  };

  // ==========================================================================
  // CONTEÚDO DO MENU LATERAL (DRAWER)
  // ==========================================================================
  const DrawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2, bgcolor: "#1e1e1e", color: "white" }}>
        <Typography variant="h6" fontWeight="bold">
          Comissão 2026
        </Typography>
        <Typography variant="body2" color="gray">
          Painel Administrativo
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={visaoAtual === "auditoria"}
            onClick={() => mudarVisao("auditoria")}
          >
            <ListItemIcon>
              <FactCheckIcon
                color={visaoAtual === "auditoria" ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText primary="Aprovar Pix" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={visaoAtual === "aderidos"}
            onClick={() => mudarVisao("aderidos")}
          >
            <ListItemIcon>
              <PeopleAltIcon
                color={visaoAtual === "aderidos" ? "primary" : "inherit"}
              />
            </ListItemIcon>
            <ListItemText primary="Dados e Relatórios" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <ArrowBackIcon color="error" />
            </ListItemIcon>
            <ListItemText
              primary="Voltar ao Início"
              sx={{ color: "error.main" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* APP BAR ESCURA (ZONA ADMIN) */}
      <AppBar position="static" sx={{ bgcolor: "#1e1e1e" }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {visaoAtual === "auditoria"
              ? "Auditoria de Vendas"
              : "Base de Aderidos"}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* O MENU LATERAL DESLIZANTE */}
      <Drawer anchor="left" open={menuAberto} onClose={toggleDrawer(false)}>
        {DrawerContent}
      </Drawer>

      {/* ÁREA DE CONTEÚDO DINÂMICA */}
      <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }}>
        {visaoAtual === "auditoria" && (
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              Auditoria de Comprovantes
            </Typography>
            {/* Como essa tela é dedicada, não precisamos passar a prop onAtualizacao, 
                ou podemos criar uma função de recarregar se quisermos no futuro */}
            <AuditoriaTable />
          </Box>
        )}

        {visaoAtual === "aderidos" && (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <PeopleAltIcon
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold">
              Exportação de Dados
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Em breve, você poderá gerar a lista de compradores e bilhetes
              pagos em Excel/CSV aqui.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}
