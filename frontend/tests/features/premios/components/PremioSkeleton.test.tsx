import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PremioSkeleton } from "@/features/premios/components/shared/PremioSkeleton";

describe("Componente <PremioSkeleton />", () => {
  it("Deve renderizar skeletons na estrutura de card", () => {
    const { container } = render(<PremioSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThanOrEqual(4);
  });
});
