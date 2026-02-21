// ============================================================================
// ARQUIVO: frontend/src/views/components/MinhasRifasTab.tsx
// ============================================================================
import { useState } from "react";
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

interface MinhasRifasTabProps {
  minhasRifas: any[];
  usuarioAtual: any;
  onAtualizacao: () => void;
}

export function MinhasRifasTab({
  minhasRifas,
  usuarioAtual,
  onAtualizacao,
}: MinhasRifasTabProps) {
  // Estados da Tela
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtro, setFiltro] = useState<string>("todas"); // <--- NOVO ESTADO DO FILTRO

  // Lógica de Selecionar/Deselecionar Rifas Disponíveis
  const handleToggleSelecao = (numero: string, status: string) => {
    if (status !== "disponivel") return;

    setSelecionadas((prev) =>
      prev.includes(numero)
        ? prev.filter((n) => n !== numero)
        : [...prev, numero],
    );
  };

  const handleVendaSucesso = () => {
    setModalAberto(false);
    setSelecionadas([]);
    onAtualizacao();
  };

  // Aplica o filtro na lista de rifas antes de renderizar
  const rifasFiltradas = minhasRifas.filter(
    (r) => filtro === "todas" || r.status === filtro,
  );

  const valorArrecadado =
    minhasRifas.filter((r) => r.status === "pago").length * 10;
  const valorDaVendaAtual = selecionadas.length * 10;

  // ==========================================================================
  // CONTEÚDO DA LEGENDA (Que vai dentro do Tooltip)
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
            bgcolor: "#1976d2",
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
            bgcolor: "#ed6c02",
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
            bgcolor: "#2e7d32",
          }}
        />{" "}
        Pago
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ position: "relative", pb: selecionadas.length > 0 ? 12 : 2 }}>
      {/* CABEÇALHO FINANCEIRO */}
      <Typography variant="h5" mb={3} fontWeight="bold">
        Olá, {usuarioAtual?.displayName || "Aderido"}!
      </Typography>

      <Paper
        sx={{
          p: 3,
          mb: 4,
          display: "flex",
          gap: 4,
          bgcolor: "primary.main",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Arrecadação Confirmada
          </Typography>
          <Typography variant="h4" fontWeight="bold">
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
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Bloco de Vendas
          <Tooltip
            title={legendaTooltip}
            arrow
            placement="top"
            enterTouchDelay={0}
          >
            <IconButton
              size="small"
              color="info"
              sx={{ bgcolor: "rgba(25, 118, 210, 0.1)" }}
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

      {/* GRID DE RIFAS */}
      {minhasRifas.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(75px, 1fr))"
          gap={1.5}
        >
          {rifasFiltradas.length > 0 ? (
            rifasFiltradas.map((rifa) => {
              const isSelecionada = selecionadas.includes(rifa.numero);

              let cor: "default" | "primary" | "success" | "warning" =
                "default";
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
                    fontSize: "0.9rem",
                    height: "36px",
                    borderRadius: "8px",
                    borderWidth:
                      rifa.status === "disponivel" && !isSelecionada
                        ? "2px"
                        : "0px",
                    cursor:
                      rifa.status === "disponivel" ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
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
      )}

      {/* BARRA FLUTUANTE DE CHECKOUT (Agora usando PORTAL e sumindo quando o modal abre!) */}
      {selecionadas.length > 0 && !modalAberto && (
        <Portal>
          <Paper
            elevation={8}
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
              border: "2px solid",
              borderColor: "primary.main",
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
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                R$ {valorDaVendaAtual},00
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartCheckoutIcon />}
              sx={{ borderRadius: 6 }}
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
        onSuccess={handleVendaSucesso}
        numerosRifas={selecionadas}
      />
    </Box>
  );
}
