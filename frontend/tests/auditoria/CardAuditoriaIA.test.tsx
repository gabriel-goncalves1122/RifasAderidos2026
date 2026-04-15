// ============================================================================
// ARQUIVO: frontend/tests/auditoria/CardAuditoriaIA.test.tsx
// ============================================================================
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CardAuditoriaIA } from "../../src/views/components/tesouraria/CardAuditoriaIA";
import { TransacaoAgrupada } from "../../src/views/components/tesouraria/AuditoriaTable";

describe("Componente <CardAuditoriaIA />", () => {
  const mockOnMotivoChange = vi.fn();
  const mockOnInspecionar = vi.fn();
  const mockOnRecusar = vi.fn();

  const transacaoDivergente: TransacaoAgrupada = {
    comprovante_url: "http://pix.com/2",
    vendedor_cpf: "222.222.222-22",
    vendedor_nome: "Vendedor B",
    comprador_nome: "Comprador B",
    data_reserva: "2026-05-10T11:00:00Z",
    bilhetes: ["002", "003"],
    valor_total: 20,
    ia_resultado: "DIVERGENTE",
    ia_mensagem:
      "⚠️ Divergência: Banco [ITAU] - ID ILEGÍVEL | lido Titular: DESCONHECIDO",
  };

  const dadosExtraidosMock = {
    mensagemBruta: "Banco [ITAU] - ID ILEGÍVEL | lido Titular: DESCONHECIDO",
    banco: "ITAU",
    idTransacao: "ILEGÍVEL",
    titularLido: "DESCONHECIDO",
  };

  it("Deve renderizar os dados extraídos nos blocos informativos", () => {
    render(
      <CardAuditoriaIA
        transacao={transacaoDivergente}
        sucesso={false}
        dadosExtraidos={dadosExtraidosMock}
        motivo=""
        onMotivoChange={mockOnMotivoChange}
        onInspecionar={mockOnInspecionar}
        onRecusar={mockOnRecusar}
      />,
    );
    // Usamos getAllByText para evitar falhas se a string aparecer em mais de um lugar na tela (ex: no alerta e no card)
    expect(screen.getAllByText(/ITAU/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ILEGÍVEL/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/DESCONHECIDO/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vendedor B/i).length).toBeGreaterThan(0);
  });

  it("Deve acionar a recusa e a mudança de motivo corretamente", () => {
    render(
      <CardAuditoriaIA
        transacao={transacaoDivergente}
        sucesso={false}
        dadosExtraidos={dadosExtraidosMock}
        motivo=""
        onMotivoChange={mockOnMotivoChange}
        onInspecionar={mockOnInspecionar}
        onRecusar={mockOnRecusar}
      />,
    );

    const inputMotivo = screen.getByPlaceholderText(/Ex: ID Divergente/i);
    fireEvent.change(inputMotivo, { target: { value: "Fraude" } });
    expect(mockOnMotivoChange).toHaveBeenCalledWith("Fraude");

    const btnRecusar = screen.getByRole("button", { name: /Recusar/i });
    fireEvent.click(btnRecusar);
    expect(mockOnRecusar).toHaveBeenCalledTimes(1);
  });
});
