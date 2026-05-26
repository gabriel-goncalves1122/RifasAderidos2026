// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/CheckoutUploadComprovante.tsx
// ============================================================================
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Button, Typography } from "@mui/material";
import { FieldErrors, UseFormSetValue } from "react-hook-form";

import { CheckoutFormData } from "./checkoutSchema";

interface CheckoutUploadComprovanteProps {
  arquivo?: File;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function CheckoutUploadComprovante({
  arquivo,
  setValue,
  errors,
}: CheckoutUploadComprovanteProps) {
  return (
    <Box>
      <Button
        component="label"
        fullWidth
        variant="outlined"
        startIcon={arquivo ? <CheckCircleOutlineIcon /> : <CloudUploadIcon />}
        sx={{
          minHeight: 54,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 900,
          justifyContent: "flex-start",
          px: 2,
          color: arquivo ? "#063D31" : "#526760",
          borderColor: arquivo
            ? "rgba(6, 61, 49, 0.35)"
            : "rgba(2, 27, 22, 0.16)",
          bgcolor: arquivo ? "#F0F7F4" : "#FFFFFF",
          "&:hover": {
            bgcolor: arquivo ? "#E6F2ED" : "#F6F8F7",
            borderColor: "#063D31",
          },
        }}
      >
        {arquivo ? arquivo.name : "Anexar comprovante do PIX"}

        <input
          hidden
          type="file"
          accept="image/*,.pdf"
          onChange={(event) => {
            const arquivoSelecionado = event.target.files?.[0];

            if (!arquivoSelecionado) return;

            setValue("comprovante", arquivoSelecionado, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
        />
      </Button>

      {errors.comprovante?.message && (
        <Typography
          sx={{
            mt: 0.75,
            ml: 1,
            color: "#9B1C1C",
            fontSize: "0.78rem",
          }}
        >
          {errors.comprovante.message}
        </Typography>
      )}
    </Box>
  );
}
