export function somenteNumeros(valor?: string | null) {
  return String(valor || "").replace(/\D/g, "");
}

export function formatarCpf(valor?: string | null) {
  const apenasNumeros = somenteNumeros(valor).slice(0, 11);
  if (apenasNumeros.length <= 3) return apenasNumeros;
  if (apenasNumeros.length <= 6) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3)}`;
  if (apenasNumeros.length <= 9) return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6)}`;
  return `${apenasNumeros.slice(0, 3)}.${apenasNumeros.slice(3, 6)}.${apenasNumeros.slice(6, 9)}-${apenasNumeros.slice(9)}`;
}

export function formatarMoeda(valor?: number | null) {
  const valorSeguro = Number.isFinite(valor) ? Number(valor) : 0;

  return valorSeguro.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarData(data?: string | null) {
  if (!data || data === "-") return "Data não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "Data inválida";

  return dataConvertida.toLocaleString("pt-BR");
}

export function formatarDataCurta(data?: string | null) {
  if (!data || data === "-") return "Data não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "Data inválida";

  return dataConvertida.toLocaleDateString("pt-BR");
}

export function formatarTelefone(valor?: string | null): string {
  if (!valor) return "";
  const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

  if (apenasNumeros.length <= 2) {
    return apenasNumeros;
  }

  if (apenasNumeros.length <= 7) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
  }

  if (apenasNumeros.length <= 10) {
    return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
      2,
      6,
    )}-${apenasNumeros.slice(6)}`;
  }

  return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(
    2,
    7,
  )}-${apenasNumeros.slice(7)}`;
}
