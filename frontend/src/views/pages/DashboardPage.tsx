// ============================================================================
// ARQUIVO: DashboardPage.tsx (Interface Refatorada)
// ============================================================================
import React, { useState, useEffect, useCallback } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Ícones
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

// Hooks e Componentes Containerizados
import { useAuthController } from "../../controllers/useAuthController";
import { useRifasController } from "../../controllers/useRifasController";
import { CheckoutModal } from "../components/CheckoutModal";
import { RifaGrid } from "../components/RifaGrid"; // Componente extraído
import { ResumoHeader } from "../components/ResumoHeader"; // Componente extraído
import { AuditoriaTable } from "../components/AuditoriaTable"; // Componente extraído

export function DashboardPage() {
  const navigate = useNavigate();
  const { usuarioAtual } = useAuthController();
  const { buscarMinhasRifas } = useRifasController();

  const [tabValue, setTabValue] = useState(0);
  const [filtroVisao, setFiltroVisao] = useState<"disponiveis" | "vendidas">(
    "disponiveis",
  );
  const [rifasSelecionadas, setRifasSelecionadas] = useState<string[]>([]);
  const [bilhetesReais, setBilhetesReais] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const isAdmin =
    usuarioAtual?.cargo === "tesouraria" ||
    usuarioAtual?.cargo === "presidencia";

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    const dados = await buscarMinhasRifas();
    if (dados) setBilhetesReais(dados);
    setCarregando(false);
  }, [buscarMinhasRifas]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleToggleRifa = (numero: string) => {
    setRifasSelecionadas((prev) =>
      prev.includes(numero)
        ? prev.filter((n) => n !== numero)
        : [...prev, numero],
    );
  };

  const bilhetesExibidos =
    filtroVisao === "disponiveis"
      ? bilhetesReais.filter((b) => b.status === "disponivel")
      : bilhetesReais.filter((b) => b.status !== "disponivel");

  const totalConfirmado =
    bilhetesReais.filter((b) => b.status === "pago").length * 10;

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <ConfirmationNumberIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Portal do Aderido - UNIFEI 2026
          </Typography>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* COMPONENTE CONTAINERIZADO: RESUMO */}
        <ResumoHeader usuario={usuarioAtual} arrecadacao={totalConfirmado} />

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Minhas Rifas" />
            <Tab label="Prêmios" />
            {isAdmin && (
              <Tab
                label="Tesouraria"
                icon={<AdminPanelSettingsIcon />}
                iconPosition="start"
              />
            )}
          </Tabs>
        </Box>

        {/* ABA 1: MINHAS RIFAS */}
        <TabPanel value={tabValue} index={0}>
          <Stack spacing={3}>
            <Paper sx={{ p: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Visualização</InputLabel>
                <Select
                  value={filtroVisao}
                  label="Visualização"
                  onChange={(e) => setFiltroVisao(e.target.value as any)}
                >
                  <MenuItem value="disponiveis">
                    🟢 Disponíveis para Venda
                  </MenuItem>
                  <MenuItem value="vendidas">📦 Histórico / Pendentes</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {rifasSelecionadas.length > 0 && (
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  backgroundColor: "#e8f5e9",
                  border: "1px solid #4caf50",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  color="success.dark"
                  fontWeight="bold"
                >
                  {rifasSelecionadas.length} selecionadas = R${" "}
                  {rifasSelecionadas.length * 10}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ShoppingCartCheckoutIcon />}
                  onClick={() => setModalOpen(true)}
                >
                  Vender Agora
                </Button>
              </Paper>
            )}

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Grade de Bilhetes
              </Typography>

              {/* COMPONENTE CONTAINERIZADO: GRID DE RIFAS */}
              <RifaGrid
                bilhetes={bilhetesExibidos}
                carregando={carregando}
                selecionadas={rifasSelecionadas}
                onToggleRifa={handleToggleRifa}
              />
            </Paper>
          </Stack>
        </TabPanel>

        {/* ABA 2: PRÊMIOS */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5">Prêmios da Campanha</Typography>
          <Typography color="text.secondary">
            Os prêmios serão listados em breve.
          </Typography>
        </TabPanel>

        {/* CONTEÚDO 3: ADMINISTRAÇÃO (TESOURARIA) */}
        {isAdmin && (
          <TabPanel value={tabValue} index={2}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AdminPanelSettingsIcon
                  sx={{ fontSize: 32, color: "success.main", mr: 1 }}
                />
                <Typography variant="h5" fontWeight="bold">
                  Auditoria de Vendas
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Revise os comprovantes de pagamento abaixo. A aprovação
                transfere o dinheiro virtualmente para a meta do aderido.
                Rejeitar devolve a rifa para o mercado.
              </Typography>

              {/* O NOSSO NOVO COMPONENTE AQUI */}
              <AuditoriaTable onAtualizacao={carregarDados} />
            </Paper>
          </TabPanel>
        )}
      </Container>

      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          setRifasSelecionadas([]);
          carregarDados();
        }}
        numerosRifas={rifasSelecionadas}
      />
    </Box>
  );
}

// Helper local para TabPanel
function TabPanel({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}
