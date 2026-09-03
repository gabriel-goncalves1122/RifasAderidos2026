import { describe, expect, it } from "vitest";

import {
  filtrarDocumentosSecretaria,
  formatarTamanhoArquivo,
  obterTipoPreviewDocumento,
  obterUrlVisualizacaoSegura,
} from "@/features/secretaria/documentos/utils/documentosSecretariaUtils";
import type { DocumentoComissao } from "@/features/secretaria/documentos/types/documentosSecretariaTypes";

const documentos: DocumentoComissao[] = [
  {
    id: "1",
    titulo: "Ata Ordinária",
    area: "Secretaria",
    tipo: "ata",
    nomeArquivo: "ata.pdf",
    mimeType: "application/pdf",
    tamanhoBytes: 2048,
    storagePath: "documentos_secretaria/secretaria/ata/ata.pdf",
    criadoEm: "2026-06-01T00:00:00.000Z",
    atualizadoEm: "2026-06-01T00:00:00.000Z",
    autorNome: "Maria",
    urlVisualizacao: "https://example.com/ata.pdf",
  },
  {
    id: "2",
    titulo: "Contrato Legal",
    area: "Jurídico e contratos",
    tipo: "contrato",
    nomeArquivo: "contrato.pdf",
    mimeType: "application/pdf",
    tamanhoBytes: 4096,
    storagePath: "documentos_secretaria/juridico/contrato/contrato.pdf",
    criadoEm: "2026-06-01T00:00:00.000Z",
    atualizadoEm: "2026-06-01T00:00:00.000Z",
    autorNome: "João",
    urlVisualizacao: "https://example.com/contrato.pdf",
  },
];

describe("documentosSecretariaUtils", () => {
  it("filtra por área e busca textual", () => {
    expect(
      filtrarDocumentosSecretaria(documentos, {
        area: "Jurídico e contratos",
        busca: "legal",
      }),
    ).toHaveLength(1);
  });

  it("formata tamanho de arquivo", () => {
    expect(formatarTamanhoArquivo(2048)).toBe("2 KB");
  });

  it("identifica tipos de preview", () => {
    expect(obterTipoPreviewDocumento("application/pdf")).toBe("pdf");
    expect(obterTipoPreviewDocumento("image/png")).toBe("imagem");
    expect(obterTipoPreviewDocumento("application/zip")).toBe("indisponivel");
  });

  it("bloqueia protocolos inseguros em URLs de visualização", () => {
    expect(obterUrlVisualizacaoSegura("javascript:alert(1)")).toBeNull();
    expect(obterUrlVisualizacaoSegura("https://example.com/arquivo.pdf")).toBe(
      "https://example.com/arquivo.pdf",
    );
  });
});
