// ============================================================================
// ARQUIVO: frontend/src/features/auth/schemas/registerSchema.ts
// ============================================================================
import * as yup from "yup";

export const registerSchema = yup
  .object({
    nome: yup.string().required("Nome é obrigatório"),
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    cpf: yup
      .string()
      .required("CPF é obrigatório")
      .test("cpf-length", "CPF deve ter 11 números", (value) => {
        const numeros = String(value || "").replace(/\D/g, "");
        return numeros.length === 11;
      }),
    senha: yup
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("Senha é obrigatória"),
    confirmarSenha: yup
      .string()
      .oneOf([yup.ref("senha")], "As senhas não conferem")
      .required("Confirme sua senha"),
  })
  .required();

export type RegisterFormData = yup.InferType<typeof registerSchema>;
