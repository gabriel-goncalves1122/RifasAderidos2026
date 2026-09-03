import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { AppError } from "../../../../src/shared/classes/AppError";
import { parseDocumentoSecretariaMultipart } from "../../../../src/modules/admin/secretaria/documentos/documentosSecretariaMultipart";
import Busboy from "busboy";
import { EventEmitter } from "events";

jest.mock("busboy");

describe("parseDocumentoSecretariaMultipart", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {
      headers: {
        "content-type": "multipart/form-data; boundary=something",
      },
      pipe: jest.fn(),
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should throw AppError if content-type is not multipart/form-data", async () => {
    req.headers["content-type"] = "application/json";
    const middleware = parseDocumentoSecretariaMultipart(true);
    await middleware(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.code).toBe("DOCUMENTO_SECRETARIA_MULTIPART_OBRIGATORIO");
  });

  it("should process fields and files correctly", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    const middleware = parseDocumentoSecretariaMultipart(true);

    const promise = middleware(req, res, next);

    busboyInstance.emit("field", "someField", "someValue");

    const fileStream = new EventEmitter() as any;
    busboyInstance.emit("file", "documentoArquivo", fileStream, {
      filename: "test.pdf",
      mimeType: "application/pdf",
    });

    fileStream.emit("data", Buffer.from("hello "));
    fileStream.emit("data", Buffer.from("world"));
    fileStream.emit("end");

    busboyInstance.emit("finish");

    await promise;

    expect(req.body).toEqual({ someField: "someValue" });
    expect(req.documentoArquivo).toEqual({
      buffer: Buffer.from("hello world"),
      nomeArquivo: "test.pdf",
      mimeType: "application/pdf",
      tamanhoBytes: 11,
    });
    expect(next).toHaveBeenCalledWith();
    expect(req.pipe).toHaveBeenCalledWith(busboyInstance);
  });

  it("should handle error event from busboy", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    const middleware = parseDocumentoSecretariaMultipart(true);

    const promise = middleware(req, res, next);

    const testError = new Error("Busboy error");
    busboyInstance.emit("error", testError);

    await promise;

    expect(next).toHaveBeenCalledWith(testError);
  });

  it("should reject when file size limit is reached", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    const middleware = parseDocumentoSecretariaMultipart(true);

    const promise = middleware(req, res, next);

    const fileStream = new EventEmitter() as any;
    busboyInstance.emit("file", "documentoArquivo", fileStream, {
      filename: "test.pdf",
      mimeType: "application/pdf",
    });

    fileStream.emit("limit");
    fileStream.emit("end");
    busboyInstance.emit("finish"); // Even if finish is emitted, the promise is already rejected

    await promise;

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.code).toBe("DOCUMENTO_SECRETARIA_TAMANHO_INVALIDO");
  });

  it("should fail if file is mandatory but not provided", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    const middleware = parseDocumentoSecretariaMultipart(true);

    const promise = middleware(req, res, next);

    busboyInstance.emit("finish");

    await promise;

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = next.mock.calls[0][0];
    expect(error.code).toBe("DOCUMENTO_SECRETARIA_ARQUIVO_OBRIGATORIO");
  });

  it("should pass if file is not mandatory and not provided", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    const middleware = parseDocumentoSecretariaMultipart(false);

    const promise = middleware(req, res, next);

    busboyInstance.emit("finish");

    await promise;

    expect(req.documentoArquivo).toBeUndefined();
    expect(next).toHaveBeenCalledWith();
  });

  it("should write rawBody if provided as Buffer", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    req.rawBody = Buffer.from("raw data");

    const middleware = parseDocumentoSecretariaMultipart(false);

    const promise = middleware(req, res, next);
    busboyInstance.emit("finish");
    await promise;

    expect(busboyInstance.end).toHaveBeenCalledWith(req.rawBody);
    expect(req.pipe).not.toHaveBeenCalled();
  });

  it("should write rawBody if provided as string", async () => {
    const busboyInstance = new EventEmitter() as any;
    busboyInstance.end = jest.fn();
    (Busboy as jest.Mock).mockReturnValue(busboyInstance);

    req.rawBody = "raw data string";

    const middleware = parseDocumentoSecretariaMultipart(false);

    const promise = middleware(req, res, next);
    busboyInstance.emit("finish");
    await promise;

    expect(busboyInstance.end).toHaveBeenCalledWith(Buffer.from("raw data string"));
    expect(req.pipe).not.toHaveBeenCalled();
  });
});
