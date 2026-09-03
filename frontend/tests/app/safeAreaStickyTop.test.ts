import { describe, expect, it } from "vitest";

import { safeAreaStickyTop } from "@/shared/tokens/safeArea";

describe("safeAreaStickyTop", () => {
  it("Deve deslocar stickies pelo topo seguro sem criar espaço no fluxo", () => {
    expect(safeAreaStickyTop).toMatchObject({
      top: "env(safe-area-inset-top, 0px)",
      "@supports (-webkit-touch-callout: none)": {
        top: "max(env(safe-area-inset-top), 20px)",
      },
    });

    expect(safeAreaStickyTop).not.toHaveProperty("mt");
    expect(safeAreaStickyTop).not.toHaveProperty("marginTop");
    expect(safeAreaStickyTop).not.toHaveProperty("pt");
    expect(safeAreaStickyTop).not.toHaveProperty("paddingTop");
  });
});

