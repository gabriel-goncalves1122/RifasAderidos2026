import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppLoadingScreen } from "@/shared/components/AppLoadingScreen";

describe("AppLoadingScreen", () => {
  it("Deve renderizar carregamento centralizado sobre fundo branco", () => {
    render(<AppLoadingScreen label="Carregando painel" />);

    const tela = screen.getByTestId("app-loading-screen");

    expect(tela).toHaveStyle({
      backgroundColor: "#FFFFFF",
      display: "grid",
      placeItems: "center",
    });
    expect(screen.getByText("Carregando painel")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

