import { useCallback, useState } from "react";
import { auditoriaComprasService } from "../services/auditoriaComprasService";
import { TransacaoTesouraria } from "../types/auditoriaCompras";
import { sanitizarDadosCliente } from "@/shared/utils/sanitizadores";
import { normalizarTexto } from "../utils/auditoriaComprasUtils";

interface DadosEdicaoComprador {
  nome: string;
  email?: string | null;
  telefone?: string | null;
}

export function useAuditoriaComprasAcoes(
  carregarHistorico: () => Promise<void>
) {
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [erroEdicao, setErroEdicao] = useState<string | null>(null);

  const [reenviandoEmailComprovanteId, setReenviandoEmailComprovanteId] =
    useState<string | null>(null);
  const [feedbackEmailComprovante, setFeedbackEmailComprovante] = useState<{
    tipo: "success" | "error";
    mensagem: string;
  } | null>(null);

  const salvarEdicaoComprador = useCallback(
    async (compraEdicao: TransacaoTesouraria | null, dados: DadosEdicaoComprador) => {
      if (!compraEdicao?.compradorId) {
        setErroEdicao("Compra sem compradorId não pode ser editada.");
        return false;
      }

      setSalvandoEdicao(true);
      setErroEdicao(null);

      try {
        const dadosSanitizados = sanitizarDadosCliente({
          nome: dados.nome,
          email: dados.email || "",
          telefone: dados.telefone || "",
        });

        await auditoriaComprasService.atualizarComprador(
          compraEdicao.compradorId,
          dadosSanitizados
        );
        await carregarHistorico();

        return true;
      } catch (error: any) {
        setErroEdicao(
          error?.message || "Erro ao salvar dados do comprador."
        );
        return false;
      } finally {
        setSalvandoEdicao(false);
      }
    },
    [carregarHistorico]
  );

  const reenviarEmailComprovante = useCallback(async (compra: TransacaoTesouraria) => {
    if (!compra.compradorId) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "Compra sem compradorId não permite reenvio.",
      });
      return false;
    }

    if (normalizarTexto(compra.status) !== "pago") {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "O reenvio está disponível apenas para compras pagas.",
      });
      return false;
    }

    if (!compra.compradorEmail.trim()) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem: "A compra não possui e-mail do comprador.",
      });
      return false;
    }

    setReenviandoEmailComprovanteId(compra.compradorId);
    setFeedbackEmailComprovante(null);

    try {
      const resposta = await auditoriaComprasService.reenviarEmailComprovante(
        compra.compradorId
      );

      setFeedbackEmailComprovante({
        tipo: "success",
        mensagem: resposta?.mensagem || "E-mail de comprovante reenviado.",
      });

      return true;
    } catch (error: any) {
      setFeedbackEmailComprovante({
        tipo: "error",
        mensagem:
          error?.message || "Erro ao reenviar e-mail de comprovante.",
      });

      return false;
    } finally {
      setReenviandoEmailComprovanteId(null);
    }
  }, []);

  return {
    salvandoEdicao,
    erroEdicao,
    setErroEdicao,
    reenviandoEmailComprovanteId,
    feedbackEmailComprovante,
    setFeedbackEmailComprovante,
    salvarEdicaoComprador,
    reenviarEmailComprovante,
  };
}
