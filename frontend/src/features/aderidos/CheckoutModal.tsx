// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/CheckoutModal.tsx
// ============================================================================
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useRifas } from "@/features/rifas/hooks/useRifas";

import {
  CheckoutFormData,
  checkoutSchema,
} from "./components/checkout/checkoutSchema";
import { CHAVE_PIX_COMISSAO } from "./components/checkout/utils/checkoutUtils";
import { CheckoutDadosCompradorForm } from "./components/checkout/CheckoutDadosCompradorForm";
import { CheckoutPixBox } from "./components/checkout/CheckoutPixBox";
import { CheckoutResumoVenda } from "./components/checkout/CheckoutResumoVenda";
import { CheckoutUploadComprovante } from "./components/checkout/CheckoutUploadComprovante";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  numerosRifas: string[];
}

const CHECKOUT_DRAFT_KEY = "checkout_venda_rifas_draft";

interface CheckoutDraft {
  nome: string;
  telefone: string;
  email: string;
}

function carregarDraftCheckout(): CheckoutDraft {
  try {
    const draft = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);

    if (!draft) {
      return {
        nome: "",
        telefone: "",
        email: "",
      };
    }

    return JSON.parse(draft) as CheckoutDraft;
  } catch {
    return {
      nome: "",
      telefone: "",
      email: "",
    };
  }
}

function salvarDraftCheckout(dados: CheckoutDraft) {
  sessionStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(dados));
}

function limparDraftCheckout() {
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

export function CheckoutModal({
  open,
  onClose,
  onSuccess,
  numerosRifas,
}: CheckoutModalProps) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { finalizarVenda, loading } = useRifas();

  const defaultValues = useMemo(() => carregarDraftCheckout(), []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(checkoutSchema) as any,
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      nome: defaultValues.nome,
      telefone: defaultValues.telefone,
      email: defaultValues.email,
      comprovante: undefined as any,
    },
  });

  const nome = watch("nome");
  const telefone = watch("telefone");
  const email = watch("email");
  const comprovanteAnexado = watch("comprovante");

  useEffect(() => {
    salvarDraftCheckout({
      nome: nome || "",
      telefone: telefone || "",
      email: email || "",
    });
  }, [nome, telefone, email]);

  const copiarChavePix = async () => {
    await navigator.clipboard.writeText(CHAVE_PIX_COMISSAO);
    setSnackbarOpen(true);
  };

  const fecharModal = () => {
    if (loading) return;

    // Não limpa os campos ao fechar. Assim, se o Safari suspender a aba,
    // os dados digitados continuam preservados.
    onClose();
  };

  const enviarVenda = async (dados: CheckoutFormData) => {
    const sucesso = await finalizarVenda({
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email || "",
      numerosRifas,
      comprovante: dados.comprovante,
    });

    if (!sucesso) return;

    limparDraftCheckout();
    reset();

    onSuccess();
  };

  return (
    <>
      <Dialog
        open={open}
        keepMounted
        disableEscapeKeyDown={loading}
        onClose={(_, reason) => {
          // Evita perder o modal por clique acidental fora dele.
          if (reason === "backdropClick") return;

          fecharModal();
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: {
              xs: "22px 22px 0 0",
              sm: 5,
            },
            m: {
              xs: 0,
              sm: 2,
            },
            position: {
              xs: "fixed",
              sm: "relative",
            },
            bottom: {
              xs: 0,
              sm: "auto",
            },
            width: {
              xs: "100%",
              sm: "auto",
            },
            bgcolor: "#FBFCFC",
            overflow: "hidden",
          },
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
                color: "#021B16",
                fontSize: "1.22rem",
                lineHeight: 1.15,
              }}
            >
              Finalizar venda
            </Typography>

            <Typography
              sx={{
                color: "#526760",
                fontSize: "0.86rem",
                mt: 0.35,
              }}
            >
              Preencha os dados e envie o comprovante para análise.
            </Typography>
          </Box>

          <IconButton
            onClick={fecharModal}
            disabled={loading}
            aria-label="Fechar modal de venda"
            sx={{
              bgcolor: "#F1F4F3",
              "&:hover": {
                bgcolor: "#E8EEEC",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 2.25 }}>
          <Box component="form" onSubmit={handleSubmit(enviarVenda)}>
            <Stack spacing={2}>
              <CheckoutResumoVenda numerosRifas={numerosRifas} />

              <CheckoutPixBox onCopiarPix={copiarChavePix} />

              <CheckoutDadosCompradorForm
                register={register}
                setValue={setValue}
                errors={errors}
              />

              <CheckoutUploadComprovante
                arquivo={comprovanteAnexado}
                setValue={setValue}
                errors={errors}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 0.5,
                  minHeight: 52,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 950,
                  fontSize: "1rem",
                  bgcolor: "#063D31",
                  boxShadow: "0 12px 22px rgba(6, 61, 49, 0.22)",
                  "&:hover": {
                    bgcolor: "#052F26",
                    boxShadow: "0 14px 26px rgba(6, 61, 49, 0.28)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
                ) : (
                  "Enviar venda para análise"
                )}
              </Button>

              {/* {comprovanteAnexado === undefined && (
                <Typography
                  sx={{
                    color: "#7A1F1F",
                    fontSize: "0.78rem",
                    textAlign: "center",
                  }}
                >
                  No iPhone, se você trocar de aplicativo, talvez seja
                  necessário anexar o comprovante novamente.
                </Typography>
              )} */}
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
            borderRadius: 3,
            fontWeight: 800,
          }}
        >
          Chave PIX copiada.
        </Alert>
      </Snackbar>
    </>
  );
}
