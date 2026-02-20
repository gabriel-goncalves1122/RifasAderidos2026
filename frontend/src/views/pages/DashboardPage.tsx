import React, { useState } from "react";
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
  Tabs,
  Tab,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Popover,
  Stack,
} from "@mui/material";

// Ícones
import LogoutIcon from "@mui/icons-material/Logout";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { Bilhete, Premio } from "../../types/models";
import { CheckoutModal } from "../components/CheckoutModal";

// ==========================================
// COMPONENTE 1: ABA (TAB PANEL)
// ==========================================
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other} // <-- ADICIONE ISSO AQUI
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// ==========================================
// COMPONENTE 2: ÍCONE DE AJUDA E LEGENDA (NOVO)
// ==========================================
function LegendaPopover({
  tipoVisao,
}: {
  tipoVisao: "disponiveis" | "vendidas";
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        color="primary"
        sx={{ ml: 1 }}
        title="Ver legenda de cores"
      >
        <HelpOutlineIcon fontSize="small" />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: "220px" }}>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Legenda de Cores
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            {tipoVisao === "vendidas" ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="0000" color="success" size="small" />
                  <Typography variant="body2">Pago (Confirmado)</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="0000" color="info" size="small" />
                  <Typography variant="body2">
                    Em Análise (PIX enviado)
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="0000" color="warning" size="small" />
                  <Typography variant="body2">
                    Reservado (Aguardando PIX)
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="0000" variant="outlined" size="small" />
                  <Typography variant="body2">Disponível para venda</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label="0000" color="primary" size="small" />
                  <Typography variant="body2">
                    Selecionado (No Carrinho)
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Popover>
    </>
  );
}

// ==========================================
// DADOS SIMULADOS (MOCKS)
// ==========================================
const mockBilhetes: Bilhete[] = Array.from({ length: 120 }, (_, i) => {
  const numero = (i + 1).toString().padStart(4, "0");
  let status: Bilhete["status"] = "disponivel";
  if (i < 15) status = "pago";
  else if (i < 20) status = "em_analise";
  else if (i < 22) status = "reservado";

  return {
    numero,
    status,
    vendedor_cpf: "12345678900",
    comprador_id: status !== "disponivel" ? "comp_123" : null,
    data_reserva: null,
    data_pagamento: null,
    comprovante_url: null,
  };
});

