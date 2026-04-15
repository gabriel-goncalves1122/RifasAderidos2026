import { AuditoriaService } from "../../src/modules/auditoria/auditoriaService";
import { NotificacoesService } from "../../src/modules/notificacoes/notificacoesService";
import { enviarEmailRecibo } from "../../src/modules/rifas/emailService";
import { OcrService } from "../../src/modules/auditoria/ocrLogic/OcrService"; // Importamos o novo serviço
import {
  jest,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from "@jest/globals";

// ============================================================================
// MOCKS DE DEPENDÊNCIAS EXTERNAS E SERVIÇOS
// ============================================================================

// 1. Mock do serviço de notificações e emails
jest.mock("../../src/modules/notificacoes/notificacoesService", () => ({
  NotificacoesService: {
    criarNotificacaoRecusa: jest.fn(),
  },
}));
jest.mock("../../src/modules/rifas/emailService", () => ({
  enviarEmailRecibo: jest.fn(),
}));

// 2. MOCK DO OCR: Evita carregar o Tesseract e o pdf-parse no Jest, resolvendo o erro do DOMMatrix!
jest.mock("../../src/modules/auditoria/ocrLogic/OcrService", () => ({
  OcrService: {
    processarComprovante: jest.fn(),
  },
}));

// Mock extra global para bibliotecas conflituosas com o Jest (Garante blindagem total)
jest.mock("pdf-parse", () => jest.fn());

// ============================================================================
// MOCK BLINDADO DO FIRESTORE
// ============================================================================
const mockBatchUpdate: any = jest.fn();
const mockBatchCommit: any = jest.fn();
const mockFileDelete: any = jest.fn<any>().mockResolvedValue(true as any);
const mockDocSet: any = jest.fn();

const mockCollectionGet: any = jest.fn();
const mockDocGet: any = jest.fn();

const collectionMock: any = {};
collectionMock.where = jest.fn().mockReturnValue(collectionMock);
collectionMock.orderBy = jest.fn().mockReturnValue(collectionMock);
collectionMock.limit = jest.fn().mockReturnValue(collectionMock);
collectionMock.get = mockCollectionGet;
collectionMock.set = mockDocSet;
collectionMock.doc = jest.fn().mockReturnValue({
  get: mockDocGet,
  set: mockDocSet,
  ref: "mock-ref",
});

jest.mock("firebase-admin", () => ({
  firestore: jest.fn(() => ({
    collection: jest.fn(() => collectionMock),
    batch: jest.fn(() => ({
      update: mockBatchUpdate,
      commit: mockBatchCommit,
    })),
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        delete: mockFileDelete,
      })),
    })),
  })),
}));

