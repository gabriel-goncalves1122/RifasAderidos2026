import { storage } from "../../../../shared/config/firebaseAdmin";

export const documentosSecretariaStorageService = {
  async salvar(params: {
    storagePath: string;
    buffer: Buffer;
    mimeType: string;
  }): Promise<void> {
    await storage.bucket().file(params.storagePath).save(params.buffer, {
      resumable: false,
      metadata: {
        contentType: params.mimeType,
        cacheControl: "private, max-age=300",
      },
    });
  },

  async remover(storagePath: string): Promise<void> {
    await storage.bucket().file(storagePath).delete({ ignoreNotFound: true });
  },

  async baixar(storagePath: string): Promise<Buffer> {
    const [conteudo] = await storage.bucket().file(storagePath).download();
    return conteudo;
  },
};
