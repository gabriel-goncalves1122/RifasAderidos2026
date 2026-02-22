// ============================================================================
// ARQUIVO: frontend/src/views/components/MinhasRifasTab.tsx
// RESPONSABILIDADE: Interface de Cartela de Rifas com Carrinho de Venda Flutuante
// ============================================================================
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Button,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Portal,
} from "@mui/material";

// Ícones
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

import { CheckoutModal } from "./CheckoutModal";
import { useRifasController } from "../../controllers/useRifasController";
import { useAuthController } from "../../controllers/useAuthController";

export function MinhasRifasTab() {
  const { buscarMinhasRifas } = useRifasController();
  const { usuarioAtual } = useAuthController();

  // Estados de Dados
  const [minhasRifas, setMinhasRifas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados da Interface
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState<string>("todas");

  const carregarRifas = async () => {
    setCarregando(true);
    const dados = await buscarMinhasRifas();
    if (dados) setMinhasRifas(dados);
    setCarregando(false);
  };

  // Carrega os dados assim que o componente nasce na tela
  useEffect(() => {
    carregarRifas();
  }, []);

  // Seleção e desseleção de rifas disponíveis para vender
  const handleToggleSelecao = (numero: string, status: string) => {
    if (status !== "disponivel") return; // Só pode clicar nas brancas
    setSelecionadas((prev) =>
      prev.includes(numero)
        ? prev.filter((n) => n !== numero)
        : [...prev, numero],
    );
  };

  const handleVendaSucesso = async () => {
    setModalAberto(false);
    setSelecionadas([]);
    await carregarRifas(); // Atualiza a cartela para mostrar as recém-vendidas
  };

  // Lógica de Filtro Visual
  const rifasFiltradas = minhasRifas.filter(
    (r) => filtro === "todas" || r.status === filtro,
  );
  const valorArrecadado =
    minhasRifas.filter((r) => r.status === "pago").length * 10;
  const valorDaVendaAtual = selecionadas.length * 10;
  // Forçamos o TypeScript a procurar a propriedade 'nome' que vem do seu Banco de Dados
  const nomeCompleto =
    (usuarioAtual as any)?.nome ||
    (usuarioAtual as any)?.displayName ||
    "Aderido";
  const primeiroNome = nomeCompleto.split(" ")[0];

  // ==========================================================================
  // LEGENDA VISUAL (Para o Tooltip)
  // ==========================================================================
  const legendaTooltip = (
    <Box sx={{ p: 0.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "2px solid white",
          }}
        />{" "}
        Disponível
      </Typography>
      <Typography
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "var(--cor-verde-fundo)",
          }}
        />{" "}
        Selecionada
      </Typography>
      <Typography
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "warning.main",
          }}
        />{" "}
        Em Análise
      </Typography>
      <Typography
        variant="body2"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "success.main",
          }}
        />{" "}
        Pago
      </Typography>
    </Box>
  );

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", pb: selecionadas.length > 0 ? 12 : 2 }}>
      {/* CABEÇALHO FINANCEIRO (Novo Design) */}
      <Typography variant="h5" mb={3} fontWeight="bold" color="primary.main">
        Olá, {primeiroNome}!
      </Typography>

      <Paper
        elevation={4}
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          gap: 4,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, var(--cor-verde-fundo) 0%, #1a3c2f 100%)", // Gradiente Verde Premium
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

      {/* BARRA DE CONTROLE: Título + Legenda + Caixa Seletora */}
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
          {/* Tooltip agora renderiza sem Box/divs erradas para evitar o warning */}
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

      {/* GRID DE RIFAS (A grande cartela) */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(75px, 1fr))"
        gap={1.5}
      >
        {rifasFiltradas.length > 0 ? (
          rifasFiltradas.map((rifa) => {
            const isSelecionada = selecionadas.includes(rifa.numero);
            let cor: "default" | "primary" | "success" | "warning" = "default";

            // Lógica de Cores do Chip Baseado no Status
            if (isSelecionada)
              cor = "primary"; // No novo tema, primary é Verde Escuro!
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
            Nenhuma rifa encontrada nesta categoria.
          </Typography>
        )}
      </Box>

      {/* BARRA FLUTUANTE DE CHECKOUT (CARRINHO) */}
      {selecionadas.length > 0 && !modalAberto && (
        <Portal>
          <Paper
            elevation={10}
            sx={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 3,
              borderRadius: 8,
              bgcolor: "white",
              zIndex: 9999,
              width: { xs: "90%", sm: "auto" },
              justifyContent: "space-between",
              border: "3px solid var(--cor-dourado-brilho)", // Borda dourada grossa destacando o carrinho
            }}
          >
            <Box>
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.secondary"
              >
                {selecionadas.length} rifa(s) selecionada(s)
              </Typography>
              <Typography variant="h5" fontWeight="900" color="primary.main">
                R$ {valorDaVendaAtual},00
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary" // Botão dourado para fechar a venda
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ borderRadius: 6, fontWeight: "bold" }}
              onClick={() => setModalAberto(true)}
            >
              Vender
            </Button>
          </Paper>
        </Portal>
      )}

      {/* MODAL DE CHECKOUT OFICIAL */}
      <CheckoutModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSuccess={handleVendaSucesso} // O modal avisa a página que a venda ocorreu
        numerosRifas={selecionadas} // Manda os números marcados no grid para o form
      />
    </Box>
  );
}
