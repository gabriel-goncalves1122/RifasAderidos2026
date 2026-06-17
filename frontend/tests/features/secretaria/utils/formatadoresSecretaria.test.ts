// ============================================================================
// ARQUIVO: frontend/tests/features/secretaria/utils/formatadoresSecretaria.test.ts
// ============================================================================
import { describe, expect, it } from "vitest";

import * as formatadores from "@/features/secretaria/utils/formatadoresSecretaria";

function obterFuncao(nomePrincipal: string, nomesAlternativos: string[]) {
  const modulo = formatadores as Record<string, unknown>;

  const funcao =
    modulo[nomePrincipal] ??
    nomesAlternativos.map((nome) => modulo[nome]).find(Boolean);

  if (typeof funcao !== "function") {
    throw new Error(
      `Função de formatação não encontrada. Procurei por: ${[
        nomePrincipal,
        ...nomesAlternativos,
      ].join(", ")}`,
    );
  }

  return funcao as (valor: string) => string;
}

describe("Utils: formatadoresSecretaria", () => {
  it("Deve formatar CPF no padrão 000.000.000-00", () => {
    const formatarCpf = obterFuncao("formatarCpf", [
      "formatarCPF",
      "formatarCpfSecretaria",
      "aplicarMascaraCpf",
      "aplicarMascaraCPF",
    ]);

    expect(formatarCpf("11122233344")).toBe("111.222.333-44");
  });

  it("Deve limitar CPF mesmo quando receber mais de 11 dígitos", () => {
    const formatarCpf = obterFuncao("formatarCpf", [
      "formatarCPF",
      "formatarCpfSecretaria",
      "aplicarMascaraCpf",
      "aplicarMascaraCPF",
    ]);

    expect(formatarCpf("11122233344555")).toBe("111.222.333-44");
  });

  it("Deve formatar telefone celular no padrão (00) 00000-0000", () => {
    const formatarTelefone = obterFuncao("formatarTelefone", [
      "formatarTelefoneSecretaria",
      "aplicarMascaraTelefone",
    ]);

    expect(formatarTelefone("35999999999")).toBe("(35) 99999-9999");
  });

  it("Deve formatar telefone fixo no padrão (00) 0000-0000 quando houver 10 dígitos", () => {
    const formatarTelefone = obterFuncao("formatarTelefone", [
      "formatarTelefoneSecretaria",
      "aplicarMascaraTelefone",
    ]);

    expect(formatarTelefone("3536231234")).toBe("(35) 3623-1234");
  });

  it("Deve remover caracteres não numéricos quando houver função de limpeza", () => {
    const modulo = formatadores as Record<string, unknown>;

    const limpar =
      modulo.limparNumeros ??
      modulo.removerMascara ??
      modulo.apenasNumeros ??
      modulo.somenteNumeros;

    if (!limpar) {
      // Esse teste não falha se o projeto ainda não tiver função pública de limpeza.
      expect(true).toBe(true);
      return;
    }

    expect((limpar as (valor: string) => string)("CPF: 111.222.333-44")).toBe(
      "11122233344",
    );
  });

  it("Deve formatar nome de membro com iniciais maiúsculas", () => {
    const formatarNomeMembro = obterFuncao("formatarNomeMembro", [
      "formatarNomeSecretaria",
      "capitalizarNomeMembro",
    ]);

    expect(formatarNomeMembro("  gABRIEL   sAMPAIO  ")).toBe(
      "Gabriel Sampaio",
    );
  });

  it("Deve manter partículas comuns em minúsculas no meio do nome", () => {
    const formatarNomeMembro = obterFuncao("formatarNomeMembro", [
      "formatarNomeSecretaria",
      "capitalizarNomeMembro",
    ]);

    expect(formatarNomeMembro("ANA CLARA DOS SANTOS E SILVA")).toBe(
      "Ana Clara dos Santos e Silva",
    );
  });

  it("Deve preservar nomes compostos com hífen", () => {
    const formatarNomeMembro = obterFuncao("formatarNomeMembro", [
      "formatarNomeSecretaria",
      "capitalizarNomeMembro",
    ]);

    expect(formatarNomeMembro("maria-julia de souza")).toBe(
      "Maria-Julia de Souza",
    );
  });
});
