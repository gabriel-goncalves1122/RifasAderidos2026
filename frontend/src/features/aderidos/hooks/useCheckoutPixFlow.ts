import { useCallback, useEffect, useRef, useState } from "react";

import { checkoutPixService } from "../services/checkoutPixService";
import { CheckoutPixCobranca } from "../types/checkoutPix";
import { obterMensagemErroPix } from "../utils/errorsPix";

const POLLING_INTERVAL_MS = 10_000;
const POLLING_MAX_RETRIES = 36;

export type CheckoutPollingStatus =
  | "idle"
  | "polling"
  | "confirmado"
  | "expirado"
  | "cancelado";

interface DadosGerarCobrancaPix {
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
}

interface UseCheckoutPixFlowParams {
  numerosRifas: string[];
  onSuccess: () => void;
}

export function useCheckoutPixFlow({
  numerosRifas,
  onSuccess,
}: UseCheckoutPixFlowParams) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cobrancaPix, setCobrancaPix] =
    useState<CheckoutPixCobranca | null>(null);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [erroPix, setErroPix] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] =
    useState<CheckoutPollingStatus>("idle");

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);

  const limparPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }

    retryCountRef.current = 0;
  }, []);

  const resetarFluxoPix = useCallback(() => {
    setCobrancaPix(null);
    setErroPix(null);
    setPollingStatus("idle");
    limparPolling();
  }, [limparPolling]);

  useEffect(() => {
    if (!cobrancaPix || cobrancaPix.status !== "aguardando_pagamento") return;

    setPollingStatus("polling");
    retryCountRef.current = 0;

    pollingRef.current = setInterval(async () => {
      try {
        retryCountRef.current += 1;

        if (retryCountRef.current > POLLING_MAX_RETRIES) {
          limparPolling();
          setPollingStatus("expirado");
          return;
        }

        const atualizada = await checkoutPixService.consultarCobrancaPix(
          cobrancaPix.id,
        );

        if (atualizada.status === "pago") {
          limparPolling();
          setPollingStatus("confirmado");
          onSuccess();
        }

        if (atualizada.status === "expirado") {
          limparPolling();
          setPollingStatus("expirado");
        }

        if (atualizada.status === "cancelado") {
          limparPolling();
          setPollingStatus("cancelado");
        }
      } catch {
        // Mantem o polling resiliente a falhas transitórias da consulta.
      }
    }, POLLING_INTERVAL_MS);

    return limparPolling;
  }, [cobrancaPix, limparPolling, onSuccess]);

  const gerarCobrancaPix = useCallback(
    async (dados: DadosGerarCobrancaPix) => {
      setGerandoPix(true);
      setErroPix(null);
      setCobrancaPix(null);

      try {
        const cobranca = await checkoutPixService.criarCobrancaPix({
          nome: dados.nome.trim(),
          telefone: dados.telefone,
          email: dados.email?.trim() || "",
          documento: dados.documento?.trim() || "",
          numerosRifas,
        });

        setCobrancaPix(cobranca);
      } catch (error) {
        setErroPix(obterMensagemErroPix(error));
      } finally {
        setGerandoPix(false);
      }
    },
    [numerosRifas],
  );

  const copiarPix = useCallback(async () => {
    if (!cobrancaPix?.copiaECola) return;

    await navigator.clipboard.writeText(cobrancaPix.copiaECola);
    setSnackbarOpen(true);
  }, [cobrancaPix?.copiaECola]);

  const abrirAppBanco = useCallback(async () => {
    await copiarPix();
    window.open("pix://", "_blank", "noopener,noreferrer");
  }, [copiarPix]);

  const fecharSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  return {
    cobrancaPix,
    gerandoPix,
    erroPix,
    pollingStatus,
    snackbarOpen,
    gerarCobrancaPix,
    copiarPix,
    abrirAppBanco,
    fecharSnackbar,
    limparPolling,
    resetarFluxoPix,
  };
}
