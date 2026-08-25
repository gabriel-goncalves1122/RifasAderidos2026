import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { Box, Button, Stack, Typography } from "@mui/material";

import type { CheckoutPixCobranca } from "../../../types/checkoutPix";
import { CheckoutPixCountdown } from "../CheckoutPixCountdown";

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
  cancelando?: boolean;
  onCopiarPix: () => void;
  onCancelarPix: () => void;
}

export function CheckoutPixActions({
  cobranca,
  cancelando,
  onCopiarPix,
  onCancelarPix,
}: CheckoutPixActionsProps) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <CheckoutPixCountdown expiraEm={cobranca.expiraEm} />
        {cobranca.copiaECola && (
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={onCopiarPix}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 800,
              bgcolor: "#063D31",
              color: "#FFF",
              boxShadow: "0 2px 8px rgba(6, 61, 49, 0.3)",
              py: 1,
              "&:hover": {
                bgcolor: "#0B5136",
                boxShadow: "0 4px 12px rgba(6, 61, 49, 0.4)",
              },
              "&:focus-visible": {
                outline: "4px solid rgba(6, 61, 49, 0.24)",
                outlineOffset: "2px",
              },
            }}
          >
            Copiar Pix copia-e-cola
          </Button>
        )}
      </Stack>

      <Button
        variant="text"
        onClick={onCancelarPix}
        disabled={cancelando}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
          color: "#9E1B1B",
          mt: 2,
          "&:hover": {
            bgcolor: "rgba(158, 27, 27, 0.08)",
          },
        }}
      >
        {cancelando ? "Cancelando..." : "Cancelar pagamento e alterar dados"}
      </Button>
    </Stack>
  );
}
