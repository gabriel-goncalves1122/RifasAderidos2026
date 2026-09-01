import { useEffect, useMemo, useState } from "react";

import { AbaPix } from "../types/pixTabs";
import { usePixTransacoes } from "./usePixTransacoes";

interface UseTesourariaPixControllerParams {
  variante?: "desktop" | "mobile";
}

export function usePixController({
  variante = "desktop",
}: UseTesourariaPixControllerParams = {}) {
  const [abaAtual, setAbaAtual] = useState<AbaPix>("visao-geral");

  const {
    resumo,
    filtros,
    transacoes,
    transacoesFiltradas,
    carregando,
    sincronizando,
    validandoPixPorId,
    erroValidacaoPixPorId,
    setFiltros,
    sincronizarBanco,
    aceitarTransacao,
    negarTransacao,
  } = usePixTransacoes();


  const abaVisivel = abaAtual;

  const pixProps = useMemo(
    () => ({
      resumo,
      filtros,
      transacoes: transacoesFiltradas,
      onChangeFiltros: setFiltros,
      validandoPixPorId,
      erroValidacaoPixPorId,
      onAceitar: aceitarTransacao,
      onNegar: negarTransacao,
    }),
    [
      aceitarTransacao,
      erroValidacaoPixPorId,
      filtros,
      negarTransacao,
      resumo,
      setFiltros,
      transacoesFiltradas,
      validandoPixPorId,
    ],
  );

  return {
    abaAtual,
    abaVisivel,
    resumo,
    filtros,
    transacoes,
    transacoesFiltradas,
    carregando,
    sincronizando,
    validandoPixPorId,
    erroValidacaoPixPorId,
    pixProps,
    setAbaAtual,
    setFiltros,
    sincronizarBanco,
    onSincronizar: sincronizarBanco,
    onAceitarTransacao: aceitarTransacao,
    onNegarTransacao: negarTransacao,
  };
}
