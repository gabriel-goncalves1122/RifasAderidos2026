import PixIcon from "@mui/icons-material/Pix";
import { Box, Stack, Typography } from "@mui/material";

import type { CheckoutPixCobranca } from "../../types/checkoutPix";
import type { CheckoutPollingStatus } from "../../hooks/useCheckoutPixFlow";
import {
  CheckoutPixActions,
  CheckoutPixCopiaECola,
  CheckoutPixConfirmed,
  CheckoutPixEmpty,
  CheckoutPixError,
  CheckoutPixExpiredNotice,
  CheckoutPixLoading,
  CheckoutPixPollingNotice,
  CheckoutQrCodeDisplay,
} from "./CheckoutPixBoxStates";

interface CheckoutPixBoxProps {
  cobranca?: CheckoutPixCobranca | null;
  gerando?: boolean;
  erro?: string | null;
  pollingStatus?: CheckoutPollingStatus;
  onCopiarPix: () => void;
  onAbrirAppBanco?: () => void;
}

function obterQrCodeSrc(cobranca: CheckoutPixCobranca) {
  if (cobranca.qrCodeImagemUrl) return cobranca.qrCodeImagemUrl;
  if (cobranca.qrCodeBase64) {
    return `data:image/png;base64,${cobranca.qrCodeBase64}`;
  }

  return "";
}

export function CheckoutPixBox({
  cobranca,
  gerando = false,
  erro,
  pollingStatus = "idle",
  onCopiarPix,
  onAbrirAppBanco,
}: CheckoutPixBoxProps) {
  const qrCodeSrc = cobranca ? obterQrCodeSrc(cobranca) : "";

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 1.25 }}>
        <PixIcon sx={{ color: "#063D31" }} />

        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 900,
              color: "#021B16",
              fontSize: "0.98rem",
              lineHeight: 1.2,
            }}
          >
            Pagamento via Pix
          </Typography>

          <Typography sx={{ color: "#526760", fontSize: "0.82rem", mt: 0.2 }}>
            Gere o pagamento para exibir o QR Code e o Pix copia-e-cola.
          </Typography>
        </Box>
      </Stack>

      {gerando && <CheckoutPixLoading />}

      {!gerando && erro && <CheckoutPixError erro={erro} />}

      {!gerando && !erro && !cobranca && <CheckoutPixEmpty />}

      {!gerando && cobranca && pollingStatus === "confirmado" && (
        <CheckoutPixConfirmed />
      )}

      {!gerando && cobranca && pollingStatus !== "confirmado" && (
        <Stack spacing={1.5}>
          {pollingStatus === "polling" && <CheckoutPixPollingNotice />}
          {pollingStatus === "expirado" && <CheckoutPixExpiredNotice />}

          <CheckoutQrCodeDisplay qrCodeSrc={qrCodeSrc} />
          <CheckoutPixCopiaECola codigo={cobranca.copiaECola} />
          <CheckoutPixActions
            cobranca={cobranca}
            onCopiarPix={onCopiarPix}
            onAbrirAppBanco={onAbrirAppBanco}
          />
        </Stack>
      )}
    </Box>
  );
}
