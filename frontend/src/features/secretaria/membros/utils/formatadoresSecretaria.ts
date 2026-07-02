// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/membros/utils/formatadoresSecretaria.ts
// ============================================================================
import {
  formatarTelefone as formatarTelefoneCompartilhado,
  somenteNumeros as somenteNumerosCompartilhado,
} from "@/shared/utils/formatadores";

export function somenteNumeros(valor?: string | number | null): string {
  return somenteNumerosCompartilhado(String(valor || ""));
}

const PARTICULAS_NOME = new Set(["da", "das", "de", "do", "dos", "e"]);

function capitalizarParteNome(parte: string): string {
  if (!parte) return parte;

  return parte
    .split("-")
    .map((segmento) => {
      if (!segmento) return segmento;
      return `${segmento.charAt(0).toLocaleUpperCase("pt-BR")}${segmento
        .slice(1)
        .toLocaleLowerCase("pt-BR")}`;
    })
    .join("-");
}

export function formatarNomeMembro(valor?: string | null): string {
  const nome = String(valor || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");

  if (!nome) return "";

  return nome
    .split(" ")
    .map((parte, index) => {
      if (index > 0 && PARTICULAS_NOME.has(parte)) return parte;
      return capitalizarParteNome(parte);
    })
    .join(" ");
}

export function formatarTelefone(valor?: string | number | null): string {
  return formatarTelefoneCompartilhado(String(valor || ""));
}

export function formatarCpf(valor?: string | number | null): string {
  const numeros = somenteNumeros(valor).slice(0, 11);

  if (!numeros) return "";
  if (numeros.length <= 3) return numeros;
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
  if (numeros.length <= 9) {
    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
  }

  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`;
}
