import * as yup from "yup";

export const atualizarCompradorCompraSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .required("Nome do comprador é obrigatório.")
    .min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Email inválido.")
    .optional()
    .nullable(),
  telefone: yup
    .string()
    .trim()
    .optional()
    .nullable(),
});
