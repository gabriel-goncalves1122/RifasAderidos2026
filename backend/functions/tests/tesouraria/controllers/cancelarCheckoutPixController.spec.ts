// ARQUIVO: backend/functions/tests/tesouraria/controllers/cancelarCheckoutPixController.spec.ts

import { AuthRequest } from "../../../src/shared/middlewares/authMiddleware";
import { criarReqResTesourariaController } from "../helpers/criarReqResTesourariaController";
import { cancelarCheckoutPix } from "../../../src/modules/tesouraria/controllers/cancelarCheckoutPixController";
import { CancelarCheckoutPixService } from "../../../src/modules/tesouraria/services/cancelarCheckoutPixService";

jest.mock("../../../src/modules/tesouraria/services/cancelarCheckoutPixService");

describe("cancelarCheckoutPixController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    const contexto = criarReqResTesourariaController();
    req = contexto.req;
    res = contexto.res;
  });

  it("deve retornar 401 se nao houver uid", async () => {
    req.user.uid = undefined;

    await cancelarCheckoutPix(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "UNAUTHORIZED" });
  });

  it("deve retornar 400 se nao houver id na rota", async () => {
    req.params = {};

    await cancelarCheckoutPix(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "ID do pagamento obrigatório." });
  });

  it("deve retornar 200 ao cancelar com sucesso", async () => {
    req.params = { id: "pag_123" };
    (CancelarCheckoutPixService.executar as jest.Mock).mockResolvedValueOnce(undefined);

    await cancelarCheckoutPix(req, res);

    expect(CancelarCheckoutPixService.executar).toHaveBeenCalledWith("tesouraria_123", "pag_123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Pagamento cancelado com sucesso." });
  });

  it("deve retornar 404 se pagamento não encontrado", async () => {
    req.params = { id: "pag_123" };
    (CancelarCheckoutPixService.executar as jest.Mock).mockRejectedValueOnce(new Error("PAGAMENTO_NOT_FOUND"));

    await cancelarCheckoutPix(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Pagamento não encontrado." });
  });

  it("deve retornar 400 se o status for inválido para cancelamento", async () => {
    req.params = { id: "pag_123" };
    (CancelarCheckoutPixService.executar as jest.Mock).mockRejectedValueOnce(new Error("STATUS_INVALIDO_CANCELAMENTO"));

    await cancelarCheckoutPix(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "O status atual não permite cancelamento." });
  });

  it("deve retornar 500 se houver erro desconhecido", async () => {
    req.params = { id: "pag_123" };
    (CancelarCheckoutPixService.executar as jest.Mock).mockRejectedValueOnce(new Error("Erro aleatório"));

    await cancelarCheckoutPix(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Erro ao cancelar o pagamento." });
  });
});
