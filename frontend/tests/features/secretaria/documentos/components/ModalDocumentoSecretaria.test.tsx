import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ModalDocumentoSecretaria } from "@/features/secretaria/documentos/components/shared/ModalDocumentoSecretaria";

describe("<ModalDocumentoSecretaria />", () => {
  it("mostra campos específicos de PDF", () => {
    render(
      <ModalDocumentoSecretaria
        open
        modo="criar"
        tipoCadastro="pdf"
        documento={null}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Data do documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
  });

  it("mostra campos específicos de planilha", () => {
    render(
      <ModalDocumentoSecretaria
        open
        modo="criar"
        tipoCadastro="planilha"
        documento={null}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Período de referência")).toBeInTheDocument();
  });

  it("mostra campos específicos de imagem", () => {
    render(
      <ModalDocumentoSecretaria
        open
        modo="criar"
        tipoCadastro="imagem"
        documento={null}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Texto alternativo")).toBeInTheDocument();
    expect(screen.getByLabelText("Crédito da imagem")).toBeInTheDocument();
  });

  it("envia dados preenchidos", async () => {
    const onSalvar = vi.fn().mockResolvedValue(undefined);
    const arquivo = new File(["conteudo"], "ata-nova.pdf", {
      type: "application/pdf",
    });

    render(
      <ModalDocumentoSecretaria
        open
        modo="criar"
        tipoCadastro="pdf"
        documento={null}
        onClose={vi.fn()}
        onSalvar={onSalvar}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Título/), "Ata nova");
    await userEvent.upload(screen.getByTestId("documento-upload-input"), arquivo);
    await userEvent.click(screen.getByRole("button", { name: "Adicionar documento" }));

    expect(onSalvar).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Ata nova",
        nomeArquivo: "ata-nova.pdf",
        arquivo,
        tipoCadastro: "pdf",
      }),
    );
  });

  it("mantém os dados e mostra erro quando a ingestão falha", async () => {
    const onSalvar = vi.fn().mockRejectedValue(new Error("Upload recusado"));
    const arquivo = new File(["%PDF-arquivo"], "ata.pdf", {
      type: "application/pdf",
    });

    render(
      <ModalDocumentoSecretaria
        open
        modo="criar"
        tipoCadastro="pdf"
        documento={null}
        onClose={vi.fn()}
        onSalvar={onSalvar}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Título/), "Ata preservada");
    await userEvent.upload(screen.getByTestId("documento-upload-input"), arquivo);
    await userEvent.click(screen.getByRole("button", { name: "Adicionar documento" }));

    expect(await screen.findByText("Upload recusado")).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/)).toHaveValue("Ata preservada");
  });
});
