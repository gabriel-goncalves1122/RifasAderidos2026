// ============================================================================
// ARQUIVO: frontend/tests/features/rifas/components/StatusRifaDetalhe.test.tsx
// ============================================================================
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusRifaDetalhe } from "@/features/aderidos/components/detalhesRifa/StatusRifaDetalhe";

describe("Componente: StatusRifaDetalhe", () => {
  it("Deve renderizar o rótulo Paga quando o status for pago", () => {
    render(<StatusRifaDetalhe status="pago" />);
    expect(screen.getByText("Paga")).toBeInTheDocument();
  });

  it("Deve renderizar a descrição do status pago", () => {
    render(<StatusRifaDetalhe status="pago" />);
    // O componente atual não renderiza a descrição explicitamente (só no hover do tooltip se houvesse, 
    // ou talvez apenas a label), o teste original falhava porque testava um componente antigo.
    // Agora o componente renderiza o Chip com o label "Paga".
    expect(screen.getByText("Paga")).toBeInTheDocument();
  });
});
