// ============================================================================
// HOOK: usePainelAderido
//
// Hook principal da feature Aderidos. Orquestra:
//
// 1. Dados remotos (rifas, notificacoes) via useRifasData
// 2. Selecao de rifas para venda via useRifasSelection
// 3. Controle de modais e drawers via useModalStack
// 4. Fluxo pos-checkout via useCheckoutFlow
//
// Componentes de UI consomem este hook e nao acessam dados diretamente.
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DadosCorrecaoRecusa,
  FiltroRifasAderido,
  VisaoPainelAderido,
} from "../types/painelAderido";

import { agruparRifasRecusadas } from "../utils/agruparRifasRecusadas";
import {
  calcularValorArrecadado,
  contarNotificacoesNaoLidas,
  filtrarRifasPorStatus,
} from "../utils/calcularResumoRifas";
import { obterPrimeiroNomeAderido } from "../utils/obterPrimeiroNomeAderido";
import { useCheckoutFlow } from "./useCheckoutFlow";
import { useModalStack } from "./useModalStack";
import { useRifasData } from "./useRifasData";
import { useRifasSelection } from "./useRifasSelection";

export function usePainelAderido() {
  const [visaoAtual, setVisaoAtual] = useState<VisaoPainelAderido>("geral");
  const [filtro, setFiltro] = useState<FiltroRifasAderido>("todas");
  const dadosPainel = useRifasData();
  const selecao = useRifasSelection();
  const modais = useModalStack();
  const fecharCheckout = useCallback(() => {
    modais.setModalCheckoutAberto(false);
  }, [modais.setModalCheckoutAberto]);

  const { finalizarVendaComSucesso } = useCheckoutFlow({
    fecharCheckout,
    limparSelecao: selecao.limparSelecao,
    invalidarDadosPainel: dadosPainel.invalidarDadosPainel,
  });

  // Se o usuario deslogar, limpa estado local para evitar dados residuais
  useEffect(() => {
    if (!dadosPainel.usuarioId) {
      selecao.limparSelecao();
      setVisaoAtual("geral");
      modais.reset();
    }
  }, [dadosPainel.usuarioId, modais.reset, selecao.limparSelecao]);

  // ------------------------------------------------------------------
  // Computacoes derivadas dos dados brutos
  // ------------------------------------------------------------------

  const rifasFiltradas = useMemo(
    () => filtrarRifasPorStatus(dadosPainel.minhasRifas, filtro),
    [dadosPainel.minhasRifas, filtro],
  );

  const gruposRecusados = useMemo(
    () => agruparRifasRecusadas(dadosPainel.minhasRifas),
    [dadosPainel.minhasRifas],
  );

  const valorArrecadado = useMemo(
    () => calcularValorArrecadado(dadosPainel.minhasRifas),
    [dadosPainel.minhasRifas],
  );

  const notificacoesNaoLidas = useMemo(
    () => contarNotificacoesNaoLidas(dadosPainel.notificacoes),
    [dadosPainel.notificacoes],
  );

  // ------------------------------------------------------------------
  // Nome de exibicao do aderido
  //
  // Prioridade: nome > displayName > parte local do email.
  // Usa apenas dados do usuario logado (nunca vendedor_email de terceiros).
  // ------------------------------------------------------------------
  const primeiroNome = useMemo(() => {
    const usuarioComNome = dadosPainel.usuarioAtual as
      | {
          nome?: string | null;
          displayName?: string | null;
          email?: string | null;
        }
      | null
      | undefined;

    return obterPrimeiroNomeAderido({
      nome: usuarioComNome?.nome || usuarioComNome?.displayName,
      displayName: usuarioComNome?.displayName,
      email: usuarioComNome?.email,
    });
  }, [dadosPainel.usuarioAtual]);

  const abrirSidebarNotificacoes = useCallback(async () => {
    modais.setDrawerNotificacoesAberto(true);

    const naoLidas = dadosPainel.notificacoes
      .filter((notificacao) => !notificacao.lida)
      .map((notificacao) => notificacao.id);

    await dadosPainel.marcarNotificacoesLidasOtimista(naoLidas);
  }, [
    dadosPainel.marcarNotificacoesLidasOtimista,
    dadosPainel.notificacoes,
    modais.setDrawerNotificacoesAberto,
  ]);

  const corrigirDadosRecusados = useCallback(
    async (numeros: string[], dadosAtualizados: DadosCorrecaoRecusa) => {
      const sucesso = await dadosPainel.corrigirDadosRecusados(
        numeros,
        dadosAtualizados,
      );

      if (!sucesso) return false;

      await dadosPainel.invalidarDadosPainel();

      setVisaoAtual("geral");
      modais.setModalCorrecaoAberto(false);
      modais.setGrupoParaCorrigir(null);

      return true;
    },
    [
      dadosPainel.corrigirDadosRecusados,
      dadosPainel.invalidarDadosPainel,
      modais.setGrupoParaCorrigir,
      modais.setModalCorrecaoAberto,
    ],
  );

  return {
    carregando: dadosPainel.carregando,
    visaoAtual,
    filtro,
    selecionadas: selecao.selecionadas,
    possuiSelecao: selecao.possuiSelecao,
    valorTotalSelecionado: selecao.valorTotalSelecionado,

    minhasRifas: dadosPainel.minhasRifas,
    rifasFiltradas,
    gruposRecusados,
    notificacoes: dadosPainel.notificacoes,

    primeiroNome,
    valorArrecadado,
    notificacoesNaoLidas,

    modalCheckoutAberto: modais.modalCheckoutAberto,
    drawerNotificacoesAberto: modais.drawerNotificacoesAberto,
    modalCorrecaoAberto: modais.modalCorrecaoAberto,
    grupoParaCorrigir: modais.grupoParaCorrigir,
    rifaParaDetalhes: modais.rifaParaDetalhes,

    setFiltro,
    setVisaoAtual,
    setModalCheckoutAberto: modais.setModalCheckoutAberto,
    setDrawerNotificacoesAberto: modais.setDrawerNotificacoesAberto,
    setModalCorrecaoAberto: modais.setModalCorrecaoAberto,
    setGrupoParaCorrigir: modais.setGrupoParaCorrigir,
    setRifaParaDetalhes: modais.setRifaParaDetalhes,

    abrirSidebarNotificacoes,
    alternarSelecaoRifa: selecao.alternarSelecaoRifa,
    finalizarVendaComSucesso,
    corrigirDadosRecusados,
  };
}
