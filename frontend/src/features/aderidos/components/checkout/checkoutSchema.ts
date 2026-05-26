// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/checkoutSchema.ts
// ============================================================================
import * as yup from "yup";

export interface CheckoutFormData {
  nome: string;
  telefone: string;
  email?: string;
  comprovante: File;
}

export const checkoutSchema = yup
  .object({
    nome: yup.string().required("Informe o nome completo do comprador."),

    telefone: yup
      .string()
      .required("Informe o WhatsApp do comprador.")
      .min(14, "Telefone incompleto. Use o formato (35) 99999-9999."),

    email: yup
      .string()
      .optional()
      .test(
        "email-valido-ou-vazio",
        "Formato de e-mail inválido.",
        (value) =>
          !value ||
          value.trim() === "" ||
          yup.string().email().isValidSync(value),
      ),

    comprovante: yup
      .mixed<File>()
      .required("Anexe o comprovante do PIX para finalizar a venda."),
  })
  .required();
