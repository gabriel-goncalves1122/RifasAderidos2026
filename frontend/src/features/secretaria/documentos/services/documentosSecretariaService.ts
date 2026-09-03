import { fetchAPI } from "@/shared/services/api";

import type {
  DocumentoComissao,
  DocumentoFormData,
} from "../types/documentosSecretariaTypes";

interface DocumentoResponse {
  sucesso: true;
  documento: DocumentoComissao;
}

const CAMPOS_DOCUMENTO = [
  "titulo",
  "area",
  "tipo",
  "dataDocumento",
  "descricao",
  "periodoReferencia",
  "textoAlternativo",
  "creditoImagem",
] as const satisfies ReadonlyArray<keyof DocumentoFormData>;

function montarFormularioDocumento(dados: DocumentoFormData): FormData {
  const formulario = new FormData();

  CAMPOS_DOCUMENTO.forEach((campo) => {
    const valor = dados[campo];
    if (typeof valor === "string" && valor.trim()) {
      formulario.append(campo, valor.trim());
    }
  });

  if (dados.arquivo) {
    formulario.append("arquivo", dados.arquivo, dados.arquivo.name);
  }

  return formulario;
}

export const documentosSecretariaService = {
  async listarDocumentos(): Promise<DocumentoComissao[]> {
    return fetchAPI("/admin/documentos");
  },

  async criarDocumento(dados: DocumentoFormData): Promise<DocumentoComissao> {
    if (!dados.arquivo) {
      throw new Error("Selecione um arquivo para enviar.");
    }

    const response: DocumentoResponse = await fetchAPI(
      "/admin/documentos",
      "POST",
      montarFormularioDocumento(dados),
    );

    return response.documento;
  },

  async atualizarDocumento(
    documentoAtual: DocumentoComissao,
    dados: DocumentoFormData,
  ): Promise<DocumentoComissao> {
    const response: DocumentoResponse = await fetchAPI(
      `/admin/documentos/${documentoAtual.id}`,
      "PUT",
      montarFormularioDocumento(dados),
    );

    return response.documento;
  },

  async baixarConteudo(documentoId: string): Promise<Blob> {
    return fetchAPI(
      `/admin/documentos/${documentoId}/conteudo`,
      "GET",
      undefined,
      true,
      "blob",
    );
  },
};
