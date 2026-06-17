// ============================================================================
// ARQUIVO: frontend/tests/secretaria/ModalidadeChip.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ModalidadeChip } from "@/features/secretaria/components/shared/ModalidadeChip";

describe("Componente <ModalidadeChip />", () => {
  it("Deve mostrar 'Aderido' quando a modalidade for completo", () => {
    render(<ModalidadeChip modalidade="completo" />);

    expect(screen.getByText("Aderido")).toBeInTheDocument();
  });

  it("Deve mostrar 'Meio-aderido' quando a modalidade for meio", () => {
    render(<ModalidadeChip modalidade="meio" />);

    expect(screen.getByText("Meio-aderido")).toBeInTheDocument();
  });

  it("Deve tratar modalidade indefinida como aderido completo", () => {
    render(<ModalidadeChip />);

    // Mantém compatibilidade com registros antigos que ainda não possuem modalidade_adesao.
    expect(screen.getByText("Aderido")).toBeInTheDocument();
  });

  it("Deve tratar modalidade nula como aderido completo", () => {
    render(<ModalidadeChip modalidade={null} />);

    // Garante que dados incompletos do Firestore não quebrem a visualização.
    expect(screen.getByText("Aderido")).toBeInTheDocument();
  });

  it("Deve renderizar o ícone de grupo para aderido completo", () => {
    render(<ModalidadeChip modalidade="completo" />);

    expect(screen.getByTestId("GroupsIcon")).toBeInTheDocument();
  });

  it("Deve renderizar o ícone de pessoa para meio-aderido", () => {
    render(<ModalidadeChip modalidade="meio" />);

    expect(screen.getByTestId("PersonIcon")).toBeInTheDocument();
  });
});
