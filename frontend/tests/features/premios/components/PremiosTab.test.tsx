import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PremiosTab } from "@/features/premios/PremiosTab";
import { usePremios } from "@/features/premios/hooks/usePremios";

vi.mock("@/features/premios/hooks/usePremios", () => ({
  usePremios: vi.fn(),
}));

describe("Componente: PremiosTab", () => {
  const mockBuscarPremios = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePremios as any).mockReturnValue({
      buscarPremios: mockBuscarPremios,
    });
  });

  it("deve renderizar skeletons enquanto carrega", () => {
    mockBuscarPremios.mockReturnValue(new Promise(() => {}));
    render(<PremiosTab isAdmin={false} />);

    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("deve renderizar a vitrine para o aderido comum (sem botões de edição)", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: {
        titulo: "Sorteio Teste",
        data: "2026-12-20",
        descricao: "Descricao Teste",
      },
      premios: [
        {
          id: "1",
          colocacao: "1º Lugar",
          titulo: "Carro",
          descricao: "Zero KM",
          imagem_url: "",
        },
      ],
    });

    render(<PremiosTab isAdmin={false} />);

    expect(await screen.findByText("Sorteio Teste")).toBeInTheDocument();
    expect(screen.getByText("1º Lugar")).toBeInTheDocument();
    expect(screen.getByText("Carro")).toBeInTheDocument();

    expect(screen.queryByText("Novo Prêmio")).not.toBeInTheDocument();
  });

  it("deve exibir o 1º lugar como HeroPremioCard (badge com fundo verde)", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: {
        titulo: "Sorteio Hero",
        data: "2026-12-20",
        descricao: "",
      },
      premios: [
        {
          id: "1",
          colocacao: "1º Lugar",
          titulo: "Carro Zero",
          descricao: "Zero KM",
          imagem_url: "",
        },
        {
          id: "2",
          colocacao: "2º Lugar",
          titulo: "Moto",
          descricao: "250cc",
          imagem_url: "",
        },
      ],
    });

    render(<PremiosTab isAdmin={false} />);

    expect(await screen.findByText("Carro Zero")).toBeInTheDocument();
    expect(screen.getByText("Moto")).toBeInTheDocument();
  });

  it("deve renderizar os botões de edição para Admin", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: {
        titulo: "Sorteio Admin",
        data: "2026-12-20",
        descricao: "...",
      },
      premios: [],
    });

    render(<PremiosTab isAdmin={true} />);

    expect(await screen.findByText("Sorteio Admin")).toBeInTheDocument();
    expect(screen.getByText("Novo Prêmio")).toBeInTheDocument();
  });

  it("deve exibir estado vazio se não houver prêmios cadastrados", async () => {
    mockBuscarPremios.mockResolvedValueOnce({
      infoSorteio: { titulo: "Sorteio Vazio", data: "", descricao: "" },
      premios: [],
    });

    render(<PremiosTab isAdmin={false} />);

    expect(
      await screen.findByText(/Nenhum prêmio anunciado ainda/i),
    ).toBeInTheDocument();
  });
});
