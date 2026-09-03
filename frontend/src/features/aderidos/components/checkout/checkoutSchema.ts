// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/checkout/checkoutSchema.ts
// ============================================================================
import * as yup from "yup";

export interface CheckoutFormData {
  nome: string;
  telefone: string;
  email: string;
  documento: string;
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
      .required("O e-mail é obrigatório para gerar o pagamento via Pix.")
      .email("Formato de e-mail inválido."),

    documento: yup
      .string()
      .required("Informe o CPF ou CNPJ do pagador.")
      .test(
        "cpf-cnpj-valido",
        "Documento incompleto. Use 11 dígitos (CPF) ou 14 dígitos (CNPJ).",
        (value) => {
          const apenasNumeros = String(value || "").replace(/\D/g, "");
          return apenasNumeros.length === 11 || apenasNumeros.length === 14;
        },
      ),
  })
  .required();
