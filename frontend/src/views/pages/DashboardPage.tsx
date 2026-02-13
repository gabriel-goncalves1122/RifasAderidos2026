import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

export function DashboardPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1, height: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar>
          <ConfirmationNumberIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Painel do Aderido
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.email}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Atualizado para a nova sintaxe do Grid (MUI v6) */}
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 3, display: "flex", flexDirection: "column" }}>
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                color="primary"
              >
                Olá, Engenheiro!
              </Typography>
              <Typography variant="body1">
                Sua meta de vendas é: <strong>R$ 1.200,00</strong>.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comece a vender compartilhando seu link exclusivo.
              </Typography>
            </Paper>
          </Grid>

          {/* Cards de métricas */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography color="textSecondary" gutterBottom>
                Total Arrecadado
              </Typography>
              <Typography variant="h3" component="div">
                R$ 0,00
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography color="textSecondary" gutterBottom>
                Bilhetes Vendidos
              </Typography>
              <Typography variant="h3" component="div">
                0
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
              <Typography color="textSecondary" gutterBottom>
                Rifas Restantes
              </Typography>
              <Typography variant="h3" component="div" color="success.main">
                120
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
