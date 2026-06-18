import { describe, expect, it } from "vitest";

import { dashboardHeaderStyles } from "@/views/components/dashboard/dashboardHeaderStyles";

describe("DashboardHeader safe area", () => {
  it("Deve manter underlay fixo e spacer verde para a status bar do iPhone", () => {
    expect(dashboardHeaderStyles.appBar).toMatchObject({
      position: "relative",
      zIndex: 1200,
      bgcolor: "#063D31",
    });

    expect(dashboardHeaderStyles).not.toHaveProperty("topOverscrollBackdrop");

    expect(dashboardHeaderStyles.statusBarUnderlay).toMatchObject({
      position: "fixed",
      top: 0,
      height: "env(safe-area-inset-top, 0px)",
      zIndex: 1301,
      bgcolor: "#063D31",
      pointerEvents: "none",
      "@supports (-webkit-touch-callout: none)": {
        height: "max(env(safe-area-inset-top), 20px)",
        minHeight: 20,
      },
    });

    expect(dashboardHeaderStyles.statusBarSpacer).toMatchObject({
      height: "env(safe-area-inset-top, 0px)",
      bgcolor: "#063D31",
    });

    expect(dashboardHeaderStyles.toolbar).toMatchObject({
      minHeight: { xs: 62, sm: 68 },
    });
  });
});
