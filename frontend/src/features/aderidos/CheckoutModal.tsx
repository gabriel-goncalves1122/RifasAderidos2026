// ============================================================================
// COMPONENTE: CheckoutModal
//
// Modal de checkout para venda de rifas via Pix.
//
// Fluxo:
//   1. Usuario preenche dados do comprador (nome, WhatsApp, email)
//   2. Gera cobranca Pix chamando o backend do sistema
//   3. Exibe QR Code e codigo copia-e-cola para pagamento
//   4. Polling automatico do status (a cada 10s) ate pagamento confirmado
//
// O Dialog usa keepMounted, entao o estado do formulario persiste
// entre aberturas sem precisar de armazenamento externo.
// ============================================================================
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  Snackbar,
  Stack,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

import {
  CheckoutFormData,
  checkoutSchema,
} from "./components/checkout/checkoutSchema";
import { CheckoutDadosCompradorForm } from "./components/checkout/CheckoutDadosCompradorForm";
import { CheckoutModalHeader } from "./components/checkout/CheckoutModalHeader";
import { CheckoutPixBox } from "./components/checkout/CheckoutPixBox";
import { CheckoutProgressCard } from "./components/checkout/CheckoutProgressCard";
import { CheckoutResumoVenda } from "./components/checkout/CheckoutResumoVenda";
import { CheckoutSubmitButton } from "./components/checkout/CheckoutSubmitButton";
import { useCheckoutPixFlow } from "./hooks/useCheckoutPixFlow";
import { painelAderidoStyles } from "./styles/painelAderidoStyles";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numerosRifas: string[];
}

export function CheckoutModal({
  open,
  onClose,
  onSuccess,
  numerosRifas,
}: CheckoutModalProps) {
  const numerosRifasKey = numerosRifas.join("|");
  const {
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
  } = useCheckoutPixFlow({ numerosRifas, onSuccess });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema) as any,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
    },
  });

  const nome = watch("nome");
  const telefone = watch("telefone");
  const email = watch("email");
  const dadosCompradorKey = `${nome}|${telefone}|${email}`;
  const dadosCompradorKeyRef = useRef(dadosCompradorKey);

  useEffect(() => {
    if (!open) return;

    resetarFluxoPix();
  }, [open, numerosRifasKey, resetarFluxoPix]);

  useEffect(() => {
    if (!cobrancaPix) {
      dadosCompradorKeyRef.current = dadosCompradorKey;
      return;
    }

    if (dadosCompradorKeyRef.current === dadosCompradorKey) return;

    dadosCompradorKeyRef.current = dadosCompradorKey;

    resetarFluxoPix();
  }, [cobrancaPix, dadosCompradorKey, resetarFluxoPix]);

  const fecharModal = () => {
    if (gerandoPix) return;

    limparPolling();
    onClose();
  };

  const etapaAtual = cobrancaPix ? 2 : 1;
  const progressoCheckout = cobrancaPix ? 100 : 50;
  const etapaTitulo =
    pollingStatus === "confirmado"
      ? "Pagamento confirmado!"
      : cobrancaPix
        ? "Pagamento gerado"
        : "Preencher dados";
  const etapaDescricao =
    pollingStatus === "confirmado"
      ? "O pagamento foi confirmado com sucesso."
      : pollingStatus === "expirado"
        ? "O tempo de espera expirou. Verifique o status no painel."
        : pollingStatus === "polling"
          ? "Aguardando confirmação do pagamento..."
          : cobrancaPix
            ? "Use o QR Code ou copie o Pix para concluir no banco."
            : "Informe nome e telefone para gerar o pagamento.";

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        disableEscapeKeyDown={gerandoPix}
        onClose={(_, reason) => {
          if (reason === "backdropClick") return;

          limparPolling();
          onClose();
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: painelAderidoStyles.detalheDialogPaper,
        }}
      >
        <CheckoutModalHeader gerandoPix={gerandoPix} onClose={fecharModal} />

        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(gerarCobrancaPix)}>
            <Stack spacing={2.25}>
              <CheckoutProgressCard
                etapaAtual={etapaAtual}
                progressoCheckout={progressoCheckout}
                etapaTitulo={etapaTitulo}
                etapaDescricao={etapaDescricao}
                pagamentoGerado={Boolean(cobrancaPix)}
              />

              <CheckoutResumoVenda numerosRifas={numerosRifas} />

              <CheckoutDadosCompradorForm
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <CheckoutPixBox
                cobranca={cobrancaPix}
                gerando={gerandoPix}
                erro={erroPix}
                pollingStatus={pollingStatus}
                onCopiarPix={copiarPix}
                onAbrirAppBanco={cobrancaPix ? abrirAppBanco : undefined}
              />

              <CheckoutSubmitButton
                gerandoPix={gerandoPix}
                pagamentoGerado={Boolean(cobrancaPix)}
              />
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2200}
        onClose={fecharSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{
            borderRadius: 2,
            fontWeight: 800,
          }}
        >
          Pix copia-e-cola copiado.
        </Alert>
      </Snackbar>
    </>
  );
}
