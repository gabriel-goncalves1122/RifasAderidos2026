// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/CheckoutDadosCompradorForm.tsx
// ============================================================================
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import { InputAdornment, Stack, TextField } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { CheckoutFormData } from "./checkoutSchema";
import { aplicarMascaraTelefone } from "./utils/checkoutUtils";

interface CheckoutDadosCompradorFormProps {
  register: UseFormRegister<CheckoutFormData>;
  setValue: UseFormSetValue<CheckoutFormData>;
  errors: FieldErrors<CheckoutFormData>;
}

export function CheckoutDadosCompradorForm({
  register,
  setValue,
  errors,
}: CheckoutDadosCompradorFormProps) {
  return (
    <Stack spacing={1.75}>
      <TextField
        label="Nome completo"
        fullWidth
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

      <TextField
        label="E-mail opcional"
        fullWidth
        inputProps={{ "data-testid": "checkout-email" }}
        error={Boolean(errors.email)}
        helperText={
          errors.email?.message || "Para enviar comprovante (opcional)."
        }
        {...register("email")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
