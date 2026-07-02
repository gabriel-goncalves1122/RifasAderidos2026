import { db } from "../../../../shared/config/firebaseAdmin";
import { AppError } from "../../../../shared/classes/AppError";

import type {
  ArquivoDocumentoSecretaria,
  AtualizarDocumentoSecretariaRequest,
  CriarDocumentoSecretariaRequest,
  DocumentoSecretaria,
} from "./documentosSecretariaTypes";
import {
  criarStoragePathDocumento,
  validarArquivoDocumentoSecretaria,
} from "./documentosSecretariaUploadHelper";
import { documentosSecretariaStorageService } from "./documentosSecretariaStorageService";

const COLECAO_DOCUMENTOS_SECRETARIA = "documentos_secretaria";

function normalizarDocumento(id: string, dados: FirebaseFirestore.DocumentData) {
  return {
    id,
    titulo: dados.titulo,
    area: dados.area,
    tipo: dados.tipo,
    nomeArquivo: dados.nomeArquivo,
    mimeType: dados.mimeType,
    tamanhoBytes: dados.tamanhoBytes,
    storagePath: dados.storagePath,
    urlVisualizacao: dados.urlVisualizacao,
    autorNome: dados.autorNome,
    criadoEm: dados.criadoEm,
    atualizadoEm: dados.atualizadoEm,
    dataDocumento: dados.dataDocumento || undefined,
    descricao: dados.descricao || undefined,
    periodoReferencia: dados.periodoReferencia || undefined,
    textoAlternativo: dados.textoAlternativo || undefined,
    creditoImagem: dados.creditoImagem || undefined,
  } as DocumentoSecretaria;
}

function limparCamposVazios<T extends Record<string, unknown>>(dados: T) {
  return Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== undefined),
  ) as Partial<T>;
}

export const documentosSecretariaService = {
  async listarDocumentos(): Promise<DocumentoSecretaria[]> {
    const snapshot = await db
      .collection(COLECAO_DOCUMENTOS_SECRETARIA)
      .orderBy("atualizadoEm", "desc")
      .get();

    return snapshot.docs.map((doc) => normalizarDocumento(doc.id, doc.data()));
  },

  async criarDocumento(
    dados: CriarDocumentoSecretariaRequest,
    arquivo: ArquivoDocumentoSecretaria,
    autorNome: string,
  ): Promise<DocumentoSecretaria> {
    validarArquivoDocumentoSecretaria(arquivo);

    const agora = new Date().toISOString();
    const docRef = db.collection(COLECAO_DOCUMENTOS_SECRETARIA).doc();
    const storagePath = criarStoragePathDocumento({
      id: docRef.id,
      area: dados.area,
      tipo: dados.tipo,
      nomeArquivo: arquivo.nomeArquivo,
    });
    const documento = limparCamposVazios({
      ...dados,
      nomeArquivo: arquivo.nomeArquivo,
      mimeType: arquivo.mimeType,
      tamanhoBytes: arquivo.tamanhoBytes,
      storagePath,
      autorNome,
      criadoEm: agora,
      atualizadoEm: agora,
    });

    await documentosSecretariaStorageService.salvar({
      storagePath,
      buffer: arquivo.buffer,
      mimeType: arquivo.mimeType,
    });

    try {
      await docRef.set(documento);
    } catch (error) {
      await documentosSecretariaStorageService.remover(storagePath);
      throw error;
    }

    return normalizarDocumento(docRef.id, documento);
  },

  async atualizarDocumento(
    id: string,
    dados: AtualizarDocumentoSecretariaRequest,
    arquivo?: ArquivoDocumentoSecretaria,
  ): Promise<DocumentoSecretaria> {
    const docRef = db.collection(COLECAO_DOCUMENTOS_SECRETARIA).doc(id);
    let documentoAtualizado: DocumentoSecretaria | null = null;
    let novoStoragePath: string | undefined;
    let storagePathAnterior: string | undefined;

    if (arquivo) {
      validarArquivoDocumentoSecretaria(arquivo);
      const documentoExistente = await docRef.get();

      if (!documentoExistente.exists) {
        throw new AppError(
          "DOCUMENTO_SECRETARIA_NAO_ENCONTRADO",
          "Documento não encontrado.",
          404,
        );
      }

      const dadosExistentes = documentoExistente.data();
      novoStoragePath = criarStoragePathDocumento({
        id,
        area: dados.area || dadosExistentes?.area,
        tipo: dados.tipo || dadosExistentes?.tipo,
        nomeArquivo: arquivo.nomeArquivo,
      });

      await documentosSecretariaStorageService.salvar({
        storagePath: novoStoragePath,
        buffer: arquivo.buffer,
        mimeType: arquivo.mimeType,
      });
    }

    try {
      await db.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (!doc.exists) {
          throw new AppError(
            "DOCUMENTO_SECRETARIA_NAO_ENCONTRADO",
            "Documento não encontrado.",
            404,
          );
        }

        const camposArquivo = arquivo && novoStoragePath
          ? {
              nomeArquivo: arquivo.nomeArquivo,
              mimeType: arquivo.mimeType,
              tamanhoBytes: arquivo.tamanhoBytes,
              storagePath: novoStoragePath,
              urlVisualizacao: undefined,
            }
          : {};
        const campos = limparCamposVazios({
          ...dados,
          ...camposArquivo,
          atualizadoEm: new Date().toISOString(),
        });

        storagePathAnterior = doc.data()?.storagePath;
        transaction.update(docRef, campos);
        documentoAtualizado = normalizarDocumento(doc.id, {
          ...doc.data(),
          ...campos,
        });
      });
    } catch (error) {
      if (novoStoragePath) {
        await documentosSecretariaStorageService.remover(novoStoragePath);
      }
      throw error;
    }

    if (
      novoStoragePath &&
      storagePathAnterior &&
      storagePathAnterior !== novoStoragePath
    ) {
      try {
        await documentosSecretariaStorageService.remover(storagePathAnterior);
      } catch (error) {
        console.warn(
          "[DocumentosSecretaria] Arquivo anterior não removido:",
          error,
        );
      }
    }

    if (!documentoAtualizado) {
      throw new AppError(
        "DOCUMENTO_SECRETARIA_ATUALIZACAO_FALHOU",
        "Não foi possível atualizar o documento.",
        500,
      );
    }

    return documentoAtualizado;
  },

  async obterConteudo(id: string): Promise<{
    conteudo: Buffer;
    mimeType: string;
    nomeArquivo: string;
  }> {
    const doc = await db.collection(COLECAO_DOCUMENTOS_SECRETARIA).doc(id).get();

    if (!doc.exists) {
      throw new AppError(
        "DOCUMENTO_SECRETARIA_NAO_ENCONTRADO",
        "Documento não encontrado.",
        404,
      );
    }

    const documento = normalizarDocumento(doc.id, doc.data() || {});

    if (!documento.storagePath) {
      throw new AppError(
        "DOCUMENTO_SECRETARIA_SEM_ARQUIVO",
        "Este documento não possui arquivo armazenado.",
        404,
      );
    }

    return {
      conteudo: await documentosSecretariaStorageService.baixar(
        documento.storagePath,
      ),
      mimeType: documento.mimeType,
      nomeArquivo: documento.nomeArquivo,
    };
  },
};
