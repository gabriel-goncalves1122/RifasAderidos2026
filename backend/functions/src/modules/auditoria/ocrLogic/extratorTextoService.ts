// ============================================================================
// ARQUIVO: backend/functions/src/modules/auditoria/extratorTextoService.ts
// ============================================================================
import axios from "axios";
import Tesseract from "tesseract.js";

// ============================================================================
// POLYFILL (ENGANAR O PDF.JS)
// Criamos variáveis globais falsas para que o pdf-parse não crashe no Node.js
// ============================================================================
if (typeof global !== "undefined") {
  (global as any).DOMMatrix = (global as any).DOMMatrix || class DOMMatrix {};
  (global as any).ImageData = (global as any).ImageData || class ImageData {};
  (global as any).Path2D = (global as any).Path2D || class Path2D {};
}

// Agora sim, importamos em segurança!
const pdfParse = require("pdf-parse");

export class ExtratorTextoService {
  /**
   * Faz o download do arquivo e roteia para o leitor correto (PDF ou Imagem)
   */
  static async extrair(urlArquivo: string): Promise<string> {
    try {
      // 1. Download direto para a memória RAM
      const respostaArquivo = await axios.get(urlArquivo, {
        responseType: "arraybuffer",
      });
      const bufferArquivo = Buffer.from(respostaArquivo.data, "binary");
      const contentType = respostaArquivo.headers["content-type"] || "";

      // 2. Roteador de Extração (PDF vs Imagem)
      if (
        contentType.includes("application/pdf") ||
        urlArquivo.toLowerCase().includes(".pdf")
      ) {
        // Leitura nativa e instantânea de PDFs gerados por bancos
        const dadosPdf = await pdfParse(bufferArquivo);
        return dadosPdf.text;
      } else {
        // Leitura via Inteligência Artificial (OCR) para imagens/prints
        const {
          data: { text },
        } = await Tesseract.recognize(bufferArquivo, "por");
        return text;
      }
    } catch (error: any) {
      console.error("[ExtratorTextoService] Erro ao extrair texto:", error);
      throw new Error("Falha na extração de texto do arquivo.");
    }
  }
}