describe("Service: auditoriaService", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("extrairCaminhoStorage()", () => {
    it("Deve extrair o caminho corretamente de uma URL válida do Firebase Storage", () => {
      const url =
        "https://firebasestorage.googleapis.com/v0/b/projeto.appspot.com/o/comprovantes%2F123.jpg?alt=media&token=abc";
      const caminho = AuditoriaService.extrairCaminhoStorage(url);
      expect(caminho).toBe("comprovantes/123.jpg");
    });

    it("Deve retornar null se a URL for inválida ou malformada", () => {
      const caminho = AuditoriaService.extrairCaminhoStorage("url-invalida");
      expect(caminho).toBeNull();
    });
  });

  describe("listarPendentes()", () => {
    it("Deve retornar uma lista de rifas pendentes", async () => {
      const mockDocs = [
        { data: () => ({ numero: "00001", status: "pendente" }) },
        { data: () => ({ numero: "00002", status: "pendente" }) },
      ];

      mockCollectionGet.mockResolvedValueOnce({ docs: mockDocs });

      const resultado = await AuditoriaService.listarPendentes();

      expect(resultado).toHaveLength(2);
      expect(resultado[0].numero).toBe("00001");
    });
  });

  describe("auditarLoteIA()", () => {
    it("Deve retornar zeros se não houver rifas pendentes com comprovativo", async () => {
      mockCollectionGet.mockResolvedValueOnce({ empty: true });

      const resultado = await AuditoriaService.auditarLoteIA();

      expect(resultado).toEqual({
        preAprovados: 0,
        divergentes: 0,
        jaAvaliados: 0,
        total: 0,
      });
      // Verificamos o OcrService em vez do axios
      expect(OcrService.processarComprovante).not.toHaveBeenCalled();
    });

    it("Deve atirar erro se o extrato CSV não estiver configurado no sistema", async () => {
      const mockDocRifa = {
        data: () => ({ comprovante_url: "url1" }),
        ref: "ref1",
      };

      mockCollectionGet.mockResolvedValueOnce({
        empty: false,
        docs: [mockDocRifa],
        size: 1,
      });
      mockDocGet.mockResolvedValueOnce({ data: () => ({}) });

      await expect(AuditoriaService.auditarLoteIA()).rejects.toThrow(
        "O extrato da InfinitePay não foi carregado.",
      );
    });

    it("Deve processar lote, chamar OCR Local e atualizar rifas como pré-aprovadas", async () => {
      const mockDocRifa = {
        data: () => ({ comprovante_url: "url_imagem" }),
        ref: "ref_bilhete",
      };

      mockCollectionGet.mockResolvedValueOnce({
        empty: false,
        docs: [mockDocRifa],
        size: 1,
      });
      mockDocGet.mockResolvedValueOnce({
        data: () => ({ extrato_csv: "linha1,linha2" }),
      });

      // Configuramos a resposta simulada (mock) do nosso novo serviço local
      (OcrService.processarComprovante as any).mockResolvedValueOnce({
        status: "APROVADO",
        mensagem: "Validado por ID e Valor.",
      });

      const resultado = await AuditoriaService.auditarLoteIA();

      // Verificamos se o motor OCR foi chamado
      expect(OcrService.processarComprovante).toHaveBeenCalledWith(
        "url_imagem",
        "linha1,linha2",
      );

      expect(mockBatchUpdate).toHaveBeenCalledWith("ref_bilhete", {
        log_automacao: "✅ Pré-aprovado pela IA: Validado por ID e Valor.",
      });
      expect(mockBatchCommit).toHaveBeenCalled();
      expect(resultado.preAprovados).toBe(1);
    });
  });

  describe("processarDecisaoManual()", () => {
    it("Deve APROVAR rifas, enviar email e atualizar dados", async () => {
      const mockSnap = {
        exists: true,
        data: () => ({
          status: "pendente",
          comprador_email: "teste@teste.com",
          comprador_nome: "Maria",
        }),
      };

      mockDocGet.mockResolvedValueOnce(mockSnap);

      await AuditoriaService.processarDecisaoManual(["00001"], "aprovar", "");

      expect(mockBatchUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ status: "pago" }),
      );
      expect(mockBatchCommit).toHaveBeenCalled();
      expect(enviarEmailRecibo).toHaveBeenCalledWith(
        "teste@teste.com",
        "Maria",
        ["00001"],
        "aprovado",
      );
      expect(NotificacoesService.criarNotificacaoRecusa).not.toHaveBeenCalled();
    });

    it("Deve REJEITAR rifas, limpar dados, notificar e apagar imagem do Storage", async () => {
      const mockSnap = {
        exists: true,
        data: () => ({
          status: "pendente",
          vendedor_id: "ADERIDO_010",
          comprovante_url:
            "https://firebasestorage.../o/pasta%2Fimg.jpg?alt=media",
        }),
      };

      mockDocGet.mockResolvedValueOnce(mockSnap);

      await AuditoriaService.processarDecisaoManual(
        ["00002"],
        "rejeitar",
        "Comprovativo Falso",
      );

      expect(mockBatchUpdate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "disponivel",
          comprador_id: null,
          motivo_recusa: "Comprovativo Falso",
        }),
      );

      expect(NotificacoesService.criarNotificacaoRecusa).toHaveBeenCalledWith(
        expect.anything(),
        "ADERIDO_010",
        "Comprovativo Falso",
        ["00002"],
      );

      expect(mockFileDelete).toHaveBeenCalled();
      expect(enviarEmailRecibo).not.toHaveBeenCalled();
    });
  });

  describe("salvarExtratoCsv()", () => {
    it("Deve salvar o texto do extrato na base de dados", async () => {
      const textoTeste = "DATA,VALOR\n14/04/2026,10.00";

      await AuditoriaService.salvarExtratoCsv(textoTeste);

      expect(mockDocSet).toHaveBeenCalledWith(
        expect.objectContaining({
          extrato_csv: textoTeste,
          atualizado_em: expect.any(String),
        }),
        { merge: true },
      );
    });
  });
});
