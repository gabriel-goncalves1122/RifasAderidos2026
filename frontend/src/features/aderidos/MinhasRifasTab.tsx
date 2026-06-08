// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/MinhasRifasTab.tsx
// ============================================================================
import { Box } from "@mui/material";

import { NotificacoesSidebar } from "@/shared/components/NotificacoesSidebar";

import { AbaRecusadas } from "./AbaRecusadas";
import { CarrinhoFlutuante } from "./CarrinhoFlutuante";
import { CheckoutModal } from "./CheckoutModal";
import { EstatisticasAderido } from "./EstatisticasAderido";
import { ModalCorrecaoRecusa } from "./ModalCorrecaoRecusa";
import { ModalDetalhesRifa } from "./ModalDetalhesRifa";

import { BlocoVendasHeader } from "./components/BlocoVendasHeader";
import { FiltrosRifas } from "./components/FiltrosRifas";
import { GrelhaRifas } from "./components/GrelhaRifas";
import { LoadingRifasState } from "./components/LoadingRifasState";

import { usePainelAderido } from "./hooks/usePainelAderido";
import { painelAderidoStyles } from "./styles/painelAderidoStyles";

export function MinhasRifasTab() {
  const painel = usePainelAderido();
  const possuiSelecao = painel.selecionadas.length > 0;

  if (painel.carregando) {
    return <LoadingRifasState />;
  }

  return (
    <Box sx={painelAderidoStyles.page}>
      <Box
        sx={{
          ...painelAderidoStyles.root,
          pb: possuiSelecao ? { xs: 17, sm: 15 } : 3,
        }}
      >
        <EstatisticasAderido
          primeiroNome={painel.primeiroNome}
          valorArrecadado={painel.valorArrecadado}
          notificacoesNaoLidas={painel.notificacoesNaoLidas}
          totalPendencias={painel.gruposRecusados.length}
          onAbrirNotificacoes={painel.abrirSidebarNotificacoes}
          onAbrirRecusadas={() => painel.setVisaoAtual("recusadas")}
        />

        {painel.visaoAtual === "geral" ? (
          <Box sx={painelAderidoStyles.blocoVendasArea}>
            <BlocoVendasHeader />

            <FiltrosRifas
              filtro={painel.filtro}
              onChangeFiltro={painel.setFiltro}
            />

            <GrelhaRifas
              rifas={painel.rifasFiltradas}
              selecionadas={painel.selecionadas}
              onToggleSelecao={painel.alternarSelecaoRifa}
              onAbrirDetalhes={painel.setRifaParaDetalhes}
            />
          </Box>
        ) : (
          <AbaRecusadas
            gruposRecusados={painel.gruposRecusados}
            onVoltar={() => painel.setVisaoAtual("geral")}
            onAbrirCorrecao={(grupo) => {
              painel.setGrupoParaCorrigir(grupo);
              painel.setModalCorrecaoAberto(true);
            }}
          />
        )}

        {possuiSelecao && painel.visaoAtual === "geral" && (
          <CarrinhoFlutuante
            quantidade={painel.selecionadas.length}
            valorTotal={painel.selecionadas.length * 10}
            onVenderClick={() => painel.setModalCheckoutAberto(true)}
          />
        )}

        <CheckoutModal
          open={painel.modalCheckoutAberto}
          onClose={() => painel.setModalCheckoutAberto(false)}
          onSuccess={painel.finalizarVendaComSucesso}
          numerosRifas={painel.selecionadas}
        />

        <NotificacoesSidebar
          open={painel.drawerNotificacoesAberto}
          onClose={() => painel.setDrawerNotificacoesAberto(false)}
          notificacoes={painel.notificacoes}
        />

        <ModalCorrecaoRecusa
          open={painel.modalCorrecaoAberto}
          onClose={() => painel.setModalCorrecaoAberto(false)}
          grupoRecusado={painel.grupoParaCorrigir}
          onCorrigirDados={painel.corrigirDadosRecusados}
        />

        <ModalDetalhesRifa
          open={Boolean(painel.rifaParaDetalhes)}
          onClose={() => painel.setRifaParaDetalhes(null)}
          rifa={painel.rifaParaDetalhes}
        />
      </Box>
    </Box>
  );
}
