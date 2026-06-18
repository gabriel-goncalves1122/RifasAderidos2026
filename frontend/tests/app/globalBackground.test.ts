import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalCss = readFileSync(
  resolve(process.cwd(), "src/assets/styles/global.css"),
  "utf8",
);

describe("global.css dashboard background", () => {
  it("Deve manter fundo global branco para loading e overscroll inferior", () => {
    expect(globalCss).toContain("background-color: #FFFFFF");
    expect(globalCss).toContain("body, html");
    expect(globalCss).toContain("#root");
    expect(globalCss).not.toContain("background-color: #063D31");
  });
});
