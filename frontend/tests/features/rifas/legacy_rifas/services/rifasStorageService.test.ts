// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/services/rifasStorageService.test.ts
// ============================================================================
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  storage: {},

  usuarioAtual: {
    uid: "user-123",
    email: "gabriel@teste.com",
    getIdToken: vi.fn().mockResolvedValue("TOKEN_TESTE_123456789"),
  },

  ref: vi.fn(),
  uploadBytes: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

vi.mock("@/shared/config/firebase", () => ({
  auth: {
    currentUser: mocks.usuarioAtual,
  },
  storage: mocks.storage,
}));

vi.mock("firebase/storage", () => ({
  ref: mocks.ref,
  uploadBytes: mocks.uploadBytes,
  uploadBytesResumable: mocks.uploadBytesResumable,
  getDownloadURL: mocks.getDownloadURL,
}));

import { rifasStorageService } from "@/features/rifas/services/rifasStorageService";

function criarArquivoMock() {
  return new File(["comprovante"], "comprovante.png", {
    type: "image/png",
  });
}

describe("Service: rifasStorageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.usuarioAtual.getIdToken.mockResolvedValue("TOKEN_TESTE_123456789");

    mocks.ref.mockReturnValue({
      fullPath: "comprovantes/mock.png",
    });

    mocks.uploadBytesResumable.mockResolvedValue({
      ref: {
        fullPath: "comprovantes/mock.png",
        bucket: "bucket-mock",
      },
    });

    mocks.uploadBytes.mockResolvedValue({
      ref: {
        fullPath: "comprovantes_atrasados/mock.png",
      },
    });

    mocks.getDownloadURL.mockResolvedValue(
      "https://storage.mock/comprovante.png",
    );
  });

  it("Deve enviar comprovante com upload resumível e retornar a URL pública", async () => {
    const arquivoMock = criarArquivoMock();

    const resultado = await rifasStorageService.uploadComprovante({
      arquivo: arquivoMock,
      pasta: "comprovantes",
      nomeBase: "venda",
      metadados: {
        tipo: "venda_rifa",
        bilhetesVendidos: "001,002",
      },
    });

    expect(mocks.usuarioAtual.getIdToken).toHaveBeenCalledTimes(1);

    expect(mocks.ref).toHaveBeenCalledWith(
      mocks.storage,
      expect.stringMatching(/^comprovantes\/user-123_venda_\d+\.png$/),
    );

    expect(mocks.uploadBytesResumable).toHaveBeenCalledWith(
      expect.anything(),
      arquivoMock,
      expect.objectContaining({
        contentType: "image/png",
        customMetadata: expect.objectContaining({
          vendedorId: "user-123",
          tipo: "venda_rifa",
          bilhetesVendidos: "001,002",
        }),
      }),
    );

    expect(mocks.getDownloadURL).toHaveBeenCalledWith(
      expect.objectContaining({
        fullPath: "comprovantes/mock.png",
      }),
    );

    expect(resultado).toBe("https://storage.mock/comprovante.png");
  });

  it("Deve enviar comprovante de correção com metadados de correção", async () => {
    const arquivoMock = criarArquivoMock();

    const resultado = await rifasStorageService.uploadComprovante({
      arquivo: arquivoMock,
      pasta: "comprovantes",
      nomeBase: "correcao",
      metadados: {
        tipo: "correcao_tesouraria",
        bilhetesCorrigidos: "003,004",
      },
    });

    expect(mocks.usuarioAtual.getIdToken).toHaveBeenCalledTimes(1);

    expect(mocks.ref).toHaveBeenCalledWith(
      mocks.storage,
      expect.stringMatching(/^comprovantes\/user-123_correcao_\d+\.png$/),
    );

    expect(mocks.uploadBytesResumable).toHaveBeenCalledWith(
      expect.anything(),
      arquivoMock,
      expect.objectContaining({
        contentType: "image/png",
        customMetadata: expect.objectContaining({
          vendedorId: "user-123",
          tipo: "correcao_tesouraria",
          bilhetesCorrigidos: "003,004",
        }),
      }),
    );

    expect(resultado).toBe("https://storage.mock/comprovante.png");
  });

  it("Deve anexar comprovante atrasado e retornar a URL pública", async () => {
    const arquivoMock = criarArquivoMock();

    const resultado = await rifasStorageService.uploadComprovanteAtrasado(
      "RIFA_001",
      arquivoMock,
    );

    expect(mocks.ref).toHaveBeenCalledWith(
      mocks.storage,
      expect.stringMatching(
        /^comprovantes_atrasados\/RIFA_001_user-123_\d+\.png$/,
      ),
    );

    expect(mocks.uploadBytes).toHaveBeenCalledWith(
      expect.anything(),
      arquivoMock,
      expect.objectContaining({
        contentType: "image/png",
        customMetadata: expect.objectContaining({
          vendedorId: "user-123",
          rifaId: "RIFA_001",
        }),
      }),
    );

    expect(mocks.getDownloadURL).toHaveBeenCalledWith(
      expect.objectContaining({
        fullPath: "comprovantes/mock.png",
      }),
    );

    expect(resultado).toBe("https://storage.mock/comprovante.png");
  });
});
