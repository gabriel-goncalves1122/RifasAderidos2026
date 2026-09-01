// ============================================================================
// HOOK: useRifasSelection
//
// Gerencia a selecao de rifas para venda no painel do aderido.
// Estado local puro: mantem lista de numeros selecionados,
// calcula valor total e expoe acoes de alternar/limpar.
//
// Persiste seleção no localStorage com TTL para sobreviver a reinícios
// causados pelo SO mobile ao abrir apps externos (ex: banco).
// ============================================================================
import { useCallback, useEffect, useMemo, useState } from "react";

import { VALOR_RIFA } from "../utils/constants";
import { checkoutStorage } from "../utils/checkoutStorage";
import { RifaAderido, DadosPainelAderido } from "../types/painelAderido";

export function useRifasSelection(rifas: RifaAderido[]) {
  const [selecionadas, setSelecionadas] = useState<string[]>(
    () => checkoutStorage.get().selecionadas
  );

  // Persiste sempre que a seleção muda.
  useEffect(() => {
    checkoutStorage.update({ selecionadas });
  }, [selecionadas]);

  // Se dados do painel mudarem, limpa seleções inválidas (que não estão mais disponíveis)
  // Mas preserva as que estão no fluxo de checkout Pix atual do usuário (mesmo que constem como reservadas no backend)
  useEffect(() => {
    if (rifas && rifas.length > 0) {
      setSelecionadas((prev) => {
        const validas = prev.filter((id) => {
          const rifa = rifas.find((r) => r.numero === id);
          if (!rifa) return false;

          const estaDisponivel = rifa.status === "disponivel";
          
          // Mantém na seleção (vinculada ao Pix ativo) apenas se o backend
          // ainda diz que ela está 'reservada'. Se já avançou para 'pendente' ou 'pago',
          // a venda foi efetivada e não deve mais ficar presa no carrinho.
          const cobranca = checkoutStorage.get().cobrancaPix;
          const cobrancaAtiva = cobranca && cobranca.status !== "pago" && cobranca.status !== "cancelado";
          const estaNoPixAtual = cobrancaAtiva && cobranca.numerosRifas?.includes(id) && rifa.status === "reservado";
            
          return estaDisponivel || estaNoPixAtual;
        });
        return validas.length === prev.length ? prev : validas;
      });
    }
  }, [rifas]);

  const alternarSelecaoRifa = useCallback((numero: string, status: string) => {
    setSelecionadas((rifasAtuais) => {
      if (rifasAtuais.includes(numero)) {
        return rifasAtuais.filter((r) => r !== numero);
      }
      
      // Bloqueia adição de qualquer rifa que não esteja disponível
      if (status !== "disponivel") {
        return rifasAtuais;
      }
      
      return [...rifasAtuais, numero];
    });
  }, []);

  const limparSelecao = useCallback(() => {
    setSelecionadas([]);
    // O useEffect atualizará o storage
  }, []);

  const possuiSelecao = selecionadas.length > 0;

  const valorTotalSelecionado = useMemo(
    () => selecionadas.length * VALOR_RIFA,
    [selecionadas.length],
  );

  return {
    selecionadas,
    possuiSelecao,
    valorTotalSelecionado,
    alternarSelecaoRifa,
    limparSelecao,
  };
}
