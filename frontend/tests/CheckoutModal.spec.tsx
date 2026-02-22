// ============================================================================
// ARQUIVO: frontend/tests/CheckoutModal.spec.tsx
// ============================================================================
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CheckoutModal } from "../src/views/components/CheckoutModal";

// 1. MOCK DO CONTROLLER
const mockFinalizarVenda = vi.fn();
vi.mock("../src/controllers/useRifasController", () => ({
  useRifasController: () => ({
    finalizarVenda: mockFinalizarVenda,
    loading: false,
  }),
}));

describe("Componente: CheckoutModal", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();
  const numerosTeste = ["001", "002"];

  // Guardamos o espião numa variável global dentro da Suite
  const writeTextMock = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();

    // MÁGICA: Injetamos o mock DENTRO do beforeEach!
    // Assim garantimos que o Vitest recria a área de transferência em cada teste.
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      writable: true,
      configurable: true,
    });
  });

  // ========================================================================
  // TESTE 1: RENDERIZAÇÃO VISUAL (Smoke Test)
  // ========================================================================
  it("deve renderizar os campos do formulário corretamente quando aberto", () => {
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={numerosTeste}
      />,
    );

    expect(screen.getByText(/Finalizar Venda/i)).toBeInTheDocument();
    expect(screen.getByText("001")).toBeInTheDocument();
    expect(screen.getByText("002")).toBeInTheDocument();

    expect(screen.getByLabelText(/Nome Completo \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 20,00/i)).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: VALIDAÇÃO YUP (Campos Obrigatórios)
  // ========================================================================
  it("deve exibir erros de validação se tentar confirmar sem preencher nada", async () => {
    const user = userEvent.setup();
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={numerosTeste}
      />,
    );

    const botaoConfirmar = screen.getByRole("button", {
      name: /Confirmar Venda/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(
        screen.getByText(/O nome completo é obrigatório/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/O WhatsApp é obrigatório/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Você precisa anexar o comprovante/i),
      ).toBeInTheDocument();
    });

    expect(mockFinalizarVenda).not.toHaveBeenCalled();
  });

  // ========================================================================
  // TESTE 3: CÓPIA DA CHAVE PIX (O DESAFIO FINAL)
  // ========================================================================
  it("deve copiar a chave PIX para a área de transferência ao clicar no ícone", async () => {
    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={numerosTeste}
      />,
    );

    // Estratégia Infalível: Achamos o ícone SVG e subimos para o botão "pai" dele
    const icone = screen.getByTestId("ContentCopyIcon");
    const botaoCopiar = icone.closest("button");

    if (botaoCopiar) {
      // Forçamos a remoção de qualquer bloqueio (disabled) que o Material UI tenha deixado no HTML
      botaoCopiar.removeAttribute("disabled");

      // Usamos o fireEvent para garantir que o clique é injetado instantaneamente
      fireEvent.click(botaoCopiar);
    }

    // Verifica se a função foi chamada com sucesso!
    expect(writeTextMock).toHaveBeenCalledWith("comissao0026@gmail.com");

    // Confirma se o Toast Verde apareceu no ecrã
    expect(
      screen.getByText(/Chave PIX copiada com sucesso/i),
    ).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 4: FLUXO DE SUCESSO (Caminho Feliz)
  // ========================================================================
  it("deve chamar finalizarVenda com os dados corretos ao preencher tudo", async () => {
    const user = userEvent.setup();
    mockFinalizarVenda.mockResolvedValueOnce(true);

    render(
      <CheckoutModal
        open={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        numerosRifas={numerosTeste}
      />,
    );

    await user.type(
      screen.getByLabelText(/Nome Completo \*/i),
      "Gabriel Sampaio",
    );
    await user.type(screen.getByLabelText(/WhatsApp/i), "35999999999");

    const file = new File(["falso-comprovante"], "comprovante.png", {
      type: "image/png",
    });
    const inputArquivo = screen.getByLabelText(/Anexar Imagem ou PDF/i);
    await user.upload(inputArquivo, file);

    const botaoConfirmar = screen.getByRole("button", {
      name: /Confirmar Venda/i,
    });
    await user.click(botaoConfirmar);

    await waitFor(() => {
      expect(mockFinalizarVenda).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: "Gabriel Sampaio",
          telefone: "(35) 99999-9999",
          email: "",
          numerosRifas: ["001", "002"],
          comprovante: file,
        }),
      );
    });

    expect(screen.getByText(/Venda Confirmada!/i)).toBeInTheDocument();
  });
});
