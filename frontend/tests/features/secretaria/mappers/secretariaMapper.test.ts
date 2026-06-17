// ============================================================================
// ARQUIVO: frontend/tests/secretaria/secretariaMapper.test.ts
// ============================================================================
import { describe, it, expect } from "vitest";

import { normalizarAderidoSecretaria } from "@/features/secretaria/mappers/secretariaMapper";

describe("normalizarAderidoSecretaria", () => {
  it("Deve normalizar documento antigo com status Aderido como ativo", () => {
    const resultado = normalizarAderidoSecretaria("ADERIDO_001", {
      status: "Aderido",
      email: "antigo@teste.com",
      nome: "Aderido Antigo",
      cargo: "admin",
    });

    expect(resultado.id).toBe("ADERIDO_001");
    expect(resultado.id_aderido).toBe("ADERIDO_001");
    expect(resultado.status_cadastro).toBe("ativo");
    expect(resultado.modalidade_adesao).toBe("completo");
  });

  it("Deve normalizar documento novo com modalidade meio", () => {
    const resultado = normalizarAderidoSecretaria("ADERIDO_139", {
      id_aderido: "ADERIDO_139",
      email: "novo@teste.com",
      uid: null,
      status: "pendente",
      modalidade_adesao: "meio",
      faixa_rifas: {
        inicio: "16560",
        fim: "16679",
      },
    });

    expect(resultado.id).toBe("ADERIDO_139");
    expect(resultado.status_cadastro).toBe("pendente");
    expect(resultado.modalidade_adesao).toBe("meio");
    expect(resultado.faixa_rifas?.inicio).toBe("16560");
  });

  it("Deve usar email legado quando o campo vier como E-mail", () => {
    const resultado = normalizarAderidoSecretaria("DOC_001", {
      "E-mail": "legado@teste.com",
      Cargo: "secretaria",
      uid: "abc",
    });

    expect(resultado.email).toBe("legado@teste.com");
    expect(resultado.cargo).toBe("secretaria");
    expect(resultado.status_cadastro).toBe("ativo");
  });

  it("Deve normalizar nome legado para exibição consistente", () => {
    const resultado = normalizarAderidoSecretaria("DOC_002", {
      Nome: "  ANA   CLARA DOS sANTOS ",
      email: "ana@teste.com",
      uid: "abc",
    });

    expect(resultado.nome).toBe("Ana Clara dos Santos");
  });
});
