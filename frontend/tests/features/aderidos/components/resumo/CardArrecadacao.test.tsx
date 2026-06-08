// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/CardArrecadacao.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CardArrecadacao } from "@/features/aderidos/components/resumo/CardArrecadacao";

function buscarTextoNormalizado(textoEsperado: string) {
  return screen.getByText((conteudo) => {
    const textoNormalizado = conteudo.replace(/\s/g, " ").trim();

    return textoNormalizado === textoEsperado;
  });
}

describe("Componente: CardArrecadacao", () => {
  it("Deve renderizar o título de arrecadação", () => {
    render(<CardArrecadacao valorArrecadado={0} />);

    expect(screen.getByText("Arrecadado")).toBeInTheDocument();
  });

  it("Deve renderizar o valor arrecadado formatado em reais", () => {
    render(<CardArrecadacao valorArrecadado={150} />);

    expect(buscarTextoNormalizado("R$ 150,00")).toBeInTheDocument();
  });

  it("Deve renderizar R$ 0,00 quando o valor arrecadado for zero", () => {
    render(<CardArrecadacao valorArrecadado={0} />);

    expect(buscarTextoNormalizado("R$ 0,00")).toBeInTheDocument();
  });

  it("Deve renderizar a microcopy do valor confirmado", () => {
    render(<CardArrecadacao valorArrecadado={250} />);

    expect(
      screen.getByText("Confirmado nas vendas aprovadas."),
    ).toBeInTheDocument();
  });
});
