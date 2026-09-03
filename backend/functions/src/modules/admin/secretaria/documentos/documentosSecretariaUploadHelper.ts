import { randomUUID } from "crypto";

import { AppError } from "../../../../shared/classes/AppError";
import type {
  AreaDocumentoSecretaria,
  ArquivoDocumentoSecretaria,
  TipoDocumentoSecretaria,
} from "./documentosSecretariaTypes";

export const LIMITE_DOCUMENTO_SECRETARIA_BYTES = 25 * 1024 * 1024;

const MIMES_PLANILHA = new Set([
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const MIMES_IMAGEM = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function iniciaCom(buffer: Buffer, assinatura: number[]): boolean {
  return assinatura.every((byte, indice) => buffer[indice] === byte);
}

function assinaturaCompativel(arquivo: ArquivoDocumentoSecretaria): boolean {
  const { buffer, mimeType } = arquivo;

  if (mimeType === "application/pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }

  if (mimeType === "image/png") {
    return iniciaCom(buffer, [0x89, 0x50, 0x4e, 0x47]);
  }

  if (mimeType === "image/jpeg") {
    return iniciaCom(buffer, [0xff, 0xd8, 0xff]);
  }

  if (mimeType === "image/gif") {
    return ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
  }

  if (mimeType === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return iniciaCom(buffer, [0x50, 0x4b]);
  }

  if (mimeType === "application/vnd.ms-excel") {
    return iniciaCom(buffer, [0xd0, 0xcf, 0x11, 0xe0]);
  }

  if (mimeType === "text/csv" || mimeType === "application/csv") {
    return !buffer.includes(0x00);
  }

  return false;
}

function sanitizarSegmento(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function validarArquivoDocumentoSecretaria(
  arquivo: ArquivoDocumentoSecretaria,
): void {
  const mimePermitido =
    arquivo.mimeType === "application/pdf" ||
    MIMES_PLANILHA.has(arquivo.mimeType) ||
    MIMES_IMAGEM.has(arquivo.mimeType);

  if (!mimePermitido) {
    throw new AppError(
      "DOCUMENTO_SECRETARIA_TIPO_INVALIDO",
      "Tipo de arquivo não permitido.",
      422,
    );
  }

  if (
    arquivo.tamanhoBytes < 1 ||
    arquivo.tamanhoBytes > LIMITE_DOCUMENTO_SECRETARIA_BYTES
  ) {
    throw new AppError(
      "DOCUMENTO_SECRETARIA_TAMANHO_INVALIDO",
      "O arquivo deve ter no máximo 25 MB.",
      422,
    );
  }

  if (!assinaturaCompativel(arquivo)) {
    throw new AppError(
      "DOCUMENTO_SECRETARIA_CONTEUDO_INVALIDO",
      "O conteúdo do arquivo não corresponde ao formato informado.",
      422,
    );
  }
}

export function criarStoragePathDocumento(params: {
  id: string;
  area: AreaDocumentoSecretaria;
  tipo: TipoDocumentoSecretaria;
  nomeArquivo: string;
}): string {
  const area = sanitizarSegmento(params.area) || "geral";
  const tipo = sanitizarSegmento(params.tipo) || "outro";
  const nome = sanitizarSegmento(params.nomeArquivo) || "documento";

  return `documentos_secretaria/${area}/${tipo}/${params.id}_${randomUUID()}_${nome}`;
}
