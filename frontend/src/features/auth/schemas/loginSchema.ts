// ============================================================================
// ARQUIVO: frontend/src/features/auth/schemas/loginSchema.ts
// ============================================================================
import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("Senha é obrigatória"),
  })
  .required();

export type LoginFormData = yup.InferType<typeof loginSchema>;
