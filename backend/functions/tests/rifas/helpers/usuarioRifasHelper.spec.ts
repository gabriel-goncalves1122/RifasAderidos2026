import * as admin from "firebase-admin";
import { buscarUsuarioPorEmail, obterContextoAderidoPorEmail } from "../../../src/modules/rifas/helpers/usuarioRifasHelper";

jest.mock("firebase-admin", () => {
  const getMock = jest.fn();
  const limitMock = jest.fn(() => ({ get: getMock }));
  const whereMock = jest.fn(() => ({ limit: limitMock }));
  const collectionMock = jest.fn(() => ({ where: whereMock }));
  return {
    firestore: jest.fn(() => ({
      collection: collectionMock,
    })),
  };
});

describe("usuarioRifasHelper", () => {
  let firestoreMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    firestoreMock = admin.firestore();
  });

  it("buscarUsuarioPorEmail deve retornar os dados do usuário corretamente", async () => {
    firestoreMock.collection().where().limit().get.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "USER_ID",
          data: () => ({ email: "teste@teste.com", nome: "Teste", cpf: "123" }),
        },
      ],
    });

    const resultado = await buscarUsuarioPorEmail("teste@teste.com");

    expect(resultado.id).toBe("USER_ID");
    expect(resultado.data.nome).toBe("Teste");
  });

  it("buscarUsuarioPorEmail deve disparar USER_NOT_FOUND se o email não existir", async () => {
    firestoreMock.collection().where().limit().get.mockResolvedValueOnce({
      empty: true,
      docs: [],
    });

    await expect(buscarUsuarioPorEmail("naoexiste@teste.com")).rejects.toThrow("USER_NOT_FOUND");
  });

  it("obterContextoAderidoPorEmail deve extrair idAderido, nome e cpf", async () => {
    firestoreMock.collection().where().limit().get.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "USER_ID",
          data: () => ({ id_aderido: "ADER_123", nome: "Vendedor Teste", cpf: "999.999.999-99" }),
        },
      ],
    });

    const resultado = await obterContextoAderidoPorEmail("teste@teste.com");

    expect(resultado.idAderido).toBe("ADER_123");
    expect(resultado.vendedorNome).toBe("Vendedor Teste");
    expect(resultado.vendedorCpf).toBe("999.999.999-99");
  });

  it("obterContextoAderidoPorEmail deve usar fallbacks se os dados estiverem vazios", async () => {
    firestoreMock.collection().where().limit().get.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "USER_ID",
          data: () => ({}),
        },
      ],
    });

    const resultado = await obterContextoAderidoPorEmail("teste@teste.com");

    expect(resultado.idAderido).toBe("USER_ID");
    expect(resultado.vendedorNome).toBe("Nome não registado");
    expect(resultado.vendedorCpf).toBe("CPF não registado");
  });
});
