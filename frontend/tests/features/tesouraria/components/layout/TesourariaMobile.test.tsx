import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/tesouraria/pages/TesourariaPage", () => ({
  TesourariaPage: ({ variante }: { variante: "desktop" | "mobile" }) => (
    <div>TesourariaPage variante {variante}</div>
  ),
}));

import { TesourariaMobile } from "@/features/tesouraria/components/layout/TesourariaMobile";

describe("Componente: TesourariaMobile", () => {
  it("Deve renderizar a TesourariaPage em variante mobile", () => {
    render(<TesourariaMobile />);

    expect(screen.getByText("TesourariaPage variante mobile")).toBeInTheDocument();
  });
});
