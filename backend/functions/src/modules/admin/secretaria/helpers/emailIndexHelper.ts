import { createHash } from "crypto";

export function gerarIdIndiceEmailSecretaria(emailNormalizado: string): string {
  return createHash("sha256").update(emailNormalizado).digest("hex");
}
