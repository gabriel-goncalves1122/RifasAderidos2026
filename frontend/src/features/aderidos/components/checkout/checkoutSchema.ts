// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/checkoutSchema.ts
// ============================================================================
import * as yup from "yup";

export interface CheckoutFormData {
  nome: string;
  telefone: string;
  email?: string;
  documento?: string;
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

    documento: yup
      .string()
      .optional()
      .test(
        "cpf-valido-ou-vazio",
        "CPF incompleto. Use 11 dígitos.",
        (value) => {
          const apenasNumeros = String(value || "").replace(/\D/g, "");

          return !apenasNumeros || apenasNumeros.length === 11;
        },
      ),
  })
  .required();
