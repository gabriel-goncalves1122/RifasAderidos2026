import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/tesouraria/pages/TesourariaPage", () => ({
  TesourariaPage: ({ variante }: { variante: "desktop" | "mobile" }) => (
    <div>TesourariaPage variante {variante}</div>
  ),
}));

import { TesourariaDesktop } from "@/features/tesouraria/components/layout/TesourariaDesktop";

describe("Componente: TesourariaDesktop", () => {
  it("Deve renderizar a TesourariaPage em variante desktop", () => {
    render(<TesourariaDesktop />);

    expect(screen.getByText("TesourariaPage variante desktop")).toBeInTheDocument();
  });
});
