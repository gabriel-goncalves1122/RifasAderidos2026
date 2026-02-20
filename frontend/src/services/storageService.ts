import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

// Tipagem rigorosa para garantir que nunca enviaremos uma imagem sem os dados vitais
export interface MetadadosComprovante {
  vendedorId: string;
  nomeComprador: string;
  numerosRifas: string[]; // Passaremos um array, mas o Storage salva como string
}

export const storageService = {
  /**
   * Faz o upload do comprovante e "carimba" os dados da venda diretamente no arquivo
   */
  async uploadComprovantePix(
    arquivo: File,
    dadosVenda: MetadadosComprovante,
  ): Promise<string> {
    try {
      // 1. Cria um nome único para o arquivo para evitar sobreposição
      const extensao = arquivo.name.split(".").pop();
      const nomeUnico = `comprovantes/${Date.now()}_${dadosVenda.vendedorId}.${extensao}`;

      // 2. Aponta para o "balde" (bucket) do Firebase
      const storageRef = ref(storage, nomeUnico);

      // 3. A MÁGICA: Prepara os metadados customizados
      const metadata = {
        contentType: arquivo.type,
        customMetadata: {
          vendedorId: dadosVenda.vendedorId,
          nomeComprador: dadosVenda.nomeComprador,
          // O Firebase Storage só aceita strings nos metadados, então juntamos o array
          bilhetes: dadosVenda.numerosRifas.join(","),
          dataUpload: new Date().toISOString(),
        },
      };

      // 4. Executa o upload com a imagem e a "etiqueta" de metadados juntas
      const snapshot = await uploadBytes(storageRef, arquivo, metadata);

      // 5. Retorna a URL pública para salvarmos no nosso banco de dados (Firestore)
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do comprovante:", error);
      throw new Error("Falha ao enviar a imagem do comprovante.");
    }
  },
};
