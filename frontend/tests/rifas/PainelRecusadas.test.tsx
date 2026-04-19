// ============================================================================
// ARQUIVO: frontend/tests/aderidos/PainelRecusadas.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PainelRecusadas } from "../../src/views/components/aderidos/PainelRecusado";

describe("Componente: PainelRecusadas", () => {
  const mockRifasRecusadas = [
    { numero: "010", comprador_nome: "Maria", motivo_recusa: "Falso" },
    { numero: "011", comprador_nome: "Maria", motivo_recusa: "Falso" },
    { numero: "020", comprador_nome: "João", motivo_recusa: "Ilegível" },
  ];

  it("Não deve renderizar nada se a lista estiver vazia", () => {
    const { container } = render(
      <PainelRecusadas rifasRecusadas={[]} onLiberarRifas={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("Deve agrupar e exibir as rifas pelos compradores e mostrar os chips", () => {
    render(
      <PainelRecusadas
        rifasRecusadas={mockRifasRecusadas}
        onLiberarRifas={vi.fn()}
      />,
    );

    // Deve mostrar os nomes dos dois compradores
    expect(screen.getByText("Maria")).toBeInTheDocument();
    expect(screen.getByText("João")).toBeInTheDocument();

    // Deve mostrar os motivos
    expect(screen.getByText(/Motivo: Falso/i)).toBeInTheDocument();
    expect(screen.getByText(/Motivo: Ilegível/i)).toBeInTheDocument();

    // Deve mostrar os chips com os números
    expect(screen.getByText("010")).toBeInTheDocument();
    expect(screen.getByText("011")).toBeInTheDocument();
    expect(screen.getByText("020")).toBeInTheDocument();
  });

  it("Deve chamar onLiberarRifas enviando o array com todos os bilhetes daquele grupo", () => {
    const mockLiberar = vi.fn();
    render(
      <PainelRecusadas
        rifasRecusadas={mockRifasRecusadas}
        onLiberarRifas={mockLiberar}
      />,
    );

    // Vai haver dois botões "Limpar e Liberar Rifas" (um para a Maria, um para o João)
    const botoesLiberar = screen.getAllByRole("button", {
      name: /Limpar e Liberar Rifas/i,
    });

    // Clica no botão correspondente à Maria
    fireEvent.click(botoesLiberar[0]);

    // Tem de enviar as duas rifas da Maria
    expect(mockLiberar).toHaveBeenCalledWith(["010", "011"]);
  });
});
