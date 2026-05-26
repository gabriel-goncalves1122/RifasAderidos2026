// ============================================================================
// ARQUIVO: frontend/src/features/rifas/hooks/useRifas.ts
// ============================================================================
import { useCallback, useState } from "react";

import { rifaService } from "../services/rifasService";
import { DadosFinalizarVenda } from "../types/rifas";

interface DadosCorrecaoComprador {
  nome: string;
  email: string;
  telefone: string;
}

export function useRifas() {
  const [loading, setLoading] = useState(false);

  const buscarMinhasRifas = useCallback(async () => {
    setLoading(true);

    try {
      return await rifaService.buscarMinhasRifas();
    } catch (erro) {
      console.error("[useRifas] Erro ao buscar minhas rifas:", erro);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const finalizarVenda = useCallback(async (dados: DadosFinalizarVenda) => {
    setLoading(true);

    try {
      console.log("[useRifas] Iniciando finalizarVenda", {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        numerosRifas: dados.numerosRifas,
        comprovante: dados.comprovante
          ? {
              name: dados.comprovante.name,
              type: dados.comprovante.type,
              size: dados.comprovante.size,
            }
          : null,
      });

      await rifaService.finalizarVenda(dados);

      console.log("[useRifas] Venda finalizada com sucesso");
      return true;
    } catch (erro: any) {
      console.error("[useRifas] Erro ao finalizar venda:", {
        code: erro?.code,
        message: erro?.message,
        name: erro?.name,
        serverResponse: erro?.serverResponse,
        stack: erro?.stack,
        erro,
      });

      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const corrigirRifasRecusadas = useCallback(
    async (
      numerosRifas: string[],
      comprovante: File,
      dadosAtualizados: DadosCorrecaoComprador,
    ) => {
      setLoading(true);

      try {
        await rifaService.corrigirRifasRecusadas({
          numerosRifas,
          comprovante,
          nome: dadosAtualizados.nome,
          email: dadosAtualizados.email,
          telefone: dadosAtualizados.telefone,
        });

        return true;
      } catch (erro) {
        console.error("[useRifas] Erro ao reenviar correção:", erro);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const anexarComprovante = useCallback(
    async (rifaId: string, arquivo: File) => {
      setLoading(true);

      try {
        await rifaService.anexarComprovante(rifaId, arquivo);
        return true;
      } catch (erro) {
        console.error("[useRifas] Erro ao anexar comprovante:", erro);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    buscarMinhasRifas,
    finalizarVenda,
    corrigirRifasRecusadas,
    anexarComprovante,
    loading,
  };
}
