// ============================================================================
// ARQUIVO: tests/notificacoesService.spec.ts (Testes do Serviço de Notificações)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";

const mockGet = jest.fn<any>();
const mockBatchUpdate = jest.fn<any>();
const mockBatchCommit = jest.fn<any>();
const mockBatchSet = jest.fn<any>();

jest.mock("firebase-admin", () => {
  const collectionMock = {
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnValue({ id: "NOTIF_123" }),
    get: mockGet,
  };

  const firestoreMock = jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(collectionMock),
    batch: jest.fn().mockReturnValue({
      update: mockBatchUpdate,
      set: mockBatchSet,
      commit: mockBatchCommit,
    }),
  }) as any;

  firestoreMock.FieldPath = {
    documentId: jest.fn().mockReturnValue("mocked-document-id"),
  };

  return {
    firestore: firestoreMock,
  };
});

import { NotificacoesService } from "../../src/modules/notificacoes/notificacoesService"; // Ajuste o caminho se necessário
// Simulamos os tipos do Firebase Batch para o TS não reclamar

describe("Notificações Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========================================================================
  describe("buscarPorEmailAderido()", () => {
    it("Deve retornar array vazio se o usuário não for encontrado", async () => {
      mockGet.mockResolvedValueOnce({ empty: true });

      const resultado =
        await NotificacoesService.buscarPorEmailAderido("intruso@teste.com");

      expect(resultado).toEqual([]);
    });

    it("Deve retornar as notificações se o aderido existir", async () => {
      // Encontra o aderido
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_TESTE" }) }],
      });

      // Retorna as notificações
      mockGet.mockResolvedValueOnce({
        docs: [
          { id: "msg_1", data: () => ({ titulo: "Recusado", lida: false }) },
        ],
      });

      const resultado = (await NotificacoesService.buscarPorEmailAderido(
        "valido@teste.com",
      )) as any[];

      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe("Recusado");
      expect(resultado[0].id).toBe("msg_1");
    });

    it("Deve cair no catch (fallback sem orderBy) caso haja erro", async () => {
      // Encontra o aderido
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_TESTE" }) }],
      });

      // Primeiro get (com orderBy) lança erro
      mockGet.mockRejectedValueOnce(new Error("Missing index"));

      // Segundo get (fallback) retorna os dados
      mockGet.mockResolvedValueOnce({
        docs: [
          { id: "msg_2", data: () => ({ titulo: "Recusado Fallback", lida: false }) },
        ],
      });

      const resultado = (await NotificacoesService.buscarPorEmailAderido(
        "valido@teste.com",
      )) as any[];

      expect(resultado).toHaveLength(1);
      expect(resultado[0].titulo).toBe("Recusado Fallback");
      expect(resultado[0].id).toBe("msg_2");
    });

    it("Deve usar o ID do documento se id_aderido não existir", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({}), id: "DOC_ID" }],
      });

      mockGet.mockResolvedValueOnce({
        docs: [{ id: "msg_3", data: () => ({ titulo: "Recusado Doc", lida: false }) }],
      });

      const resultado = (await NotificacoesService.buscarPorEmailAderido("valido@teste.com")) as any[];
      expect(resultado).toHaveLength(1);
    });

    it("Deve retornar vazio se id_aderido e id do documento não existirem", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({}), id: undefined }],
      });

      const resultado = await NotificacoesService.buscarPorEmailAderido("valido@teste.com");
      expect(resultado).toEqual([]);
    });
  });

  // ========================================================================
  describe("marcarComoLidas()", () => {
    it("Deve atualizar em lote as notificações enviadas para lida=true", async () => {
      const ids = ["id_001", "id_002"];

      // Mock para a busca de usuário
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_TESTE" }) }],
      });

      // Mock para a busca das notificações
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [
          { ref: { id: "id_001" } },
          { ref: { id: "id_002" } },
        ]
      });

      await NotificacoesService.marcarComoLidas(ids, "teste@teste.com");

      expect(mockBatchUpdate).toHaveBeenCalledTimes(2);
      expect(mockBatchUpdate).toHaveBeenCalledWith(
        expect.anything(), // ignora a referencia
        { lida: true },
      );
      expect(mockBatchCommit).toHaveBeenCalledTimes(1);
    });

    it("Deve retornar se ids for vazio", async () => {
      await NotificacoesService.marcarComoLidas([], "teste@teste.com");
      expect(mockGet).not.toHaveBeenCalled();
    });

    it("Deve retornar se usuario nao for encontrado", async () => {
      mockGet.mockResolvedValueOnce({ empty: true });
      await NotificacoesService.marcarComoLidas(["id_1"], "inexistente@teste.com");
      expect(mockBatchCommit).not.toHaveBeenCalled();
    });

    it("Deve retornar se snap de notificacoes for vazio", async () => {
      // Mock para a busca de usuário
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({ id_aderido: "ADERIDO_TESTE" }), id: "user_1" }],
      });
      // Mock para notificacoes vazio
      mockGet.mockResolvedValueOnce({ empty: true });

      await NotificacoesService.marcarComoLidas(["id_1"], "teste@teste.com");
      expect(mockBatchCommit).not.toHaveBeenCalled();
    });

    it("Deve usar o ID do documento se id_aderido não existir (marcarComoLidas)", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({}), id: "DOC_ID" }],
      });
      mockGet.mockResolvedValueOnce({ empty: true }); // Para de executar depois
      await NotificacoesService.marcarComoLidas(["id_1"], "teste@teste.com");
      // Se não lançou erro e tentou buscar notificações, passou pela linha
      expect(mockBatchCommit).not.toHaveBeenCalled(); 
    });

    it("Deve retornar se id_aderido e id do doc não existirem (marcarComoLidas)", async () => {
      mockGet.mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => ({}), id: undefined }],
      });
      await NotificacoesService.marcarComoLidas(["id_1"], "teste@teste.com");
      // get(notificacoes) won't be called
      expect(mockGet).toHaveBeenCalledTimes(1); 
    });
  });

  // ========================================================================
  describe("criarNotificacaoRecusa()", () => {
    it("Deve criar notificação de recusa corretamente", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRecusa(batchMock, "VEND_1", "Foto borrada", ["001"]);

      expect(batchMock.set).toHaveBeenCalledTimes(1);
      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" }, // from collectionMock.doc()
        expect.objectContaining({
          vendedor_id: "VEND_1",
          titulo: "Comprovante Recusado ⚠️",
          mensagem: "Foto borrada",
          rifas: ["001"],
          lida: false,
        })
      );
    });

    it("Não deve fazer nada se vendedorId for vazio", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRecusa(batchMock, "", "Foto borrada", ["001"]);
      expect(batchMock.set).not.toHaveBeenCalled();
    });

    it("Deve usar fallbacks se motivo e rifas não forem providenciados", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRecusa(batchMock, "VEND_1", "", undefined as any);

      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" },
        expect.objectContaining({
          mensagem: "O comprovante enviado não foi aceito pela tesouraria.",
          rifas: [],
        })
      );
    });
  });

  // ========================================================================
  describe("criarNotificacaoCorrecaoDados()", () => {
    it("Deve criar notificação de correção de dados corretamente", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoCorrecaoDados(batchMock, "VEND_1", "Nome inválido", ["002"]);

      expect(batchMock.set).toHaveBeenCalledTimes(1);
      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" },
        expect.objectContaining({
          vendedor_id: "VEND_1",
          tipo: "correcao_dados",
          titulo: "Venda recusada",
          mensagem: "Nome inválido",
          rifas: ["002"],
          lida: false,
        })
      );
    });

    it("Não deve fazer nada se vendedorId for vazio", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoCorrecaoDados(batchMock, "", "Nome inválido", ["002"]);
      expect(batchMock.set).not.toHaveBeenCalled();
    });

    it("Deve usar fallbacks se motivo e rifas não forem providenciados", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoCorrecaoDados(batchMock, "VEND_1", "", undefined as any);

      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" },
        expect.objectContaining({
          mensagem: "Revise os dados do comprador e envie novamente.",
          rifas: [],
        })
      );
    });
  });

  // ========================================================================
  describe("criarNotificacaoRifaLiberada()", () => {
    it("Deve criar notificação de rifa liberada corretamente", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRifaLiberada(batchMock, "VEND_1", "Pix estornado", ["003"]);

      expect(batchMock.set).toHaveBeenCalledTimes(1);
      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" },
        expect.objectContaining({
          vendedor_id: "VEND_1",
          tipo: "rifa_liberada",
          titulo: "Rifas disponíveis novamente",
          mensagem: "Pix estornado",
          rifas: ["003"],
          lida: false,
        })
      );
    });

    it("Não deve fazer nada se vendedorId for vazio", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRifaLiberada(batchMock, "", "Pix estornado", ["003"]);
      expect(batchMock.set).not.toHaveBeenCalled();
    });

    it("Deve usar fallbacks se motivo e rifas não forem providenciados", () => {
      const batchMock = { set: jest.fn() } as any;
      NotificacoesService.criarNotificacaoRifaLiberada(batchMock, "VEND_1", "", undefined as any);

      expect(batchMock.set).toHaveBeenCalledWith(
        { id: "NOTIF_123" },
        expect.objectContaining({
          mensagem: "O pagamento não foi confirmado pelo banco e as rifas voltaram para venda.",
          rifas: [],
        })
      );
    });
  });
});
