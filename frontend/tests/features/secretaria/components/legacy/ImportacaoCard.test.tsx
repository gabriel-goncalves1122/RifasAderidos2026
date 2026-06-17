// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/components/ImportacaoCard.test.tsx
// ============================================================================
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ImportacaoCard } from "@/features/secretaria/components/legacy/ImportacaoCard";

const mocks = vi.hoisted(() => ({
  solicitarCompactacao: vi.fn(),
}));

vi.mock("@/shared/hooks/useCompactacao", () => ({
  useCompactacao: () => ({
    solicitarCompactacao: mocks.solicitarCompactacao,
    loadingCompactacao: false,
    erroCompactacao: null,
  }),
}));

describe("Componente: ImportacaoCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.solicitarCompactacao.mockResolvedValue(true);
  });

  it("Deve renderizar o card de gestão de dados da Keeper", () => {
    render(<ImportacaoCard onImportar={vi.fn()} />);

    expect(screen.getByText("Gestão de Dados (Keeper)")).toBeInTheDocument();

    expect(
      screen.getByText(
        /faça o upload do csv para injetar aderidos ou descarregue o backup oficial/i,
      ),
    ).toBeInTheDocument();
  });

  it("Deve renderizar as ações de exportar e injetar CSV", () => {
    render(<ImportacaoCard onImportar={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: /exportar dados/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /injetar csv/i }),
    ).toBeInTheDocument();
  });

  it("Deve renderizar o input de arquivo CSV escondido", () => {
    render(<ImportacaoCard onImportar={vi.fn()} />);

    const inputArquivo = document.querySelector(
      'input[type="file"][accept=".csv"]',
    );

    expect(inputArquivo).toBeInTheDocument();
  });

  it("Deve chamar solicitarCompactacao ao clicar em Exportar Dados", async () => {
    const user = userEvent.setup();

    render(<ImportacaoCard onImportar={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /exportar dados/i }));

    await waitFor(() => {
      expect(mocks.solicitarCompactacao).toHaveBeenCalledWith(
        "Backup_Secretaria",
        ["backup_geral"],
      );
    });
  });

  it("Deve chamar onImportar ao selecionar um arquivo CSV válido", async () => {
    const user = userEvent.setup();
    const onImportar = vi.fn().mockResolvedValue(undefined);

    render(<ImportacaoCard onImportar={onImportar} />);

    const inputArquivo = document.querySelector(
      'input[type="file"][accept=".csv"]',
    ) as HTMLInputElement;

    const arquivoCsv = new File(
      ["nome,email\nGabriel,gabriel@email.com"],
      "aderidos.csv",
      {
        type: "text/csv",
      },
    );

    await user.upload(inputArquivo, arquivoCsv);

    await waitFor(() => {
      expect(onImportar).toHaveBeenCalledWith(arquivoCsv);
    });
  });

  it("Deve rejeitar arquivo que não seja CSV", async () => {
    const user = userEvent.setup({
      applyAccept: false,
    });

    const onImportar = vi.fn();

    const alertMock = vi.fn();
    Object.defineProperty(window, "alert", {
      value: alertMock,
      writable: true,
      configurable: true,
    });

    render(<ImportacaoCard onImportar={onImportar} />);

    const inputArquivo = document.querySelector(
      'input[type="file"][accept=".csv"]',
    ) as HTMLInputElement;

    const arquivoInvalido = new File(["conteudo"], "arquivo.txt", {
      type: "text/plain",
    });

    await user.upload(inputArquivo, arquivoInvalido);

    expect(onImportar).not.toHaveBeenCalled();
    expect(alertMock).toHaveBeenCalledWith(
      "Por favor, selecione um ficheiro .csv",
    );
  });
});
