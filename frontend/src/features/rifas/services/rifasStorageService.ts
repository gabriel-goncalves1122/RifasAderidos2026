// ============================================================================
// ARQUIVO: frontend/src/features/rifas/services/rifasStorageService.ts
// ============================================================================
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

import { auth, storage } from "@/shared/config/firebase";

interface UploadComprovanteParams {
  arquivo: File;
  pasta: string;
  nomeBase: string;
  metadados?: Record<string, string>;
}

function obterExtensaoArquivo(nomeArquivo: string) {
  return nomeArquivo.split(".").pop() || "jpg";
}

function validarArquivoComprovante(arquivo: File) {
  if (!arquivo) {
    throw new Error("Nenhum comprovante foi selecionado.");
  }

  if (arquivo.size <= 0) {
    throw new Error("O comprovante selecionado está vazio.");
  }

  if (arquivo.size > 10 * 1024 * 1024) {
    throw new Error("O comprovante precisa ter no máximo 10MB.");
  }
}

export const rifasStorageService = {
  async uploadComprovante({
    arquivo,
    pasta,
    nomeBase,
    metadados = {},
  }: UploadComprovanteParams) {
    try {
      validarArquivoComprovante(arquivo);

      const user = auth.currentUser;

      console.log("[Storage] Iniciando upload de comprovante", {
        host: window.location.hostname,
        usuario: user
          ? {
              uid: user.uid,
              email: user.email,
            }
          : null,
        arquivo: {
          name: arquivo.name,
          type: arquivo.type,
          size: arquivo.size,
          sizeMB: Number((arquivo.size / 1024 / 1024).toFixed(2)),
        },
      });

      if (!user) {
        throw new Error(
          "Usuário não encontrado no Firebase Auth antes do upload.",
        );
      }

      const token = await user.getIdToken();

      console.log("[Storage] Token disponível antes do upload", {
        uid: user.uid,
        tokenInicio: token.slice(0, 12),
        tokenTamanho: token.length,
      });

      const extensao = obterExtensaoArquivo(arquivo.name);
      const caminho = `${pasta}/${user.uid}_${nomeBase}_${Date.now()}.${extensao}`;

      console.log("[Storage] Caminho do comprovante:", caminho);

      const storageRef = ref(storage, caminho);

      const snapshot = await uploadBytesResumable(storageRef, arquivo, {
        contentType: arquivo.type || "application/octet-stream",
        customMetadata: {
          vendedorId: user.uid,
          ...metadados,
        },
      });

      console.log("[Storage] Upload finalizado:", {
        fullPath: snapshot.ref.fullPath,
        bucket: snapshot.ref.bucket,
      });

      const url = await getDownloadURL(snapshot.ref);

      console.log("[Storage] URL gerada:", url);

      return url;
    } catch (erro: any) {
      console.error("[Storage] Erro ao enviar comprovante:", {
        code: erro?.code,
        message: erro?.message,
        name: erro?.name,
        serverResponse: erro?.serverResponse,
        stack: erro?.stack,
        erro,
      });

      throw erro;
    }
  },

  async uploadComprovanteAtrasado(rifaId: string, arquivo: File) {
    try {
      validarArquivoComprovante(arquivo);

      const user = auth.currentUser;

      console.log("[Storage] Iniciando upload atrasado", {
        usuario: user?.uid || null,
        rifaId,
      });

      if (!user) {
        throw new Error(
          "Usuário não encontrado no Firebase Auth antes do upload atrasado.",
        );
      }

      const extensao = obterExtensaoArquivo(arquivo.name);
      const caminho = `comprovantes_atrasados/${rifaId}_${user.uid}_${Date.now()}.${extensao}`;

      const storageRef = ref(storage, caminho);

      await uploadBytes(storageRef, arquivo, {
        contentType: arquivo.type || "application/octet-stream",
        customMetadata: {
          vendedorId: user.uid,
          rifaId,
        },
      });

      const url = await getDownloadURL(storageRef);

      console.log("[Storage] URL gerada upload atrasado:", url);

      return url;
    } catch (erro: any) {
      console.error("[Storage] Erro ao enviar comprovante atrasado:", {
        code: erro?.code,
        message: erro?.message,
        serverResponse: erro?.serverResponse,
        erro,
      });

      throw erro;
    }
  },
};
