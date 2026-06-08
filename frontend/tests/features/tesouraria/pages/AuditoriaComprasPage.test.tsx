import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AuditoriaComprasPage } from "@/features/tesouraria/pages/AuditoriaComprasPage";
import { auditoriaComprasService } from "@/features/tesouraria/services/auditoriaComprasService";

vi.mock("@/features/tesouraria/services/auditoriaComprasService", () => ({
  auditoriaComprasService: {
    buscarHistoricoDetalhado: vi.fn(),
    atualizarComprador: vi.fn(),
    reenviarEmailComprovante: vi.fn(),
  },
}));

const matchMediaOriginal = window.matchMedia;

function simularViewport(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const historicoMock = [
  {
    numero_rifa: "001",
    status: "pago",
    vendedor_id: "aderido_ana",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    data_pagamento: "2026-05-02T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "002",
    status: "pago",
    vendedor_id: "aderido_ana",
    vendedor_nome: "Ana Vendedora",
    vendedor_cpf: "11122233344",
    comprador_id: "comprador_maria",
    comprador_nome: "Maria Souza",
    comprador_email: "maria@teste.com",
    comprador_telefone: "35999990000",
    data_reserva: "2026-05-01T10:00:00.000-03:00",
    data_pagamento: "2026-05-02T10:00:00.000-03:00",
    comprovante_url: "https://storage.mock/comprovante-maria.png",
    valor: 10,
  },
  {
    numero_rifa: "003",
    status: "pendente",
    vendedor_id: "aderido_bruno",
    vendedor_nome: "Bruno Vendedor",
    vendedor_cpf: "55566677788",
    comprador_id: "comprador_joao",
    comprador_nome: "João Lima",
    comprador_email: "joao@teste.com",
    comprador_telefone: "35988887777",
    data_reserva: "2026-05-10T10:00:00.000-03:00",
    data_pagamento: "-",
    comprovante_url: null,
    valor: 10,
  },
];

describe("Página <AuditoriaComprasPage />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    simularViewport(false);

    vi.mocked(
      auditoriaComprasService.buscarHistoricoDetalhado,
    ).mockResolvedValue(historicoMock);
    vi.mocked(auditoriaComprasService.atualizarComprador).mockResolvedValue({
      sucesso: true,
    });
    vi.mocked(
      auditoriaComprasService.reenviarEmailComprovante,
    ).mockResolvedValue({
      sucesso: true,
      mensagem: "E-mail de comprovante reenviado.",
      envio: {
        comprador_id: "comprador_maria",
        email: "maria@teste.com",
        rifas: ["001", "002"],
        status: "aprovado",
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: matchMediaOriginal,
    });
  });

  it("Deve renderizar auditoria, resumo e compras agrupadas", async () => {
    render(<AuditoriaComprasPage />);

    expect(await screen.findByText("Auditoria de compras")).toBeInTheDocument();
    expect(screen.getByText(/sem alterar vínculos da venda/i)).toBeInTheDocument();
    expect(screen.getByText("Compras")).toBeInTheDocument();
    expect(screen.getAllByText("Maria Souza").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rifa 001").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rifa 002").length).toBeGreaterThan(0);
  });

  it("Deve filtrar por busca textual e status", async () => {
    render(<AuditoriaComprasPage />);

    const busca = await screen.findByPlaceholderText(
      /buscar comprador, cpf, e-mail, telefone ou rifa/i,
    );

    fireEvent.change(busca, { target: { value: "003" } });

    expect(screen.getAllByText("João Lima").length).toBeGreaterThan(0);
    expect(screen.queryByText("Maria Souza")).not.toBeInTheDocument();

    fireEvent.change(busca, { target: { value: "" } });
    fireEvent.click(screen.getByText("Pendentes"));

    expect(screen.getAllByText("João Lima").length).toBeGreaterThan(0);
    expect(screen.queryByText("Maria Souza")).not.toBeInTheDocument();
  });

  it("Deve mostrar estado vazio e manter ações futuras desabilitadas", async () => {
    render(<AuditoriaComprasPage />);

    const busca = await screen.findByPlaceholderText(
      /buscar comprador, cpf, e-mail, telefone ou rifa/i,
    );

    fireEvent.change(busca, { target: { value: "compra inexistente" } });

    expect(screen.getByText("Nenhuma compra encontrada")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /exportar csv/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /exportar comprovantes/i }),
    ).toBeDisabled();
  });

  it("Deve renderizar filtros mobile recolhíveis e cards de compra", async () => {
    simularViewport(true);

    render(<AuditoriaComprasPage />);

    expect(await screen.findByPlaceholderText(/buscar compra, rifa ou contato/i))
      .toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /abrir filtros de auditoria/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("João Lima").length).toBeGreaterThan(0);
    expect(screen.queryByText("Sem comprovante")).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /abrir filtros de auditoria/i }),
    );

    expect(screen.getByLabelText("Início")).toBeInTheDocument();
    expect(screen.getByLabelText("Fim")).toBeInTheDocument();
  });

  it("Deve abrir detalhes, editar comprador e visualizar comprovante", async () => {
    const detalhes = render(<AuditoriaComprasPage />);

    await screen.findByText("Auditoria de compras");

    fireEvent.click(screen.getAllByRole("button", { name: /ver detalhes/i })[0]);
    expect(screen.getByText("Detalhes da compra")).toBeInTheDocument();
    expect(screen.queryByText("Campos bloqueados")).not.toBeInTheDocument();

    detalhes.unmount();

    const edicao = render(<AuditoriaComprasPage />);

    await screen.findByText("Auditoria de compras");

    fireEvent.click(screen.getAllByRole("button", { name: /editar comprador/i })[0]);

    expect(screen.getByText("Editar dados do comprador")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /nome do comprador/i }),
    ).toHaveValue("João Lima");
    expect(screen.queryByText("Dados editáveis")).not.toBeInTheDocument();
    expect(screen.queryByText("Campos bloqueados")).not.toBeInTheDocument();

    fireEvent.change(screen.getByRole("textbox", { name: /nome do comprador/i }), {
      target: { value: "João Atualizado" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /e-mail do comprador/i }), {
      target: { value: "joao.atualizado@teste.com" },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /telefone do comprador/i }), {
      target: { value: "35977776666" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar alterações/i }));

    await waitFor(() => {
      expect(auditoriaComprasService.atualizarComprador).toHaveBeenCalledWith(
        "comprador_joao",
        {
          nome: "João Atualizado",
          email: "joao.atualizado@teste.com",
          telefone: "35977776666",
        },
      );
    });

    edicao.unmount();

    render(<AuditoriaComprasPage />);

    await screen.findByText("Auditoria de compras");

    const botaoComprovanteHabilitado = screen
      .getAllByRole("button", { name: /ver comprovante/i })
      .find((botao) => !botao.hasAttribute("disabled"));

    expect(botaoComprovanteHabilitado).toBeDefined();
    fireEvent.click(botaoComprovanteHabilitado!);

    expect(screen.getByAltText("Comprovante Pix")).toBeInTheDocument();
  }, 8000);

  it("Deve reenviar e-mail de comprovante apenas para compra paga com e-mail", async () => {
    let resolverEnvio: (valor: any) => void = () => {};
    vi.mocked(
      auditoriaComprasService.reenviarEmailComprovante,
    ).mockReturnValueOnce(
      new Promise((resolve) => {
        resolverEnvio = resolve;
      }),
    );

    render(<AuditoriaComprasPage />);

    await screen.findByText("Auditoria de compras");

    const botoesEmail = screen.getAllByRole("button", {
      name: /reenviar e-mail/i,
    });
    const botaoHabilitado = botoesEmail.find(
      (botao) => !botao.hasAttribute("disabled"),
    );
    const botoesDesabilitados = botoesEmail.filter((botao) =>
      botao.hasAttribute("disabled"),
    );

    expect(botaoHabilitado).toBeDefined();
    expect(botoesDesabilitados.length).toBeGreaterThan(0);

    fireEvent.click(botaoHabilitado!);

    await waitFor(() => {
      expect(botaoHabilitado).toBeDisabled();
    });
    expect(
      auditoriaComprasService.reenviarEmailComprovante,
    ).toHaveBeenCalledWith("comprador_maria");

    resolverEnvio({
      sucesso: true,
      mensagem: "E-mail de comprovante reenviado.",
      envio: {
        comprador_id: "comprador_maria",
        email: "maria@teste.com",
        rifas: ["001", "002"],
        status: "aprovado",
      },
    });

    expect(
      await screen.findByText("E-mail de comprovante reenviado."),
    ).toBeInTheDocument();
  });
});
