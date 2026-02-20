// ============================================================================
// ARQUIVO: rifaController.spec.ts (Testes de Unidade do Backend)
// ============================================================================

import { rifasController } from "../src/controllers/rifasController";
import { AuthRequest } from "../src/middlewares/authMiddleware";
import { Response } from "express";
// ----------------------------------------------------------------------------
// 1. MOCK (FALSIFICAÇÃO) DE DEPENDÊNCIAS EXTERNAS
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// 1. MOCK (FALSIFICAÇÃO) DE DEPENDÊNCIAS EXTERNAS
// ----------------------------------------------------------------------------
jest.mock("firebase-admin", () => {
  // Criamos as variáveis falsas DENTRO do escopo do mock para fugir do erro de hoisting
  const mockDocRef = { id: "comprador_mock_123", set: jest.fn() };
  const mockBatch = {
    set: jest.fn(),
    update: jest.fn(),
    commit: jest.fn().mockResolvedValue(true), // Simula o salvamento com sucesso
  };

  return {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue(mockDocRef),
      }),
      batch: jest.fn().mockReturnValue(mockBatch),
    }),
  };
});

// "describe" cria uma Suíte de Testes (um grupo de testes sobre o mesmo assunto)
describe("Rifas Controller", () => {
  // "it" (ou "test") é o caso de teste individual. A frase deve ser descritiva.
  it("deve retornar erro 400 se o comprovante estiver faltando na venda", async () => {
    // ========================================================================
    // A - ARRANGE (PREPARAR O CENÁRIO)
    // ========================================================================

    // 1. Simulamos o objeto "Request" (req) que o Express receberia do Frontend.
    // Injetamos um usuário falso (como se o middleware já tivesse validado o token)
    // e enviamos o "body" faltando a URL do comprovante para forçar o erro.
    const req = {
      user: { uid: "user_123", email: "teste@teste.com" },
      body: {
        nome: "Teste Engenheiro",
        telefone: "11999999999",
        email: "teste@teste.com",
        numerosRifas: ["00123"],
        comprovanteUrl: "", // <-- O GATILHO DO ERRO ESTÁ AQUI (Vazio)
      },
    } as unknown as AuthRequest;

    // 2. Simulamos o objeto "Response" (res) do Express.
    // Usamos "mockReturnThis()" no status para encadear chamadas, ex: res.status(400).json(...)
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // ========================================================================
    // A - ACT (AGIR / EXECUTAR)
    // ========================================================================

    // Chamamos a função real do nosso controller passando os objetos falsos.
    await rifasController.processarVenda(req, res);

    // ========================================================================
    // A - ASSERT (VERIFICAR / VALIDAR)
    // ========================================================================

    // Verificamos se o controller percebeu o erro e respondeu com Status 400 (Bad Request).
    expect(res.status).toHaveBeenCalledWith(400);

    // Verificamos se a mensagem de erro disparada no JSON foi exatamente esta.
    // Se alguém mudar o texto do erro no código fonte no futuro, o teste quebra e avisa!
    expect(res.json).toHaveBeenCalledWith({
      error: "Dados incompletos ou comprovante faltando.",
    });
  });

  it("deve processar a venda com sucesso e retornar 200", async () => {
    // A - ARRANGE (Dados perfeitos)
    const req = {
      user: { uid: "user_123", email: "teste@teste.com" },
      body: {
        nome: "Engenheiro Comprador",
        telefone: "11999999999",
        email: "teste@teste.com",
        numerosRifas: ["00123", "00124"],
        comprovanteUrl: "https://firebase.storage.com/comprovante.png",
      },
    } as unknown as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // A - ACT
    await rifasController.processarVenda(req, res);

    // A - ASSERT (Sucesso!)
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      sucesso: true,
      mensagem: "Venda registrada com sucesso! Comprovante em análise.",
    });
  });
});
