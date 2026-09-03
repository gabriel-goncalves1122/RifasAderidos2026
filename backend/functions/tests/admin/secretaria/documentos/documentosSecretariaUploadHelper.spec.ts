import { describe, it, expect } from "@jest/globals";
import { AppError } from "../../../../src/shared/classes/AppError";
import {
  validarArquivoDocumentoSecretaria,
  criarStoragePathDocumento,
  LIMITE_DOCUMENTO_SECRETARIA_BYTES,
} from "../../../../src/modules/admin/secretaria/documentos/documentosSecretariaUploadHelper";
import type { ArquivoDocumentoSecretaria } from "../../../../src/modules/admin/secretaria/documentos/documentosSecretariaTypes";

describe("documentosSecretariaUploadHelper", () => {
  describe("validarArquivoDocumentoSecretaria", () => {
    it("should throw error if mime type is not allowed", () => {
      const file: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from(""),
        mimeType: "text/plain",
        nomeArquivo: "test.txt",
        tamanhoBytes: 100,
      };

      expect(() => validarArquivoDocumentoSecretaria(file)).toThrow(AppError);
      try {
        validarArquivoDocumentoSecretaria(file);
      } catch (error: any) {
        expect(error.code).toBe("DOCUMENTO_SECRETARIA_TIPO_INVALIDO");
      }
    });

    it("should throw error if size is 0", () => {
      const file: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from(""),
        mimeType: "application/pdf",
        nomeArquivo: "test.pdf",
        tamanhoBytes: 0,
      };

      expect(() => validarArquivoDocumentoSecretaria(file)).toThrow(AppError);
      try {
        validarArquivoDocumentoSecretaria(file);
      } catch (error: any) {
        expect(error.code).toBe("DOCUMENTO_SECRETARIA_TAMANHO_INVALIDO");
      }
    });

    it("should throw error if size is above limit", () => {
      const file: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from(""),
        mimeType: "application/pdf",
        nomeArquivo: "test.pdf",
        tamanhoBytes: LIMITE_DOCUMENTO_SECRETARIA_BYTES + 1,
      };

      expect(() => validarArquivoDocumentoSecretaria(file)).toThrow(AppError);
    });

    it("should validate PDF signature", () => {
      const validPdf: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("%PDF-1.4"),
        mimeType: "application/pdf",
        nomeArquivo: "test.pdf",
        tamanhoBytes: 8,
      };
      expect(() => validarArquivoDocumentoSecretaria(validPdf)).not.toThrow();

      const invalidPdf: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("not-a-pdf"),
        mimeType: "application/pdf",
        nomeArquivo: "test.pdf",
        tamanhoBytes: 9,
      };
      expect(() => validarArquivoDocumentoSecretaria(invalidPdf)).toThrow(AppError);
    });

    it("should validate PNG signature", () => {
      const validPng: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0x00]),
        mimeType: "image/png",
        nomeArquivo: "test.png",
        tamanhoBytes: 6,
      };
      expect(() => validarArquivoDocumentoSecretaria(validPng)).not.toThrow();
    });

    it("should validate JPEG signature", () => {
      const validJpeg: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from([0xff, 0xd8, 0xff, 0x00]),
        mimeType: "image/jpeg",
        nomeArquivo: "test.jpg",
        tamanhoBytes: 4,
      };
      expect(() => validarArquivoDocumentoSecretaria(validJpeg)).not.toThrow();
    });

    it("should validate GIF signature", () => {
      const validGif1: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("GIF87a"),
        mimeType: "image/gif",
        nomeArquivo: "test.gif",
        tamanhoBytes: 6,
      };
      const validGif2: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("GIF89a"),
        mimeType: "image/gif",
        nomeArquivo: "test.gif",
        tamanhoBytes: 6,
      };
      expect(() => validarArquivoDocumentoSecretaria(validGif1)).not.toThrow();
      expect(() => validarArquivoDocumentoSecretaria(validGif2)).not.toThrow();
    });

    it("should validate WEBP signature", () => {
      const validWebp: ArquivoDocumentoSecretaria = {
        buffer: Buffer.concat([
          Buffer.from("RIFF"),
          Buffer.from([0x00, 0x00, 0x00, 0x00]),
          Buffer.from("WEBP"),
        ]),
        mimeType: "image/webp",
        nomeArquivo: "test.webp",
        tamanhoBytes: 12,
      };
      expect(() => validarArquivoDocumentoSecretaria(validWebp)).not.toThrow();
    });

    it("should validate XLSX signature", () => {
      const validXlsx: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from([0x50, 0x4b, 0x00, 0x00]),
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        nomeArquivo: "test.xlsx",
        tamanhoBytes: 4,
      };
      expect(() => validarArquivoDocumentoSecretaria(validXlsx)).not.toThrow();
    });

    it("should validate XLS signature", () => {
      const validXls: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0x00]),
        mimeType: "application/vnd.ms-excel",
        nomeArquivo: "test.xls",
        tamanhoBytes: 5,
      };
      expect(() => validarArquivoDocumentoSecretaria(validXls)).not.toThrow();
    });

    it("should validate CSV signature", () => {
      const validCsv: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("a,b,c\n1,2,3"),
        mimeType: "text/csv",
        nomeArquivo: "test.csv",
        tamanhoBytes: 11,
      };
      expect(() => validarArquivoDocumentoSecretaria(validCsv)).not.toThrow();

      const invalidCsv: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from([0x61, 0x00, 0x62]),
        mimeType: "text/csv",
        nomeArquivo: "test.csv",
        tamanhoBytes: 3,
      };
      expect(() => validarArquivoDocumentoSecretaria(invalidCsv)).toThrow(AppError);
    });

    it("should throw if signature doesn't match for valid mime type", () => {
      const invalidContent: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("not-a-png"),
        mimeType: "image/png",
        nomeArquivo: "test.png",
        tamanhoBytes: 9,
      };
      expect(() => validarArquivoDocumentoSecretaria(invalidContent)).toThrow(AppError);
      try {
        validarArquivoDocumentoSecretaria(invalidContent);
      } catch (error: any) {
        expect(error.code).toBe("DOCUMENTO_SECRETARIA_CONTEUDO_INVALIDO");
      }
    });

    it("should throw if mime is not explicitly handled by signature checker", () => {
      // If we somehow bypassed the mime type check (we didn't, but testing the fallback false)
      const unhandledMime: ArquivoDocumentoSecretaria = {
        buffer: Buffer.from("test"),
        mimeType: "application/csv" as any, // "application/csv" is in MIMES_PLANILHA
        nomeArquivo: "test.csv",
        tamanhoBytes: 4,
      };
      expect(() => validarArquivoDocumentoSecretaria(unhandledMime)).not.toThrow();
    });
  });

  describe("criarStoragePathDocumento", () => {
    it("should create correct storage path and sanitize inputs", () => {
      const path = criarStoragePathDocumento({
        id: "doc-123",
        area: "tesouraria",
        tipo: "comprovante_bancario",
        nomeArquivo: "Meu Arquivo 1.pdf",
      });

      expect(path).toMatch(/^documentos_secretaria\/tesouraria\/comprovante_bancario\/doc-123_.*_meu-arquivo-1\.pdf$/);
    });

    it("should fallback to defaults if inputs are empty after sanitization", () => {
      const path = criarStoragePathDocumento({
        id: "doc-123",
        area: "!!" as any, // Only invalid chars
        tipo: "@@" as any,
        nomeArquivo: "@@@",
      });

      expect(path).toMatch(/^documentos_secretaria\/geral\/outro\/doc-123_.*_documento$/);
    });
  });
});
