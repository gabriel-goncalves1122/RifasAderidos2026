import { useEffect, useState } from "react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

// Tipagem dos dados que esperamos do backend
interface DadosPainel {
  meta_vendas: number;
  total_arrecadado: number;
  bilhetes_vendidos: number;
  rifas_restantes: number;
}

export function DashboardPage() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Estados da página
  const [dados, setDados] = useState<DadosPainel | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        // Dispara a requisição. O Token vai automaticamente graças ao Interceptor!
        const response = await api.get("/dados-bancarios");

        // Pega a meta que veio do backend
        const metaBackend = response.data.dados.meta_vendas;

        // Como o backend ainda não calcula os totais, vamos simular o resto
        // para renderizar a interface. Depois substituímos por dados reais.
        setDados({
          meta_vendas: metaBackend,
          total_arrecadado: 250.0, // Simulação
          bilhetes_vendidos: 25, // Simulação
          rifas_restantes: 95, // Simulação (120 - 25)
        });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setErro("Não foi possível carregar as informações do servidor.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // Formata números para o padrão Moeda Real
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
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
        {/* Tratamento de Estados (Carregando / Erro) */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {erro && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {erro}
          </Alert>
        )}

        {/* Renderiza os cards apenas se tiver dados */}
        {!loading && dados && (
          <Grid container spacing={3}>
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
                  Sua meta de vendas é:{" "}
                  <strong>{formatarMoeda(dados.meta_vendas)}</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compartilhe seu link exclusivo para começar a vender.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Typography color="textSecondary" gutterBottom>
                  Total Arrecadado
                </Typography>
                <Typography variant="h3" component="div">
                  {formatarMoeda(dados.total_arrecadado)}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Typography color="textSecondary" gutterBottom>
                  Bilhetes Vendidos
                </Typography>
                <Typography variant="h3" component="div">
                  {dados.bilhetes_vendidos}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, textAlign: "center", height: "100%" }}>
                <Typography color="textSecondary" gutterBottom>
                  Rifas Restantes
                </Typography>
                <Typography variant="h3" component="div" color="success.main">
                  {dados.rifas_restantes}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
