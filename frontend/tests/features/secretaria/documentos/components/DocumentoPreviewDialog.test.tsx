import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { DocumentoPreviewDialog } from "@/features/secretaria/documentos/components/shared/DocumentoPreviewDialog";
import type { DocumentoComissao } from "@/features/secretaria/documentos/types/documentosSecretariaTypes";

const documentoPdf: DocumentoComissao = {
  id: "pdf",
  titulo: "Ata da reunião",
  area: "Secretaria",
  tipo: "ata",
  nomeArquivo: "ata.pdf",
  mimeType: "application/pdf",
  tamanhoBytes: 1024,
  storagePath: "documentos_secretaria/secretaria/ata/ata.pdf",
  criadoEm: "2026-06-01T00:00:00.000Z",
  atualizadoEm: "2026-06-01T00:00:00.000Z",
  autorNome: "Secretaria",
  urlVisualizacao: "https://example.com/ata.pdf",
};

describe("<DocumentoPreviewDialog />", () => {
  beforeEach(() => {
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  it("renderiza PDF em iframe", () => {
    render(
      <DocumentoPreviewDialog
        open
        documento={documentoPdf}
        url="https://example.com/ata.pdf"
        loading={false}
        erro={null}
        onClose={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    expect(screen.getByTitle("Pré-visualização de Ata da reunião")).toHaveAttribute(
      "src",
      "https://example.com/ata.pdf",
    );
  });

  it("renderiza imagem em img", () => {
    render(
      <DocumentoPreviewDialog
        open
        documento={{
          ...documentoPdf,
          id: "imagem",
          titulo: "Peça de divulgação",
          mimeType: "image/png",
          urlVisualizacao: "https://example.com/imagem.png",
        }}
        url="https://example.com/imagem.png"
        loading={false}
        erro={null}
        onClose={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    expect(
      screen.getByAltText("Pré-visualização de Peça de divulgação"),
    ).toHaveAttribute("src", "https://example.com/imagem.png");
  });

  it("mostra indisponível para arquivo sem preview e abre URL segura", async () => {
    render(
      <DocumentoPreviewDialog
        open
        documento={{
          ...documentoPdf,
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }}
        url="https://example.com/ata.pdf"
        loading={false}
        erro={null}
        onClose={vi.fn()}
        onEditar={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Pré-visualização indisponível para este tipo de arquivo."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Abrir arquivo/i }));

    expect(window.open).toHaveBeenCalledWith(
      "https://example.com/ata.pdf",
      "_blank",
      "noopener,noreferrer",
    );
  });
});
