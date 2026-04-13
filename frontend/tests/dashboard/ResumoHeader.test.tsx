// ============================================================================
// ARQUIVO: frontend/src/views/components/__tests__/ResumoHeader.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResumoHeader } from "../../src/views/components/premios/ResumoHeader";

describe("Componente <ResumoHeader />", () => {
  // ========================================================================
  // TESTE 1: Caminho Feliz (Dados completos)
  // ========================================================================
  it("Deve exibir o nome do usuário, cargo em maiúsculas e valor corretamente", () => {
    // Criamos um "utilizador falso" apenas com o que o componente precisa
    const usuarioMock = {
      displayName: "Gabriel Sampaio",
      cargo: "tesouraria",
    } as any;

    render(<ResumoHeader usuario={usuarioMock} arrecadacao={1500} />);

    // Verifica saudação
    expect(screen.getByText("Olá, Gabriel Sampaio!")).toBeInTheDocument();

    // Verifica se o cargo foi colocado em letras maiúsculas
    expect(screen.getByText("TESOURARIA")).toBeInTheDocument();

    // Verifica a formatação do dinheiro
    expect(screen.getByText("R$ 1500,00")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 2: Fallback de Segurança (Sem dados)
  // ========================================================================
  it("Deve exibir os textos padrão de segurança quando o usuário for null", () => {
    render(<ResumoHeader usuario={null} arrecadacao={0} />);

    // Verifica se o sistema foi simpático e usou o "Engenheiro(a)"
    expect(screen.getByText("Olá, Engenheiro(a)!")).toBeInTheDocument();

    // Verifica se assumiu o cargo mais baixo (Membro) por segurança
    expect(screen.getByText("MEMBRO")).toBeInTheDocument();

    // Verifica o dinheiro zerado
    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
  });

  // ========================================================================
  // TESTE 3: Formatação Matemática
  // ========================================================================
  it("Deve formatar o valor quebrado usando vírgula e duas casas decimais", () => {
    // Mandamos um número quebrado padrão do JavaScript (com ponto)
    render(<ResumoHeader usuario={null} arrecadacao={1234.5} />);

    // O componente deve forçar 2 casas decimais e trocar ponto por vírgula
    expect(screen.getByText("R$ 1234,50")).toBeInTheDocument();
  });
});
