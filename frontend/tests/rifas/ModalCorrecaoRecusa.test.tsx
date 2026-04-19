// ============================================================================
// ARQUIVO: frontend/tests/aderidos/ModalCorrecaoRecusa.test.tsx
// ============================================================================
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ModalCorrecaoRecusa } from "../../src/views/components/aderidos/ModalCorrecaoRecusa";

describe("Componente: ModalCorrecaoRecusa", () => {
  const mockOnClose = vi.fn();
  const mockOnReenviar = vi.fn().mockResolvedValue(undefined);

  const mockGrupoRecusado = {
    comprador: "João Silva",
    email: "joao@email.com",
    telefone: "11987654321", // Sem máscara, para testar se o useEffect formata
    motivo: "Comprovativo ilegível ou cortado.",
    bilhetes: ["015", "016"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Não deve renderizar nada se o grupoRecusado for nulo", () => {
    const { container } = render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={null}
        onReenviar={mockOnReenviar}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("Deve renderizar os dados iniciais e aplicar a máscara ao telefone antigo", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onReenviar={mockOnReenviar}
      />,
    );

    // Verifica se os campos foram preenchidos corretamente
    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(screen.getByDisplayValue("joao@email.com")).toBeInTheDocument();

    // Verifica se o telefone que era '11987654321' ganhou a máscara automaticamente
    expect(screen.getByDisplayValue("(11) 98765-4321")).toBeInTheDocument();

    // Verifica os avisos na interface
    expect(
      screen.getByText(/Comprovativo ilegível ou cortado/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/015, 016/i)).toBeInTheDocument();
  });

  it("Deve aplicar a formatação do telefone enquanto o utilizador digita", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        // Passamos um grupo sem telefone para simular a digitação do zero
        grupoRecusado={{ ...mockGrupoRecusado, telefone: "" }}
        onReenviar={mockOnReenviar}
      />,
    );

    // Procura o input pelo placeholder ou pela Label
    const inputTelefone = screen.getByLabelText(
      /Telefone do Comprador/i,
    ) as HTMLInputElement;

    // Simula o utilizador a digitar tudo seguido
    fireEvent.change(inputTelefone, { target: { value: "21912345678" } });

    // O valor deve ter sido formatado pela função interna
    expect(inputTelefone.value).toBe("(21) 91234-5678");
  });

  it("Deve manter o botão de submissão desativado até que um ficheiro seja anexado", () => {
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onReenviar={mockOnReenviar}
      />,
    );

    const btnSubmit = screen.getByRole("button", {
      name: /Reenviar para Análise/i,
    });
    expect(btnSubmit).toBeDisabled(); // Não há ficheiro, deve estar desativado
  });

  it("Deve permitir anexar um ficheiro e submeter os dados corretamente", async () => {
    // Pode remover o { container } daqui do render, pois não vamos usá-arlo mais
    render(
      <ModalCorrecaoRecusa
        open={true}
        onClose={mockOnClose}
        grupoRecusado={mockGrupoRecusado}
        onReenviar={mockOnReenviar}
      />,
    );

    // 1. Simula a criação de um ficheiro de imagem falso
    const ficheiroFalso = new File(["(conteudo binario)"], "recibo_novo.png", {
      type: "image/png",
    });

    // 2. CORREÇÃO: Procura no 'document' inteiro, pois o Modal é desenhado num Portal fora do container!
    const inputFicheiro = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    expect(inputFicheiro).toBeInTheDocument();

    // 3. Simula o upload do ficheiro
    fireEvent.change(inputFicheiro, { target: { files: [ficheiroFalso] } });

    // 4. Verifica se o nome do ficheiro apareceu na interface e o botão ativou
    expect(screen.getByText(/Anexado: recibo_novo.png/i)).toBeInTheDocument();
    const btnSubmit = screen.getByRole("button", {
      name: /Reenviar para Análise/i,
    });
    expect(btnSubmit).not.toBeDisabled();

    // 5. Clica em enviar
    fireEvent.click(btnSubmit);

    // 6. Aguarda a resolução e verifica se a função onReenviar recebeu tudo formatado
    await waitFor(() => {
      expect(mockOnReenviar).toHaveBeenCalledTimes(1);
      expect(mockOnReenviar).toHaveBeenCalledWith(
        ["015", "016"], // Array de bilhetes
        ficheiroFalso, // O ficheiro anexado
        {
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "(11) 98765-4321", // O telefone formatado
        },
      );

      // O modal deve fechar automaticamente após o sucesso
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
