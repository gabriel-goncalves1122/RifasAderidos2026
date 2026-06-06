import { describe, it } from "vitest";

describe.skip("Fluxo legado <AuditoriaTable />", () => {
  it("foi desconectado do dashboard atual e preservado apenas como referência histórica", () => {
    // A antiga tela IA/OCR de AuditoriaTable não possui mais componente ativo.
    // Os componentes reaproveitáveis do legado continuam cobertos pelos testes
    // CardAuditoriaIA, ModalInspecaoIA, ModalRelatorioIA e AuditoriaCard.
  });
});
