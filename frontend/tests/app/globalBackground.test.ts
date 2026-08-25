import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globalCss = readFileSync(
  resolve(process.cwd(), "src/assets/styles/global.css"),
  "utf8",
);

describe("global.css dashboard background", () => {
  it("Deve manter fundo global como #F6F8F7 para loading e overscroll inferior", () => {
    expect(globalCss).toContain("background-color: #F6F8F7");
    expect(globalCss).toContain("body, html");
    expect(globalCss).toContain("#root");
    expect(globalCss).not.toContain("background-color: #063D31");
  });
});
