// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/MinhasRifasTab.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Button,
  Badge,
} from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";

// Sub-componentes
import { CheckoutModal } from "./CheckoutModal";
import { NotificacoesSidebar } from "../comuns/NotificacoesSidebar";
import { CarrinhoFlutuante } from "./CarrinhoFlutuante";
import { EstatisticasAderido } from "./EstatiticasAderidos";
import { AbaRecusadas } from "./AbaRecusadas";
import { ModalCorrecaoRecusa } from "./ModalCorrecaoRecusa";
import { ModalDetalhesRifa } from "./ModalDetalhesRifas";
import { GrelhaRifas } from "./GrelhasRifas"; // <-- NOVO IMPORT

// Controladores
import { useRifas } from "../../../controllers/useRifas";
import { useAuthController } from "../../../controllers/useAuthController";
import { useNotificacoes } from "../../../controllers/useNotificacoes";

type VisaoType = "geral" | "recusadas";

export function MinhasRifasTab() {
  const { buscarMinhasRifas, corrigirRifasRecusadas } = useRifas();
  const { buscarNotificacoes, marcarNotificacoesLidas } = useNotificacoes();
  const { usuarioAtual } = useAuthController();

  const [minhasRifas, setMinhasRifas] = useState<any[]>([]);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [visaoAtual, setVisaoAtual] = useState<VisaoType>("geral");
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [filtro, setFiltro] = useState<string>("todas");

  // Modais
  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);
  const [drawerNotificacoesAberto, setDrawerNotificacoesAberto] =
    useState(false);
  const [modalCorrecaoAberto, setModalCorrecaoAberto] = useState(false);

  // Dados Selecionados
  const [grupoParaCorrigir, setGrupoParaCorrigir] = useState<any>(null);
  const [rifaParaDetalhes, setRifaParaDetalhes] = useState<any>(null);

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

  const handleReenviarComprovante = async (
    numeros: string[],
    novoComprovante: File,
    dadosAtualizados: any,
  ) => {
    const sucesso = await corrigirRifasRecusadas(
      numeros,
      novoComprovante,
      dadosAtualizados,
    );
    if (sucesso) {
      await carregarDadosIniciais();
      setVisaoAtual("geral");
    }
  };

  // Processamento de Dados
  const rifasFiltradas = minhasRifas.filter(
    (r) => filtro === "todas" || r.status === filtro,
  );
  const valorArrecadado =
    minhasRifas.filter((r) => r.status === "pago").length * 10;
  const notificacoesNaoLidas = notificacoes.filter((n) => !n.lida).length;

  const rifasRecusadas = minhasRifas.filter((r) => r.status === "recusado");
  const gruposRecusados = Object.values(
    rifasRecusadas.reduce((acc: any, rifa) => {
      const dataBase = rifa.data_reserva
        ? rifa.data_reserva.split("T")[0]
        : "sem-data";
      const key = `${rifa.comprador_nome}-${dataBase}-${rifa.motivo_recusa}`;
      if (!acc[key]) {
        acc[key] = {
          comprador: rifa.comprador_nome || "Desconhecido",
          email: rifa.comprador_email || "",
          telefone: rifa.comprador_telefone || "",
          data: rifa.data_reserva,
          motivo: rifa.motivo_recusa || "Sem motivo informado",
          bilhetes: [],
        };
      }
      acc[key].bilhetes.push(rifa.numero);
      return acc;
    }, {}),
  ) as any[];

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", pb: selecionadas.length > 0 ? 12 : 2 }}>
      <EstatisticasAderido
        primeiroNome={(usuarioAtual as any)?.nome?.split(" ")[0] || "Aderido"}
        valorArrecadado={valorArrecadado}
        notificacoesNaoLidas={notificacoesNaoLidas}
        onAbrirNotificacoes={abrirSidebarNotificacoes}
      />

      {visaoAtual === "geral" ? (
        <Box>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  title="Disponível (Branco), Selecionada (Verde Claro), Análise (Laranja), Pago (Verde Forte), Negada (Vermelho)."
                  arrow
                  placement="top"
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

              {gruposRecusados.length > 0 && (
                <Badge badgeContent={gruposRecusados.length} color="error">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    startIcon={<ReportGmailerrorredIcon />}
                    onClick={() => setVisaoAtual("recusadas")}
                  >
                    Ver Rifas Negadas
                  </Button>
                </Badge>
              )}
            </Box>

            <FormControl size="small" sx={{ minWidth: 160, bgcolor: "white" }}>
              <Select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                displayEmpty
                sx={{ borderRadius: 2, fontWeight: "bold" }}
              >
                <MenuItem value="todas">Todas as Rifas</MenuItem>
                <MenuItem value="disponivel">Disponíveis</MenuItem>
                <MenuItem value="pendente">Em Análise</MenuItem>
                <MenuItem value="pago">Pagas</MenuItem>
                <MenuItem value="recusado">Negadas</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* O COMPONENTE EXTRAÍDO ENTRA AQUI */}
          <GrelhaRifas
            rifas={rifasFiltradas}
            selecionadas={selecionadas}
            onToggleSelecao={handleToggleSelecao}
            onAbrirDetalhes={setRifaParaDetalhes}
          />
        </Box>
      ) : (
        <AbaRecusadas
          gruposRecusados={gruposRecusados}
          onVoltar={() => setVisaoAtual("geral")}
          onAbrirCorrecao={(grupo) => {
            setGrupoParaCorrigir(grupo);
            setModalCorrecaoAberto(true);
          }}
        />
      )}

      {!modalCheckoutAberto && visaoAtual === "geral" && (
        <CarrinhoFlutuante
          quantidade={selecionadas.length}
          valorTotal={selecionadas.length * 10}
          onVenderClick={() => setModalCheckoutAberto(true)}
        />
      )}

      {/* MODAIS DA PÁGINA */}
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
      <ModalCorrecaoRecusa
        open={modalCorrecaoAberto}
        onClose={() => setModalCorrecaoAberto(false)}
        grupoRecusado={grupoParaCorrigir}
        onReenviar={handleReenviarComprovante}
      />
      <ModalDetalhesRifa
        open={Boolean(rifaParaDetalhes)}
        onClose={() => setRifaParaDetalhes(null)}
        rifa={rifaParaDetalhes}
      />
    </Box>
  );
}
