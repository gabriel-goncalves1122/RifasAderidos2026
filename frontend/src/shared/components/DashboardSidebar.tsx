import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

import { dashboardSidebarStyles } from "@/shared/styles/dashboardSidebarStyles";
import { Contexto } from "@/views/pages/DashboardPage";

interface Props {
  open: boolean;
  isSuperAdmin: boolean;
  hasTesourariaAccess: boolean;
  hasSecretariaAccess: boolean;
  contextoAtual: Contexto;
  onClose: () => void;
  onMudarContexto: (contexto: Contexto) => void;
  onLogout: () => void;
}

export function DashboardSidebar({
  open,
  isSuperAdmin,
  hasTesourariaAccess,
  hasSecretariaAccess,
  contextoAtual,
  onClose,
  onMudarContexto,
  onLogout,
}: Props) {
  const getCargoLabel = () => {
    if (isSuperAdmin) return "Administração Geral";
    if (hasTesourariaAccess) return "Tesouraria";
    if (hasSecretariaAccess) return "Secretaria";
    return "Aderido";
  };

  const itemAderidoSelecionado = contextoAtual === "aderido";
  const itemSecretariaSelecionado = contextoAtual === "secretaria";
  const itemTesourariaSelecionado = contextoAtual === "tesouraria";

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: dashboardSidebarStyles.drawerPaper }}
    >
      <Box sx={dashboardSidebarStyles.root} role="presentation">
        <Box
          sx={dashboardSidebarStyles.header}
          data-testid="dashboard-sidebar-header"
        >
          <img
            src="/images/PNG (1080x1080).png"
            alt="Logo"
            style={{ width: "90px", height: "auto", marginBottom: "12px" }}
          />
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            Portal da Comissão
          </Typography>
          <Typography
            variant="body2"
            sx={dashboardSidebarStyles.cargo}
          >
            <AccountCircleIcon fontSize="small" />
            {getCargoLabel()}
          </Typography>
        </Box>

        <List sx={dashboardSidebarStyles.list}>
          <ListItem disablePadding>
            <ListItemButton
              selected={itemAderidoSelecionado}
              data-testid="dashboard-contexto-aderido"
              sx={dashboardSidebarStyles.itemButton(itemAderidoSelecionado)}
              onClick={() => {
                onMudarContexto("aderido");
                onClose();
              }}
            >
              <ListItemIcon
                sx={dashboardSidebarStyles.itemIcon(itemAderidoSelecionado)}
              >
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Área do Aderido"
                primaryTypographyProps={{
                  fontWeight: itemAderidoSelecionado ? 900 : 700,
                }}
              />
            </ListItemButton>
          </ListItem>

          {hasSecretariaAccess && (
            <ListItem disablePadding>
              <ListItemButton
                selected={itemSecretariaSelecionado}
                data-testid="dashboard-contexto-secretaria"
                sx={dashboardSidebarStyles.itemButton(
                  itemSecretariaSelecionado,
                )}
                onClick={() => {
                  onMudarContexto("secretaria");
                  onClose();
                }}
              >
                <ListItemIcon
                  sx={dashboardSidebarStyles.itemIcon(
                    itemSecretariaSelecionado,
                  )}
                >
                  <GroupAddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Painel da Secretaria"
                  primaryTypographyProps={{
                    fontWeight: itemSecretariaSelecionado ? 900 : 700,
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}

          {hasTesourariaAccess && (
            <ListItem disablePadding>
              <ListItemButton
                selected={itemTesourariaSelecionado}
                data-testid="dashboard-contexto-tesouraria"
                sx={dashboardSidebarStyles.itemButton(
                  itemTesourariaSelecionado,
                )}
                onClick={() => {
                  onMudarContexto("tesouraria");
                  onClose();
                }}
              >
                <ListItemIcon
                  sx={dashboardSidebarStyles.itemIcon(
                    itemTesourariaSelecionado,
                  )}
                >
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Painel da Tesouraria"
                  primaryTypographyProps={{
                    fontWeight: itemTesourariaSelecionado ? 900 : 700,
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider sx={dashboardSidebarStyles.divider} />
        <List sx={{ px: 1 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={onLogout}>
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
    </Drawer>
  );
}
