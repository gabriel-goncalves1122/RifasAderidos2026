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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  CheckoutFormData,
  checkoutSchema,
} from "./components/checkout/checkoutSchema";
import { CheckoutDadosCompradorForm } from "./components/checkout/CheckoutDadosCompradorForm";
import { CheckoutPixBox } from "./components/checkout/CheckoutPixBox";
import { CheckoutResumoVenda } from "./components/checkout/CheckoutResumoVenda";
import { checkoutPixService } from "./services/checkoutPixService";
import { painelAderidoStyles } from "./styles/painelAderidoStyles";
import { aderidosColors, aderidosMotion, reduceMotionSx } from "./tokens";
import { CheckoutPixCobranca } from "./types/checkoutPix";
import { obterMensagemErroPix } from "./utils/errorsPix";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numerosRifas: string[];
}

const POLLING_INTERVAL_MS = 10_000;
const POLLING_MAX_RETRIES = 36;

export function CheckoutModal({
  open,
  onClose,
  onSuccess,
  numerosRifas,
}: CheckoutModalProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [cobrancaPix, setCobrancaPix] =
    useState<CheckoutPixCobranca | null>(null);
  const [gerandoPix, setGerandoPix] = useState(false);
  const [erroPix, setErroPix] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<
    "idle" | "polling" | "confirmado" | "expirado"
  >("idle");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryCountRef = useRef(0);

  const numerosRifasKey = numerosRifas.join("|");

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

  const limparPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    retryCountRef.current = 0;
  }, []);

  useEffect(() => {
    if (!open) return;

    setCobrancaPix(null);
    setErroPix(null);
    setPollingStatus("idle");
    limparPolling();
  }, [open, numerosRifasKey, limparPolling]);

  useEffect(() => {
    if (!cobrancaPix) return;

    setCobrancaPix(null);
    setErroPix(null);
    setPollingStatus("idle");
    limparPolling();
  }, [nome, telefone, email]);

  // Polling de status do pagamento
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
      } catch {
        // erro silencioso no polling — tenta de novo no proximo ciclo
      }
    }, POLLING_INTERVAL_MS);

    return () => {
      limparPolling();
    };
  }, [cobrancaPix?.id, cobrancaPix?.status, limparPolling, onSuccess]);

  const copiarPix = async () => {
    if (!cobrancaPix?.copiaECola) return;

    await navigator.clipboard.writeText(cobrancaPix.copiaECola);
    setSnackbarOpen(true);
  };

  const abrirAppBanco = async () => {
    await copiarPix();

    window.open("pix://", "_blank", "noopener,noreferrer");
  };

  const fecharModal = () => {
    if (gerandoPix) return;

    limparPolling();
    onClose();
  };

  const gerarCobrancaPix = async (dados: CheckoutFormData) => {
    setGerandoPix(true);
    setErroPix(null);
    setCobrancaPix(null);

    try {
      const cobranca = await checkoutPixService.criarCobrancaPix({
        nome: dados.nome.trim(),
        telefone: dados.telefone,
        email: dados.email?.trim() || "",
        numerosRifas,
      });

      setCobrancaPix(cobranca);
    } catch (error) {
      setErroPix(obterMensagemErroPix(error));
    } finally {
      setGerandoPix(false);
    }
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
  const botaoTexto = cobrancaPix ? "Pagamento gerado" : "Gerar pagamento";

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
        <Box
          sx={{
            px: 2.25,
            py: 2,
            borderBottom: "1px solid rgba(2, 27, 22, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              component="h2"
              sx={{
                fontWeight: 950,
                color: aderidosColors.greenBlack,
                fontSize: "1.22rem",
                lineHeight: 1.15,
              }}
            >
              Finalizar venda
            </Typography>

            <Typography
              sx={{
                color: aderidosColors.textMuted,
                fontSize: "0.86rem",
                mt: 0.35,
              }}
            >
              Preencha os dados para gerar o pagamento via Pix.
            </Typography>
          </Box>

          <IconButton
            onClick={fecharModal}
            disabled={gerandoPix}
            aria-label="Fechar modal de venda"
            sx={{
              bgcolor: "#F1F4F3",
              "&:focus-visible": {
                outline: "4px solid rgba(6, 61, 49, 0.24)",
                outlineOffset: "2px",
              },
              "&:hover": {
                bgcolor: "#E8EEEC",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(gerarCobrancaPix)}>
            <Stack spacing={2.25}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "#FFFFFF",
                  border: "1px solid rgba(2, 27, 22, 0.10)",
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Typography
                    sx={{
                      color: aderidosColors.greenDark,
                      fontWeight: 900,
                      fontSize: "0.82rem",
                    }}
                  >
                    Etapa {etapaAtual} de 2
                  </Typography>

                  <Typography
                    sx={{
                      color: aderidosColors.textMuted,
                      fontWeight: 850,
                      fontSize: "0.78rem",
                    }}
                  >
                    {progressoCheckout}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={progressoCheckout}
                  aria-label={`Progresso do checkout: etapa ${etapaAtual} de 2`}
                  sx={{
                    height: 8,
                    borderRadius: 2,
                    bgcolor: aderidosColors.greenSoft,
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, #064532 0%, #0B5136 100%)",
                      transition: `width ${aderidosMotion.duration.progress} ${aderidosMotion.easing.easeInOut}`,
                      ...reduceMotionSx,
                    },
                  }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.75}
                  sx={{ mt: 1.2 }}
                >
                  {cobrancaPix && (
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ color: aderidosColors.greenDark }}
                    />
                  )}

                  <Box>
                    <Typography
                      sx={{
                        color: aderidosColors.greenBlack,
                        fontWeight: 900,
                        lineHeight: 1.2,
                      }}
                    >
                      {etapaTitulo}
                    </Typography>
                    <Typography
                      sx={{
                        color: aderidosColors.textMuted,
                        fontSize: "0.84rem",
                        mt: 0.25,
                      }}
                    >
                      {etapaDescricao}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                data-testid="checkout-enviar-venda"
                disabled={gerandoPix || Boolean(cobrancaPix)}
                sx={{
                  mt: 0.5,
                  minHeight: 52,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 950,
                  fontSize: "1rem",
                  bgcolor: aderidosColors.greenDark,
                  boxShadow: "0 12px 22px rgba(6, 61, 49, 0.22)",
                  transition: `background-color ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}, box-shadow ${aderidosMotion.duration.standard} ${aderidosMotion.easing.easeOut}`,
                  ...reduceMotionSx,
                  "&:focus-visible": {
                    outline: "4px solid rgba(6, 61, 49, 0.24)",
                    outlineOffset: "2px",
                  },
                  "&:hover": {
                    bgcolor: "#052F26",
                    boxShadow: "0 14px 26px rgba(6, 61, 49, 0.28)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#526760",
                    color: "#FFFFFF",
                  },
                }}
              >
                {gerandoPix ? (
                  <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                ) : cobrancaPix ? (
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <CheckCircleIcon fontSize="small" />
                    <span>{botaoTexto}</span>
                  </Stack>
                ) : (
                  botaoTexto
                )}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2200}
        onClose={() => setSnackbarOpen(false)}
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
