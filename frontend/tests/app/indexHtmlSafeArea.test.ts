import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const indexHtml = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

describe("index.html safe area mobile", () => {
  it("Deve permitir que o app pinte a safe area no iPhone", () => {
    expect(indexHtml).toContain(
      'name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"',
    );
  });

  it("Deve declarar a cor mobile do header e status bar translúcida", () => {
    expect(indexHtml).toContain('name="theme-color" content="#063D31"');
    expect(indexHtml).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(indexHtml).toContain(
      'name="apple-mobile-web-app-status-bar-style" content="black-translucent"',
    );
  });
});
