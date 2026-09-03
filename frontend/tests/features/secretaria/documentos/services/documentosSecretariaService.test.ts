import { beforeEach, describe, expect, it, vi } from "vitest";

import { documentosSecretariaService } from "@/features/secretaria/documentos/services/documentosSecretariaService";

const serviceMocks = vi.hoisted(() => ({
  fetchAPI: vi.fn(),
}));

vi.mock("@/shared/services/api", () => ({
  fetchAPI: serviceMocks.fetchAPI,
}));

describe("documentosSecretariaService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lista documentos via backend", async () => {
    serviceMocks.fetchAPI.mockResolvedValueOnce([
      {
        id: "doc-1",
        titulo: "Ata",
        area: "Secretaria",
        tipo: "ata",
        nomeArquivo: "ata.pdf",
        mimeType: "application/pdf",
        tamanhoBytes: 100,
        storagePath: "documentos_secretaria/secretaria/ata/ata.pdf",
        criadoEm: "2026-06-01T00:00:00.000Z",
        atualizadoEm: "2026-06-01T00:00:00.000Z",
        autorNome: "Secretaria",
        urlVisualizacao: "https://example.com/ata.pdf",
      },
    ]);

    const documentos = await documentosSecretariaService.listarDocumentos();

    expect(serviceMocks.fetchAPI).toHaveBeenCalledWith("/admin/documentos");
    expect(documentos[0].titulo).toBe("Ata");
  });

  it("faz upload e cria metadados do documento", async () => {
    const arquivo = new File(["conteudo"], "ata.pdf", {
      type: "application/pdf",
    });

    serviceMocks.fetchAPI.mockResolvedValueOnce({
      sucesso: true,
      documento: { id: "doc-1", titulo: "Ata" },
    });

    await documentosSecretariaService.criarDocumento({
      titulo: "Ata",
      area: "Secretaria",
      tipo: "ata",
      nomeArquivo: "ata.pdf",
      mimeType: "application/pdf",
      tamanhoBytes: 7,
      tipoCadastro: "pdf",
      arquivo,
      dataDocumento: "",
      descricao: "",
      periodoReferencia: "",
      textoAlternativo: "",
      creditoImagem: "",
    });

    expect(serviceMocks.fetchAPI).toHaveBeenCalledWith(
      "/admin/documentos",
      "POST",
      expect.any(FormData),
    );

    const formulario = serviceMocks.fetchAPI.mock.calls[0][2] as FormData;
    expect(formulario.get("titulo")).toBe("Ata");
    expect((formulario.get("arquivo") as File).name).toBe("ata.pdf");
    expect(formulario.get("storagePath")).toBeNull();
    expect(formulario.get("autorNome")).toBeNull();
  });

  it("baixa conteúdo protegido como blob", async () => {
    const blob = new Blob(["pdf"], { type: "application/pdf" });
    serviceMocks.fetchAPI.mockResolvedValueOnce(blob);

    const resposta = await documentosSecretariaService.baixarConteudo("doc-1");

    expect(serviceMocks.fetchAPI).toHaveBeenCalledWith(
      "/admin/documentos/doc-1/conteudo",
      "GET",
      undefined,
      true,
      "blob",
    );
    expect(resposta).toBe(blob);
  });
});
