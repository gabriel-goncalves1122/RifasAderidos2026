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
import { Contexto } from "../../pages/DashboardPage";

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
  // Rótulo Dinâmico do Perfil
  const getCargoLabel = () => {
    if (isSuperAdmin) return "Administração Geral";
    if (hasTesourariaAccess) return "Tesouraria";
    if (hasSecretariaAccess) return "Secretaria";
    return "Aderido";
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
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
            alt="Logo"
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
            {getCargoLabel()}
          </Typography>
        </Box>

        <List sx={{ mt: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              selected={contextoAtual === "aderido"}
              onClick={() => {
                onMudarContexto("aderido");
                onClose();
              }}
            >
              <ListItemIcon>
                <AccountCircleIcon
                  sx={{
                    color:
                      contextoAtual === "aderido"
                        ? "secondary.main"
                        : "inherit",
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

          {hasSecretariaAccess && (
            <ListItem disablePadding>
              <ListItemButton
                selected={contextoAtual === "secretaria"}
                onClick={() => {
                  onMudarContexto("secretaria");
                  onClose();
                }}
              >
                <ListItemIcon>
                  <GroupAddIcon
                    sx={{
                      color:
                        contextoAtual === "secretaria"
                          ? "secondary.main"
                          : "inherit",
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary="Painel da Secretaria"
                  sx={{
                    fontWeight:
                      contextoAtual === "secretaria" ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}

          {hasTesourariaAccess && (
            <ListItem disablePadding>
              <ListItemButton
                selected={contextoAtual === "tesouraria"}
                onClick={() => {
                  onMudarContexto("tesouraria");
                  onClose();
                }}
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
