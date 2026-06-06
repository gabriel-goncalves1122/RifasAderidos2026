import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TesourariaPixPage } from "@/features/tesouraria/pages/TesourariaPixPage";

vi.mock("@/features/tesouraria/components/layout/TesourariaShell", () => ({
  TesourariaShell: () => <div>Tesouraria Pix Shell</div>,
}));

describe("Página <TesourariaPixPage />", () => {
  it("Deve renderizar o shell responsivo da tesouraria Pix", () => {
    render(<TesourariaPixPage />);

    expect(screen.getByText("Tesouraria Pix Shell")).toBeInTheDocument();
  });
});
