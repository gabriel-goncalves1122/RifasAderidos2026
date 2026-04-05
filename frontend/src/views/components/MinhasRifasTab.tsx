// ============================================================================
// ARQUIVO: frontend/src/views/components/MinhasRifasTab.tsx
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Badge,
} from "@mui/material";

// Ícones
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

// Sub-componentes
import { CheckoutModal } from "./CheckoutModal";
import { NotificacoesSidebar } from "./NotificacoesSidebar";
import { CarrinhoFlutuante } from "./CarrinhoFlutuante";

// Controladores
import { useRifasController } from "../../controllers/useRifasController";
import { useAuthController } from "../../controllers/useAuthController";

export function MinhasRifasTab() {
  const { buscarMinhasRifas, buscarNotificacoes, marcarNotificacoesLidas } =
    useRifasController();
  const { usuarioAtual } = useAuthController();

  const [minhasRifas, setMinhasRifas] = useState<any[]>([]);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<string>("todas");

  // Controle de Modais
  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);
  const [drawerNotificacoesAberto, setDrawerNotificacoesAberto] =
    useState(false);

  const carregarDadosIniciais = async () => {
    setCarregando(true);
    const [dadosRifas, dadosNotificacoes] = await Promise.all([
      buscarMinhasRifas(),
      buscarNotificacoes(),
    ]);

    if (dadosRifas) setMinhasRifas(dadosRifas);
    if (dadosNotificacoes) setNotificacoes(dadosNotificacoes);
    setCarregando(false);
  };

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const abrirSidebarNotificacoes = async () => {
    setDrawerNotificacoesAberto(true);
    const naoLidas = notificacoes.filter((n) => !n.lida).map((n) => n.id);

    if (naoLidas.length > 0) {
      await marcarNotificacoesLidas(naoLidas);
      setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
    }
  };

  const handleToggleSelecao = (numero: string, status: string) => {
    if (status !== "disponivel") return;
    setSelecionadas((prev) =>
      prev.includes(numero)
        ? prev.filter((n) => n !== numero)
        : [...prev, numero],
    );
  };

  const handleVendaSucesso = async () => {
    setModalCheckoutAberto(false);
    setSelecionadas([]);
    await carregarDadosIniciais();
  };

  // Cálculos Derivados
  const rifasFiltradas = minhasRifas.filter(
    (r) => filtro === "todas" || r.status === filtro,
  );
  const valorArrecadado =
    minhasRifas.filter((r) => r.status === "pago").length * 10;
  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

  const nomeCompleto =
    (usuarioAtual as any)?.nome ||
    (usuarioAtual as any)?.displayName ||
    "Aderido";
  const primeiroNome = nomeCompleto.split(" ")[0];

  const legendaTooltip = (
    <Box sx={{ p: 0.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography
        component="div"
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="span"
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid white",
            display: "inline-block",
          }}
        />{" "}
        Disponível
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="span"
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "var(--cor-verde-fundo)",
            display: "inline-block",
          }}
        />{" "}
        Selecionada
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="span"
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "warning.main",
            display: "inline-block",
          }}
        />{" "}
        Em Análise
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          component="span"
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "success.main",
            display: "inline-block",
          }}
        />{" "}
        Pago
      </Typography>
    </Box>
  );

  if (carregando)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );

  return (
    <Box sx={{ position: "relative", pb: selecionadas.length > 0 ? 12 : 2 }}>
      {/* 1. CABEÇALHO */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          Olá, {primeiroNome}!
        </Typography>
        <Tooltip title="Avisos da Tesouraria">
          <IconButton
            onClick={abrirSidebarNotificacoes}
            color={notificacoesNaoLidas > 0 ? "error" : "primary"}
          >
            <Badge
              badgeContent={notificacoesNaoLidas}
              color="error"
              overlap="circular"
            >
              {notificacoesNaoLidas > 0 ? (
                <NotificationsActiveIcon fontSize="large" />
              ) : (
                <NotificationsIcon fontSize="large" />
              )}
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>

      {/* 2. CARD FINANCEIRO */}
      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          gap: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, var(--cor-verde-fundo) 0%, #1a3c2f 100%)",
          color: "white",
          borderLeft: "6px solid var(--cor-dourado-brilho)",
        }}
      >
        <Box>
          <Typography
            variant="body2"
            sx={{
              opacity: 0.8,
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Arrecadação Confirmada
          </Typography>
          <Typography
            variant="h3"
            fontWeight="900"
            sx={{ mt: 1, color: "var(--cor-dourado-brilho)" }}
          >
            R$ {valorArrecadado},00
          </Typography>
        </Box>
      </Paper>

      {/* 3. BARRA DE CONTROLE E FILTROS */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          component="div"
          variant="h6"
          fontWeight="bold"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "primary.main",
          }}
        >
          Bloco de Vendas
          <Tooltip
            title={<React.Fragment>{legendaTooltip}</React.Fragment>}
            arrow
            placement="top"
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              sx={{
                bgcolor: "rgba(212, 175, 55, 0.2)",
                color: "secondary.main",
              }}
            >
              <HelpOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>

        <FormControl size="small" sx={{ minWidth: 160, bgcolor: "white" }}>
          <Select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            displayEmpty
            sx={{
              borderRadius: 2,
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            <MenuItem value="todas">Todas as Rifas</MenuItem>
            <MenuItem value="disponivel">Disponíveis</MenuItem>
            <MenuItem value="pendente">Em Análise</MenuItem>
            <MenuItem value="pago">Pagas</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* 4. GRID DE RIFAS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(75px, 1fr))"
        gap={1.5}
      >
        {rifasFiltradas.length > 0 ? (
          rifasFiltradas.map((rifa) => {
            const isSelecionada = selecionadas.includes(rifa.numero);
            let cor: "default" | "primary" | "success" | "warning" = "default";
            if (isSelecionada) cor = "primary";
            else if (rifa.status === "pago") cor = "success";
            else if (rifa.status === "pendente") cor = "warning";

            return (
              <Chip
                key={rifa.numero}
                label={rifa.numero}
                color={cor}
                variant={
                  rifa.status === "disponivel" && !isSelecionada
                    ? "outlined"
                    : "filled"
                }
                onClick={() => handleToggleSelecao(rifa.numero, rifa.status)}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  height: "40px",
                  borderRadius: "8px",
                  borderWidth:
                    rifa.status === "disponivel" && !isSelecionada
                      ? "2px"
                      : "0px",
                  cursor:
                    rifa.status === "disponivel" ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                  "&:hover": {
                    transform:
                      rifa.status === "disponivel" ? "scale(1.05)" : "none",
                  },
                }}
              />
            );
          })
        ) : (
          <Typography
            color="text.secondary"
            sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
          >
            Nenhuma rifa encontrada.
          </Typography>
        )}
      </Box>

      {/* 5. COMPONENTES EXTERNOS MODULARES */}
      {!modalCheckoutAberto && (
        <CarrinhoFlutuante
          quantidade={selecionadas.length}
          valorTotal={selecionadas.length * 10}
          onVenderClick={() => setModalCheckoutAberto(true)}
        />
      )}

      <CheckoutModal
        open={modalCheckoutAberto}
        onClose={() => setModalCheckoutAberto(false)}
        onSuccess={handleVendaSucesso}
        numerosRifas={selecionadas}
      />

      <NotificacoesSidebar
        open={drawerNotificacoesAberto}
        onClose={() => setDrawerNotificacoesAberto(false)}
        notificacoes={notificacoes}
      />
    </Box>
  );
}
