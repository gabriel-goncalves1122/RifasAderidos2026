// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/hooks/usePainelAderido.ts
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useNotificacoes } from "@/shared/hooks/useNotificacoes";
import { useAuthController } from "@/features/auth/hooks/useAuthController";
import { useRifas } from "@/features/rifas/hooks/useRifas";

import {
  DadosCorrecaoRecusa,
  FiltroRifasAderido,
  GrupoRifasRecusadas,
  NotificacaoAderido,
  RifaAderido,
  VisaoPainelAderido,
} from "../types/painelAderido";

import { agruparRifasRecusadas } from "../utils/agruparRifasRecusadas";
import {
  calcularValorArrecadado,
  contarNotificacoesNaoLidas,
  filtrarRifasPorStatus,
} from "../utils/calcularResumoRifas";
import { obterPrimeiroNomeAderido } from "../utils/obterPrimeiroNomeAderido";

const QUERY_STALE_TIME = 60_000;

export function usePainelAderido() {
  const { buscarMinhasRifas, corrigirDadosRifasRecusadas } = useRifas();
  const { buscarNotificacoes, marcarNotificacoesLidas } = useNotificacoes();
  const { usuarioAtual, loading: authCarregando } = useAuthController();
  const queryClient = useQueryClient();

  const [visaoAtual, setVisaoAtual] = useState<VisaoPainelAderido>("geral");
  const [filtro, setFiltro] = useState<FiltroRifasAderido>("todas");
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);
  const [drawerNotificacoesAberto, setDrawerNotificacoesAberto] =
    useState(false);
  const [modalCorrecaoAberto, setModalCorrecaoAberto] = useState(false);

  const [grupoParaCorrigir, setGrupoParaCorrigir] =
    useState<GrupoRifasRecusadas | null>(null);
  const [rifaParaDetalhes, setRifaParaDetalhes] = useState<RifaAderido | null>(
    null,
  );

  const usuarioId = usuarioAtual?.uid;
  const consultasAtivas = !authCarregando && Boolean(usuarioId);

  const rifasQueryKey = useMemo(
    () => ["aderidos", "minhas-rifas", usuarioId] as const,
    [usuarioId],
  );

  const notificacoesQueryKey = useMemo(
    () => ["aderidos", "notificacoes", usuarioId] as const,
    [usuarioId],
  );

  const rifasQuery = useQuery({
    queryKey: rifasQueryKey,
    queryFn: async () => (await buscarMinhasRifas()) as RifaAderido[],
    enabled: consultasAtivas,
    staleTime: QUERY_STALE_TIME,
    placeholderData: (dadosAnteriores) => dadosAnteriores ?? [],
  });

  const notificacoesQuery = useQuery({
    queryKey: notificacoesQueryKey,
    queryFn: async () => (await buscarNotificacoes()) as NotificacaoAderido[],
    enabled: consultasAtivas,
    staleTime: QUERY_STALE_TIME,
    placeholderData: (dadosAnteriores) => dadosAnteriores ?? [],
  });

  const minhasRifas = useMemo(
    () => (usuarioId ? rifasQuery.data || [] : []),
    [rifasQuery.data, usuarioId],
  );

  const notificacoes = useMemo(
    () => (usuarioId ? notificacoesQuery.data || [] : []),
    [notificacoesQuery.data, usuarioId],
  );

  useEffect(() => {
    if (!usuarioId) {
      setSelecionadas([]);
      setVisaoAtual("geral");
      setModalCheckoutAberto(false);
      setDrawerNotificacoesAberto(false);
      setModalCorrecaoAberto(false);
      setGrupoParaCorrigir(null);
      setRifaParaDetalhes(null);
    }
  }, [usuarioId]);

  const invalidarDadosPainel = useCallback(async () => {
    if (!usuarioId) return;

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: rifasQueryKey }),
      queryClient.invalidateQueries({ queryKey: notificacoesQueryKey }),
    ]);
  }, [notificacoesQueryKey, queryClient, rifasQueryKey, usuarioId]);

  const carregando =
    authCarregando ||
    Boolean(
      usuarioId &&
        (rifasQuery.isLoading || notificacoesQuery.isLoading) &&
        minhasRifas.length === 0 &&
        notificacoes.length === 0,
    );

  const rifasFiltradas = useMemo(
    () => filtrarRifasPorStatus(minhasRifas, filtro),
    [minhasRifas, filtro],
  );

  const gruposRecusados = useMemo(
    () => agruparRifasRecusadas(minhasRifas),
    [minhasRifas],
  );

  const valorArrecadado = useMemo(
    () => calcularValorArrecadado(minhasRifas),
    [minhasRifas],
  );

  const notificacoesNaoLidas = useMemo(
    () => contarNotificacoesNaoLidas(notificacoes),
    [notificacoes],
  );

  const primeiroNome = useMemo(() => {
    const usuarioComNome = usuarioAtual as
      | {
          nome?: string | null;
          displayName?: string | null;
          email?: string | null;
        }
      | null
      | undefined;

    const primeiraRifaComVendedor = minhasRifas.find((rifa) =>
      Boolean(rifa.vendedor_nome?.trim()),
    );

    return obterPrimeiroNomeAderido({
      nome: usuarioComNome?.nome || primeiraRifaComVendedor?.vendedor_nome,
      displayName: usuarioComNome?.displayName,
      email: usuarioComNome?.email || primeiraRifaComVendedor?.vendedor_email,
    });
  }, [usuarioAtual, minhasRifas]);

  const abrirSidebarNotificacoes = useCallback(async () => {
    setDrawerNotificacoesAberto(true);

    const naoLidas = notificacoes
      .filter((notificacao) => !notificacao.lida)
      .map((notificacao) => notificacao.id);

    if (naoLidas.length === 0) return;

    queryClient.setQueryData<NotificacaoAderido[]>(
      notificacoesQueryKey,
      (notificacoesAtuais = notificacoes) =>
        notificacoesAtuais.map((notificacao) => ({
          ...notificacao,
          lida: true,
        })),
    );

    try {
      await marcarNotificacoesLidas(naoLidas);
    } catch {
      await queryClient.invalidateQueries({ queryKey: notificacoesQueryKey });
    }
  }, [
    marcarNotificacoesLidas,
    notificacoes,
    notificacoesQueryKey,
    queryClient,
  ]);

  const alternarSelecaoRifa = useCallback((numero: string, status: string) => {
    if (status !== "disponivel") return;

    setSelecionadas((rifasAtuais) =>
      rifasAtuais.includes(numero)
        ? rifasAtuais.filter((rifa) => rifa !== numero)
        : [...rifasAtuais, numero],
    );
  }, []);

  const finalizarVendaComSucesso = useCallback(async () => {
    setModalCheckoutAberto(false);
    setSelecionadas([]);

    await invalidarDadosPainel();
  }, [invalidarDadosPainel]);

  const corrigirDadosRecusados = useCallback(
    async (numeros: string[], dadosAtualizados: DadosCorrecaoRecusa) => {
      const sucesso = await corrigirDadosRifasRecusadas(
        numeros,
        dadosAtualizados,
      );

      if (!sucesso) return false;

      await invalidarDadosPainel();

      setVisaoAtual("geral");
      setModalCorrecaoAberto(false);
      setGrupoParaCorrigir(null);

      return true;
    },
    [corrigirDadosRifasRecusadas, invalidarDadosPainel],
  );

  const setGrupoParaCorrigirSeguro = useCallback(
    (grupo: GrupoRifasRecusadas | null) => {
      setGrupoParaCorrigir(grupo);
    },
    [],
  );

  const setRifaParaDetalhesSeguro = useCallback((rifa: RifaAderido | null) => {
    setRifaParaDetalhes(rifa);
  }, []);

  return {
    carregando,
    visaoAtual,
    filtro,
    selecionadas,

    minhasRifas,
    rifasFiltradas,
    gruposRecusados,
    notificacoes,

    primeiroNome,
    valorArrecadado,
    notificacoesNaoLidas,

    modalCheckoutAberto,
    drawerNotificacoesAberto,
    modalCorrecaoAberto,
    grupoParaCorrigir,
    rifaParaDetalhes,

    setFiltro,
    setVisaoAtual,
    setModalCheckoutAberto,
    setDrawerNotificacoesAberto,
    setModalCorrecaoAberto,
    setGrupoParaCorrigir: setGrupoParaCorrigirSeguro,
    setRifaParaDetalhes: setRifaParaDetalhesSeguro,

    abrirSidebarNotificacoes,
    alternarSelecaoRifa,
    finalizarVendaComSucesso,
    corrigirDadosRecusados,
  };
}
