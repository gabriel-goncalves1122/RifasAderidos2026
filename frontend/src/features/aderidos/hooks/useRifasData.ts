import { useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthController } from "@/features/auth/hooks/useAuthController";
import { useRifas } from "@/features/rifas/hooks/useRifas";
import { useNotificacoes } from "@/shared/hooks/useNotificacoes";

import {
  DadosCorrecaoRecusa,
  NotificacaoAderido,
  RifaAderido,
} from "../types/painelAderido";

const QUERY_STALE_TIME = 60_000;

export function useRifasData() {
  const { buscarMinhasRifas, corrigirDadosRifasRecusadas } = useRifas();
  const { buscarNotificacoes, marcarNotificacoesLidas } = useNotificacoes();
  const { usuarioAtual, loading: authCarregando } = useAuthController();
  const queryClient = useQueryClient();
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

  const invalidarDadosPainel = useCallback(async () => {
    if (!usuarioId) return;

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: rifasQueryKey }),
      queryClient.invalidateQueries({ queryKey: notificacoesQueryKey }),
    ]);
  }, [notificacoesQueryKey, queryClient, rifasQueryKey, usuarioId]);

  const marcarNotificacoesLidasOtimista = useCallback(
    async (ids: string[]) => {
      if (ids.length === 0) return;

      queryClient.setQueryData<NotificacaoAderido[]>(
        notificacoesQueryKey,
        (notificacoesAtuais = notificacoes) =>
          notificacoesAtuais.map((notificacao) => ({
            ...notificacao,
            lida: true,
          })),
      );

      try {
        await marcarNotificacoesLidas(ids);
      } catch {
        await queryClient.invalidateQueries({ queryKey: notificacoesQueryKey });
      }
    },
    [
      marcarNotificacoesLidas,
      notificacoes,
      notificacoesQueryKey,
      queryClient,
    ],
  );

  const corrigirDadosRecusados = useCallback(
    (numeros: string[], dadosAtualizados: DadosCorrecaoRecusa) => {
      return corrigirDadosRifasRecusadas(numeros, dadosAtualizados);
    },
    [corrigirDadosRifasRecusadas],
  );

  const carregando =
    authCarregando ||
    Boolean(
      usuarioId &&
        (rifasQuery.isLoading || notificacoesQuery.isLoading) &&
        minhasRifas.length === 0 &&
        notificacoes.length === 0,
    );

  return {
    usuarioAtual,
    usuarioId,
    carregando,
    minhasRifas,
    notificacoes,
    invalidarDadosPainel,
    marcarNotificacoesLidasOtimista,
    corrigirDadosRecusados,
  };
}
