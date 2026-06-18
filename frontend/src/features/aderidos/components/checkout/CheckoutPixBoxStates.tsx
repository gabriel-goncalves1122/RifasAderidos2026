import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import type { CheckoutPixCobranca } from "../../types/checkoutPix";
import { formatarExpiracaoPix } from "./utils/checkoutUtils";

export function CheckoutPixLoading() {
  return (
    <Stack
      direction="row"
      spacing={1.25}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        color: "#526760",
      }}
    >
      <CircularProgress size={18} sx={{ color: "#063D31" }} />
      <Typography sx={{ fontWeight: 800, fontSize: "0.88rem" }}>
        Gerando pagamento via Pix...
      </Typography>
    </Stack>
  );
}

export function CheckoutPixError({ erro }: { erro: string }) {
  return (
    <Alert
      severity="warning"
      sx={{
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        color: "#6B4E00",
        "& .MuiAlert-icon": {
          color: "#6B4E00",
        },
      }}
    >
      {erro}
    </Alert>
  );
}

export function CheckoutPixEmpty() {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        border: "1px dashed rgba(6, 61, 49, 0.18)",
        color: "#526760",
      }}
    >
      <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.45 }}>
        O pagamento via Pix será gerado quando os dados forem confirmados.
      </Typography>
    </Box>
  );
}

export function CheckoutPixConfirmed() {
  return (
    <Stack
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "#EAF7EF",
        border: "2px solid #0B5136",
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 48, color: "#0B5136" }} />
      <Typography
        sx={{
          fontWeight: 950,
          color: "#0B5136",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
      >
        Pagamento confirmado!
      </Typography>
      <Typography
        sx={{
          color: "#425951",
          fontSize: "0.88rem",
          textAlign: "center",
        }}
      >
        O pagamento via Pix foi confirmado. As rifas estão em análise pela
        tesouraria.
      </Typography>
    </Stack>
  );
}

export function CheckoutPixPollingNotice() {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1.25,
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        border: "1px solid rgba(203, 166, 77, 0.4)",
      }}
    >
      <CircularProgress size={16} sx={{ color: "#A88123" }} />
      <Typography
        sx={{
          fontWeight: 800,
          color: "#6B4E00",
          fontSize: "0.84rem",
        }}
      >
        Aguardando confirmação do pagamento...
      </Typography>
    </Stack>
  );
}

export function CheckoutPixExpiredNotice() {
  return (
    <Alert
      severity="warning"
      sx={{
        borderRadius: 2,
        bgcolor: "#FFF7E0",
        color: "#6B4E00",
        "& .MuiAlert-icon": { color: "#6B4E00" },
      }}
    >
      O tempo de espera expirou. Verifique o status da cobrança no painel de
      rifas.
    </Alert>
  );
}

export function CheckoutQrCodeDisplay({ qrCodeSrc }: { qrCodeSrc: string }) {
  return (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: 164,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        border: "1px solid rgba(6, 61, 49, 0.12)",
        overflow: "hidden",
      }}
    >
      {qrCodeSrc ? (
        <Box
          component="img"
          src={qrCodeSrc}
          alt="QR Code Pix"
          sx={{
            width: 152,
            height: 152,
            objectFit: "contain",
          }}
        />
      ) : (
        <Stack spacing={0.75} alignItems="center" sx={{ color: "#063D31" }}>
          <QrCode2Icon fontSize="large" />
          <Typography sx={{ fontWeight: 850, fontSize: "0.86rem" }}>
            QR Code indisponível
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export function CheckoutPixCopiaECola({ codigo }: { codigo?: string }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        bgcolor: "#F6F8F7",
        border: "1px dashed rgba(6, 61, 49, 0.22)",
        wordBreak: "break-all",
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          color: "#063D31",
          fontSize: "0.82rem",
          lineHeight: 1.35,
        }}
      >
        {codigo}
      </Typography>
    </Box>
  );
}

interface CheckoutPixActionsProps {
  cobranca: CheckoutPixCobranca;
  onCopiarPix: () => void;
  onAbrirAppBanco?: () => void;
}

export function CheckoutPixActions({
  cobranca,
  onCopiarPix,
  onAbrirAppBanco,
}: CheckoutPixActionsProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      alignItems={{ xs: "stretch", sm: "center" }}
      justifyContent="space-between"
    >
      <Typography sx={{ color: "#526760", fontSize: "0.78rem" }}>
        Expira em {formatarExpiracaoPix(cobranca.expiraEm)}
      </Typography>

      <Button
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={onCopiarPix}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 900,
          color: "#063D31",
          borderColor: "rgba(6, 61, 49, 0.28)",
          py: 1,
          "&:hover": {
            borderColor: "#063D31",
            bgcolor: "#EAF3EF",
          },
          "&:focus-visible": {
            outline: "4px solid rgba(6, 61, 49, 0.24)",
            outlineOffset: "2px",
          },
        }}
      >
        Copiar Pix copia-e-cola
      </Button>

      {onAbrirAppBanco && (
        <Button
          variant="contained"
          startIcon={<OpenInNewIcon />}
          onClick={onAbrirAppBanco}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 900,
            bgcolor: "#063D31",
            py: 1,
            "&:hover": {
              bgcolor: "#021B16",
            },
            "&:focus-visible": {
              outline: "4px solid rgba(6, 61, 49, 0.24)",
              outlineOffset: "2px",
            },
          }}
        >
          Abrir app de banco
        </Button>
      )}
    </Stack>
  );
}
