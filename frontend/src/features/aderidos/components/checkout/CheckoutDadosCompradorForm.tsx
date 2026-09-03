// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/CheckoutDadosCompradorForm.tsx
// ============================================================================
import EmailIcon from "@mui/icons-material/Email";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  InputAdornment,
  Stack,
  TextField,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { CheckoutFormData } from "./checkoutSchema";
import {
  aplicarMascaraCpfCnpj,
  aplicarMascaraTelefone,
} from "./utils/checkoutUtils";

interface CheckoutDadosCompradorFormProps {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
  isDisabled?: boolean;
}

export function CheckoutDadosCompradorForm({
  register,
  setValue,
  errors,
  isDisabled,
}: CheckoutDadosCompradorFormProps) {
  return (
    <Stack spacing={2.25}>
      <TextField
        label="Nome do Comprador"
        fullWidth
        disabled={isDisabled}
        inputProps={{ "data-testid": "checkout-nome" }}
        error={Boolean(errors.nome)}
        helperText={errors.nome?.message}
        {...register("nome")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="WhatsApp"
        fullWidth
        disabled={isDisabled}
        inputProps={{ "data-testid": "checkout-telefone" }}
        error={Boolean(errors.telefone)}
        helperText={errors.telefone?.message}
        {...register("telefone")}
        onChange={(event) => {
          const valorFormatado = aplicarMascaraTelefone(event.target.value);

          // Mantém a máscara sincronizada com o react-hook-form.
          setValue("telefone", valorFormatado, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <Divider sx={{ borderStyle: "dashed", my: 1, borderColor: "divider" }} />

      <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
        <InfoOutlinedIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
        <Box>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary", mb: 0.25 }}
          >
            Dados do Titular do Pagamento
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", lineHeight: 1.4 }}
          >
            Estes dados devem pertencer ao titular da conta bancária que realizará o pagamento.
          </Typography>
        </Box>
      </Box>

      <TextField
        label="E-mail"
        fullWidth
        disabled={isDisabled}
        type="email"
        required
        inputProps={{
          "data-testid": "checkout-email",
          autoCapitalize: "none",
        }}
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        {...register("email")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="CPF/CNPJ"
        fullWidth
        required
        disabled={isDisabled}
        inputProps={{
          "data-testid": "checkout-documento",
          inputMode: "numeric",
          maxLength: 18,
        }}
        error={Boolean(errors.documento)}
        helperText={errors.documento?.message}
        {...register("documento")}
        onChange={(event) => {
          const valorFormatado = aplicarMascaraCpfCnpj(event.target.value);

          setValue("documento", valorFormatado, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <BadgeOutlinedIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
