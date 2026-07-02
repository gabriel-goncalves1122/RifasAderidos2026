// ============================================================================
// ARQUIVO: frontend/tests/secretaria/filtrarAderidos.test.ts
// ============================================================================
import { describe, it, expect } from "vitest";

import { filtrarAderidos } from "@/features/secretaria/membros/utils/filtrarAderidos";
import { AderidoSecretaria } from "@/features/secretaria/membros/types/secretariaLocalTypes";

const aderidos: AderidoSecretaria[] = [
  {
    id: "1",
    nome: "Gabriel Silva",
    email: "gabriel@teste.com",
    cargo: "admin",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
  },
  {
    id: "2",
    nome: "Ana Laura",
    email: "ana@teste.com",
    cargo: "aderido",
    status_cadastro: "pendente",
    modalidade_adesao: "meio",
  },
  {
    id: "3",
    nome: "Carlos Souza",
    email: "carlos@teste.com",
    cargo: "aderido",
    status_cadastro: "ativo",
    modalidade_adesao: "completo",
  },
];

describe("filtrarAderidos", () => {
  it("Deve filtrar por busca em nome", () => {
    const resultado = filtrarAderidos(aderidos, {
      busca: "ana",
      modalidade: "todos",
      status: "todos",
      tipoUsuario: "todos",
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe("Ana Laura");
  });

  it("Deve filtrar por modalidade meio-aderido", () => {
    const resultado = filtrarAderidos(aderidos, {
      busca: "",
      modalidade: "meio",
      status: "todos",
      tipoUsuario: "todos",
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].email).toBe("ana@teste.com");
  });

  it("Deve filtrar por status ativo", () => {
    const resultado = filtrarAderidos(aderidos, {
      busca: "",
      modalidade: "todos",
      status: "ativo",
      tipoUsuario: "todos",
    });

    expect(resultado).toHaveLength(2);
  });

  it("Deve filtrar apenas comissão", () => {
    const resultado = filtrarAderidos(aderidos, {
      busca: "",
      modalidade: "todos",
      status: "todos",
      tipoUsuario: "comissao",
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].cargo).toBe("admin");
  });

  it("Deve combinar busca, modalidade e status", () => {
    const resultado = filtrarAderidos(aderidos, {
      busca: "ana",
      modalidade: "meio",
      status: "pendente",
      tipoUsuario: "aderidos",
    });

    expect(resultado).toHaveLength(1);
    expect(resultado[0].nome).toBe("Ana Laura");
  });
});
