// ============================================================================
// ARQUIVO: Testes do Controlador de Rifas (Tesouraria)
// ============================================================================
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { rifasController } from "../src/controllers/rifasController";
import { Request, Response } from "express";
import { enviarEmailRecibo } from "../src/services/emailService";

// ----------------------------------------------------------------------------
// 1. MOCKS E DUBLÊS DE CÓDIGO (Fake Backend)
// ----------------------------------------------------------------------------

// Dublê do EmailService: Evita que o sistema mande e-mails reais nos testes
jest.mock("../src/services/emailService", () => ({
  enviarEmailRecibo: jest.fn(),
}));

// Dublês do Firestore: Funções espiãs tipadas com <any> para o TypeScript não reclamar
const mockUpdate = jest.fn<any>();
const mockCommit = jest.fn<any>().mockResolvedValue(true);

jest.mock("firebase-admin", () => {
  return {
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        // Sempre que o controller pedir um documento, nós devolvemos este "falso" bilhete pendente
        doc: jest.fn((id) => ({
          id,
          // O <any> aqui salva o erro do "exists: boolean"
          get: jest.fn<any>().mockResolvedValue({
            exists: true,
            data: () => ({
              status: "pendente",
              comprador_email: "formando2026@gmail.com",
              comprador_nome: "João Teste",
            }),
          }),
        })),
      })),
      // O nosso carrinho de compras do banco (Batch)
      batch: jest.fn(() => ({
        update: mockUpdate,
        commit: mockCommit,
      })),
    })),
  };
});

// ----------------------------------------------------------------------------
// 2. A SUÍTE DE TESTES DA TESOURARIA
// ----------------------------------------------------------------------------
describe("RifasController - Painel da Tesouraria (Comissão de Formatura 2026)", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  // Antes de CADA teste, a gente zera as variáveis e limpa a memória dos espiões
  beforeEach(() => {
    mockReq = {
      body: {},
      user: { uid: "admin123", email: "tesouraria@gmail.com" }, // Finge ser um admin logado
    } as any;

    mockRes = {
      // O <any> aqui resolve os erros de "Type 'Mock<UnknownFunction>' is not assignable to type 'Response'"
      status: jest.fn<any>().mockReturnThis(),
      json: jest.fn<any>(),
    };

    jest.clearAllMocks(); // Reseta os contadores do Jest
  });

  // ==========================================================================
  // TESTE 1: Bloqueio de Segurança (Bad Request)
  // ==========================================================================
  it("Deve retornar erro 400 se faltar o array de numerosRifas ou a decisao", async () => {
    // Cenário: Frontend enviou os dados errados ou vazios
    mockReq.body = {};

    await rifasController.avaliarComprovante(mockReq as any, mockRes as any);

    // Validação: O segurança (Controller) barrou na porta?
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Números das rifas (array) e decisão são obrigatórios.",
    });
  });

  // ==========================================================================
  // TESTE 2: Aprovação em Lote (Caminho Feliz)
  // ==========================================================================
  it("Deve aprovar um lote de bilhetes, mudar status para 'pago' e disparar e-mail", async () => {
    // Cenário: A Tesouraria clicou em "Aprovar" duas rifas ao mesmo tempo
    const rifasTeste = ["001", "002"];
    mockReq.body = {
      numerosRifas: rifasTeste,
      decisao: "aprovar",
    };

    await rifasController.avaliarComprovante(mockReq as any, mockRes as any);

    // Validação 1: O Batch Update rodou para os dois bilhetes?
    expect(mockUpdate).toHaveBeenCalledTimes(2); // Deve ter atualizado as 2 rifas

    // Validação 2: Ele alterou o status para 'pago'?
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(), // Referência do documento
      expect.objectContaining({ status: "pago" }), // O dado injetado
    );

    // Validação 3: Salvou no banco?
    expect(mockCommit).toHaveBeenCalled();

    // Validação 4: Enviou o e-mail de Recibo Definitivo para o comprador?
    expect(enviarEmailRecibo).toHaveBeenCalledWith(
      "formando2026@gmail.com", // E-mail falso configurado no Mock lá em cima
      "João Teste",
      rifasTeste, // O lote inteiro
      "aprovado",
    );

    // Validação 5: Devolveu 200 pro Frontend?
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true }),
    );
  });

  // ==========================================================================
  // TESTE 3: Rejeição em Lote (Fraude ou Erro)
  // ==========================================================================
  it("Deve rejeitar bilhetes e devolver para a vitrine (status 'disponivel')", async () => {
    // Cenário: A Tesouraria viu que o PIX era falso e rejeitou
    mockReq.body = {
      numerosRifas: ["005"],
      decisao: "rejeitar",
    };

    await rifasController.avaliarComprovante(mockReq as any, mockRes as any);

    // Validação 1: Resetou o status para disponível?
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        status: "disponivel",
        comprador_id: null, // Apagou o fraudador
      }),
    );

    // Validação 2: Garantir que NÃO mandou e-mail de aprovado
    expect(enviarEmailRecibo).not.toHaveBeenCalled();

    // Validação 3: Devolveu 200 pro Frontend?
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});
