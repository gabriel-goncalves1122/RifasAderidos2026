// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/mappers/secretariaMapper.ts
// ============================================================================
import {
  AderidoSecretaria,
  ModalidadeAdesao,
  StatusCadastro,
} from "../../../shared/types/secretaria";
import { formatarNomeMembro } from "../utils/formatadoresSecretaria";

function normalizarTexto(valor: unknown): string {
  if (valor === null || valor === undefined) return "";

  return String(valor).trim();
}

function obterPrimeiroTextoValido(...valores: unknown[]): string {
  // Centraliza fallback de campos legados do Firestore, como Nome, E-mail e Cargo.
  const valorEncontrado = valores.find(
    (valor) => normalizarTexto(valor).length > 0,
  );

  return normalizarTexto(valorEncontrado);
}

function normalizarStatus(data: any): StatusCadastro {
  const statusCadastro = normalizarTexto(data.status_cadastro).toLowerCase();
  const statusLegado = normalizarTexto(data.status).toLowerCase();

  if (statusCadastro === "ativo") return "ativo";
  if (statusCadastro === "pendente") return "pendente";
  if (statusCadastro === "inativo") return "inativo";

  // Documentos antigos podem usar status: "Aderido" no lugar de status_cadastro.
  if (statusLegado === "aderido" || statusLegado === "ativo") return "ativo";
  if (statusLegado === "inativo") return "inativo";
  if (statusLegado === "pendente") return "pendente";

  return data.uid ? "ativo" : "pendente";
}

function normalizarModalidade(data: any): ModalidadeAdesao {
  return data.modalidade_adesao === "meio" ? "meio" : "completo";
}

export function normalizarAderidoSecretaria(
  idDocumento: string,
  data: any,
): AderidoSecretaria {
  const nome = formatarNomeMembro(
    obterPrimeiroTextoValido(data.nome, data.Nome, data["Nome Completo"]),
  );

  const email = obterPrimeiroTextoValido(
    data.email,
    data.Email,
    data["E-mail"],
    idDocumento,
  );

  const telefone = obterPrimeiroTextoValido(data.telefone, data.Telefone);

  const cpf = obterPrimeiroTextoValido(data.cpf, data.CPF);

  const curso = obterPrimeiroTextoValido(data.curso, data.Curso);

  const genero = obterPrimeiroTextoValido(
    data.genero,
    data.Genero,
    data.Gênero,
  );

  const dataNascimento = obterPrimeiroTextoValido(
    data.dataNascimento,
    data.data_nascimento,
    data["Data de Nascimento"],
  );

  return {
    ...data,

    // ID do documento é o identificador seguro para edição no Firestore.
    id: idDocumento,

    // Mantém compatibilidade com documentos antigos e novos.
    id_aderido: data.id_aderido || data.id || idDocumento,

    nome,
    email,
    telefone,
    cpf,
    curso,
    genero,

    // O banco tem registros com os dois formatos.
    data_nascimento: dataNascimento,
    dataNascimento,

    cargo: obterPrimeiroTextoValido(data.cargo, data.Cargo) || "aderido",
    modalidade_adesao: normalizarModalidade(data),

    status_cadastro: normalizarStatus(data),
    status: data.status,

    posicao_adesao: data.posicao_adesao,
    faixa_rifas: data.faixa_rifas,

    meta_vendas: Number(data.meta_vendas || 0),
    total_arrecadado: Number(data.total_arrecadado || 0),
    rifas_vendidas: Number(data.rifas_vendidas || 0),

    uid: data.uid ?? null,
    criado_em: data.criado_em,
    cadastrado_em: data.cadastrado_em,
  };
}