const mockPremios: Premio[] = [
  {
    id: "1",
    ordem_sorteio: 1,
    titulo: "Pix de R$ 5.000,00",
    descricao: "Prêmio principal em dinheiro.",
    imagem_url:
      "https://images.unsplash.com/photo-1580519542014-cb928cb981b5?q=80&w=500&auto=format&fit=crop",
  },
  {
    id: "2",
    ordem_sorteio: 2,
    titulo: "iPhone 15 Pro Max",
    descricao: "O smartphone mais desejado.",
    imagem_url:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=500&auto=format&fit=crop",
  },
];

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================
export function DashboardPage() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [filtroVisao, setFiltroVisao] = useState<"disponiveis" | "vendidas">(
    "disponiveis",
  );

  // Carrinho e Modal
  const [rifasSelecionadas, setRifasSelecionadas] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

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

  const bilhetesDisponiveis = mockBilhetes.filter(
    (b) => b.status === "disponivel",
  );
  const bilhetesVendidos = mockBilhetes.filter(
    (b) => b.status !== "disponivel",
  );
  const bilhetesExibidos =
    filtroVisao === "disponiveis" ? bilhetesDisponiveis : bilhetesVendidos;

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar>
          <ConfirmationNumberIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Painel do Aderido
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
        {/* CABEÇALHO */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" color="primary">
              Olá, Engenheiro!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seu Lote: 0001 a 0120
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Meta Arrecadada
            </Typography>
            <Typography variant="h4" color="success.main">
              R$ 150,00 / R$ 1.200,00
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
            <Tab label="Minhas Rifas" />
            <Tab label="Prêmios do Sorteio" />
          </Tabs>
        </Box>

        {/* ABA 1: MINHAS RIFAS */}
        <CustomTabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="filtro-visao-label">
                Alternar Visualização
              </InputLabel>
              <Select
                labelId="filtro-visao-label"
                value={filtroVisao}
                onChange={(e) => {
                  setFiltroVisao(e.target.value as "disponiveis" | "vendidas");
                  if (e.target.value === "vendidas") setRifasSelecionadas([]);
                }}
                label="Alternar Visualização"
              >
                <MenuItem value="disponiveis">
                  🟢 Ver Rifas Disponíveis ({bilhetesDisponiveis.length})
                </MenuItem>
                <MenuItem value="vendidas">
                  📦 Ver Histórico de Vendas ({bilhetesVendidos.length})
                </MenuItem>
              </Select>
            </FormControl>
          </Paper>

          {/* BANNER DO CARRINHO */}
          {rifasSelecionadas.length > 0 && filtroVisao === "disponiveis" && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: "#e8f5e9",
                border: "1px solid #4caf50",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                variant="h6"
                color="success.main"
                sx={{ fontWeight: "bold" }}
              >
                {rifasSelecionadas.length} rifa(s) selecionada(s) = R${" "}
                {(rifasSelecionadas.length * 10).toFixed(2).replace(".", ",")}
              </Typography>
              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={() => setModalOpen(true)}
              >
                Avançar para Pagamento
              </Button>
            </Paper>
          )}

          {/* GRADE DE RIFAS COM O ÍCONE DE AJUDA */}
          <Paper sx={{ p: 3, minHeight: "300px" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                color={
                  filtroVisao === "disponiveis" ? "primary" : "textSecondary"
                }
              >
                {filtroVisao === "disponiveis"
                  ? "Clique nos números para adicionar à venda:"
                  : "Rifas já negociadas:"}
              </Typography>

              {/* COMPONENTE DA LEGENDA CHAMADO AQUI */}
              <LegendaPopover tipoVisao={filtroVisao} />
            </Box>

            <Grid container spacing={1.5}>
              {bilhetesExibidos.map((bilhete) => {
                const isSelected = rifasSelecionadas.includes(bilhete.numero);

                let chipColor:
                  | "default"
                  | "primary"
                  | "success"
                  | "warning"
                  | "info" = "default";
                let chipVariant: "outlined" | "filled" = "filled";

                if (bilhete.status === "disponivel") {
                  chipColor = isSelected ? "primary" : "default";
                  chipVariant = isSelected ? "filled" : "outlined";
                } else {
                  if (bilhete.status === "pago") chipColor = "success";
                  else if (bilhete.status === "em_analise") chipColor = "info";
                  else if (bilhete.status === "reservado")
                    chipColor = "warning";
                }

                return (
                  <Grid size={{ xs: 3, sm: 2, md: 1.5 }} key={bilhete.numero}>
                    <Chip
                      label={bilhete.numero}
                      variant={chipVariant}
                      color={chipColor}
                      onClick={
                        bilhete.status === "disponivel"
                          ? () => handleToggleRifa(bilhete.numero)
                          : undefined
                      }
                      sx={{
                        width: "100%",
                        fontWeight: "bold",
                        cursor:
                          bilhete.status === "disponivel"
                            ? "pointer"
                            : "default",
                        transition: "all 0.2s ease-in-out",
                        transform: isSelected ? "scale(1.05)" : "scale(1)",
                        boxShadow: isSelected ? 2 : 0,
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </CustomTabPanel>

        {/* ABA 2: PRÊMIOS */}
        <CustomTabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {mockPremios.map((premio) => (
              <Grid size={{ xs: 12, md: 6 }} key={premio.id}>
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    height: "100%",
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: { xs: "100%", sm: 200 },
                      height: { xs: 200, sm: "auto" },
                      objectFit: "cover",
                    }}
                    image={premio.imagem_url}
                    alt={premio.titulo}
                  />
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h5" color="primary">
                      {premio.ordem_sorteio}º Prêmio
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {premio.titulo}
                    </Typography>
                    <Typography variant="body2" component="div">
                      {premio.descricao}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CustomTabPanel>
      </Container>

      <CheckoutModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          setModalOpen(false);
          setRifasSelecionadas([]);
        }}
        numerosRifas={rifasSelecionadas}
      />
    </Box>
  );
}
