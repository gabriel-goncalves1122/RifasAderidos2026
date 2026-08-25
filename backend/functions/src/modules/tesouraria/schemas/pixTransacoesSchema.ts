import * as yup from "yup";

export const aceitarPixSchema = yup.object({
  // Sem corpo obrigatório, apenas o param na rota
});

export const negarPixSchema = yup.object({
  motivo: yup
    .string()
    .trim()
    .required("O motivo da recusa é obrigatório.")
    .min(5, "O motivo deve ter pelo menos 5 caracteres.")
    .max(500, "O motivo deve ter no máximo 500 caracteres."),
});
