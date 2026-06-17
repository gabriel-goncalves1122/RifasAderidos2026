import { useMemo, useState } from "react";

import type { AderidoSecretaria } from "../types";
import type { SortDir } from "../types";

function compararValores(a: unknown, b: unknown, dir: SortDir): number {
  const va = a ?? "";
  const vb = b ?? "";
  const cmp =
    typeof va === "number" && typeof vb === "number"
      ? va - vb
      : String(va).localeCompare(String(vb), "pt-BR", { sensitivity: "base" });
  return dir === "asc" ? cmp : -cmp;
}

function obterNomeOrdenacao(aderido: AderidoSecretaria): string {
  return aderido.nome || aderido.email || "";
}

function compararAtivosPrimeiro(
  a: AderidoSecretaria,
  b: AderidoSecretaria,
): number {
  const aAtivo = a.status_cadastro === "ativo" ? 0 : 1;
  const bAtivo = b.status_cadastro === "ativo" ? 0 : 1;

  return aAtivo - bAtivo;
}

function compararNome(a: AderidoSecretaria, b: AderidoSecretaria): number {
  return obterNomeOrdenacao(a).localeCompare(obterNomeOrdenacao(b), "pt-BR", {
    sensitivity: "base",
  });
}

const COLUNA_CHAVE: Record<string, keyof AderidoSecretaria> = {
  nome: "nome",
  email: "email",
  modalidade: "modalidade_adesao",
  cargo: "cargo",
  status: "status_cadastro",
};

export function useSecretariaSort(aderidos: AderidoSecretaria[]) {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (coluna: string) => {
    if (sortBy === coluna) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(coluna);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const baseOrdenada = [...aderidos].sort((a, b) => {
      const prioridadeStatus = compararAtivosPrimeiro(a, b);
      if (prioridadeStatus !== 0) return prioridadeStatus;

      if (!sortBy) return compararNome(a, b);

      const chave = COLUNA_CHAVE[sortBy];
      if (!chave) return compararNome(a, b);

      const comparacaoColuna = compararValores(a[chave], b[chave], sortDir);
      if (comparacaoColuna !== 0) return comparacaoColuna;

      return compararNome(a, b);
    });

    return baseOrdenada;
  }, [aderidos, sortBy, sortDir]);

  return { sorted, sortBy, sortDir, toggleSort };
}
