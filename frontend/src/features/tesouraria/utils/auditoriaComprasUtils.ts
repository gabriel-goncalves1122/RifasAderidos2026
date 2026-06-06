import {
  CompraAuditavel,
  AuditoriaComprasFiltros,
  ResumoAuditoriaCompras,
  StatusAuditoriaCompras,
  TransacaoAuditoriaComprasBase,
} from "../types/auditoriaCompras";

export const STATUS_FILTROS_AUDITORIA_COMPRAS: Array<{
  label: string;
  value: StatusAuditoriaCompras;
}> = [
  { label: "Todas", value: "todas" },
  { label: "Pagas", value: "pago" },
  { label: "Pendentes", value: "pendente" },
  { label: "Recusadas", value: "recusado" },
  { label: "Disponíveis", value: "disponivel" },
];

export const FILTROS_AUDITORIA_COMPRAS_VAZIOS: AuditoriaComprasFiltros = {
  termoBusca: "",
  status: "todas",
  dataInicio: "",
  dataFim: "",
  comprovante: "todos",
};

export function somenteNumeros(valor?: string | null) {
  return String(valor || "").replace(/\D/g, "");
}

export function normalizarTexto(valor?: string | null) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function formatarMoedaAuditoria(valor: number) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarDataAuditoria(data?: string | null) {
  if (!data || data === "-") return "Data não informada";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "Data inválida";

  return dataConvertida.toLocaleDateString("pt-BR");
}

export function dataParaInputAuditoria(data?: string | null) {
  if (!data || data === "-") return "";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "";

  return dataConvertida.toISOString().slice(0, 10);
}

export function obterNumeroBilhete(transacao: TransacaoAuditoriaComprasBase) {
  return transacao.numero_rifa || transacao.numero || "00";
}

export function obterChaveCompra(transacao: TransacaoAuditoriaComprasBase) {
  if (transacao.comprador_id) return `comprador:${transacao.comprador_id}`;

  return [
    "fallback",
    transacao.data_reserva || "-",
    normalizarTexto(transacao.comprador_nome),
    somenteNumeros(transacao.vendedor_cpf),
  ].join(":");
}

export function statusLabelAuditoria(status: string) {
  const labels: Record<string, string> = {
    pago: "Pago",
    pendente: "Pendente",
    recusado: "Recusado",
    disponivel: "Disponível",
  };

  return labels[normalizarTexto(status)] || status || "N/A";
}

export function statusSxAuditoria(status: string) {
  const statusNormalizado = normalizarTexto(status);

  if (statusNormalizado === "pago") {
    return {
      color: "#FFFFFF",
      bgcolor: "#063D31",
      border: "1px solid #063D31",
    };
  }

  if (statusNormalizado === "pendente") {
    return {
      color: "#6B4E00",
      bgcolor: "#FFF7E0",
      border: "1px solid rgba(107, 78, 0, 0.25)",
    };
  }

  if (statusNormalizado === "recusado") {
    return {
      color: "#7A1F1F",
      bgcolor: "#FDF0F0",
      border: "1px solid rgba(122, 31, 31, 0.22)",
    };
  }

  return {
    color: "#526760",
    bgcolor: "#F6F8F7",
    border: "1px solid rgba(2, 27, 22, 0.10)",
  };
}

export function agruparComprasAuditaveis(transacoes: TransacaoAuditoriaComprasBase[]) {
  const agrupado = transacoes.reduce<Record<string, CompraAuditavel>>(
    (acc, transacao) => {
      const chave = obterChaveCompra(transacao);
      const bilhete = obterNumeroBilhete(transacao);

      if (!acc[chave]) {
        acc[chave] = {
          id: chave,
          data_reserva: transacao.data_reserva || null,
          data_pagamento: transacao.data_pagamento || null,
          vendedor_id: transacao.vendedor_id,
          vendedor_nome: transacao.vendedor_nome || "Vendedor não informado",
          vendedor_cpf: transacao.vendedor_cpf || "-",
          comprador_id: transacao.comprador_id || null,
          comprador_nome: transacao.comprador_nome || "Comprador não informado",
          comprador_email: transacao.comprador_email || "",
          comprador_telefone: transacao.comprador_telefone || "",
          status: transacao.status || "N/A",
          comprovante_url: transacao.comprovante_url || null,
          bilhetes: [bilhete],
          valor_total: transacao.valor || 10,
        };

        return acc;
      }

      if (!acc[chave].bilhetes.includes(bilhete)) {
        acc[chave].bilhetes.push(bilhete);
      }

      acc[chave].valor_total += transacao.valor || 10;
      acc[chave].comprovante_url =
        acc[chave].comprovante_url || transacao.comprovante_url || null;

      return acc;
    },
    {},
  );

  return Object.values(agrupado).sort((a, b) => {
    const dataA = new Date(a.data_reserva || 0).getTime() || 0;
    const dataB = new Date(b.data_reserva || 0).getTime() || 0;

    return dataB - dataA;
  });
}

function compraPassaPeriodo(
  compra: CompraAuditavel,
  dataInicio: string,
  dataFim: string,
) {
  const dataCompra = dataParaInputAuditoria(compra.data_reserva);

  if (!dataCompra) return !dataInicio && !dataFim;
  if (dataInicio && dataCompra < dataInicio) return false;
  if (dataFim && dataCompra > dataFim) return false;

  return true;
}

function compraPassaBusca(compra: CompraAuditavel, termoBusca: string) {
  const termo = normalizarTexto(termoBusca);
  const termoNumerico = somenteNumeros(termoBusca);

  if (!termo && !termoNumerico) return true;

  const campos = [
    compra.comprador_nome,
    compra.comprador_email,
    compra.comprador_telefone,
    compra.comprador_id || "",
    compra.vendedor_nome,
    compra.vendedor_cpf,
    compra.vendedor_id || "",
    compra.status,
    formatarDataAuditoria(compra.data_reserva),
    compra.bilhetes.join(" "),
  ];

  return campos.some((campo) => {
    const texto = normalizarTexto(campo);
    const numerico = somenteNumeros(campo);

    return (
      texto.includes(termo) ||
      (termoNumerico.length > 0 && numerico.includes(termoNumerico))
    );
  });
}

export function filtrarComprasAuditaveis(
  compras: CompraAuditavel[],
  filtros: AuditoriaComprasFiltros,
) {
  return compras.filter((compra) => {
    const statusValido =
      filtros.status === "todas" ||
      normalizarTexto(compra.status) === filtros.status;

    const comprovanteValido =
      filtros.comprovante === "todos" ||
      (filtros.comprovante === "com" && Boolean(compra.comprovante_url)) ||
      (filtros.comprovante === "sem" && !compra.comprovante_url);

    return (
      statusValido &&
      comprovanteValido &&
      compraPassaPeriodo(compra, filtros.dataInicio, filtros.dataFim) &&
      compraPassaBusca(compra, filtros.termoBusca)
    );
  });
}

export function calcularResumoAuditoria(
  compras: CompraAuditavel[],
): ResumoAuditoriaCompras {
  const totalRifas = compras.reduce(
    (acc, compra) => acc + compra.bilhetes.length,
    0,
  );
  const valorTotal = compras.reduce(
    (acc, compra) => acc + compra.valor_total,
    0,
  );
  const pagas = compras.filter(
    (compra) => normalizarTexto(compra.status) === "pago",
  ).length;
  const pendentes = compras.filter(
    (compra) => normalizarTexto(compra.status) === "pendente",
  ).length;
  const recusadas = compras.filter(
    (compra) => normalizarTexto(compra.status) === "recusado",
  ).length;

  return {
    totalCompras: compras.length,
    totalRifas,
    valorTotal,
    pagas,
    pendentes,
    recusadas,
  };
}

export function filtrosAuditoriaAtivos(filtros: AuditoriaComprasFiltros) {
  return Boolean(
    filtros.termoBusca.trim() ||
      filtros.status !== "todas" ||
      filtros.dataInicio ||
      filtros.dataFim ||
      filtros.comprovante !== "todos",
  );
}

export function criarCsvAuditoriaCompras(compras: CompraAuditavel[]) {
  const headers = [
    "Data Reserva",
    "Data Pagamento",
    "Status",
    "Rifas",
    "Qtd",
    "Valor Total (R$)",
    "Vendedor",
    "CPF Vendedor",
    "Comprador",
    "Email Comprador",
    "Telefone Comprador",
    "Comprovante",
  ];
  const linhas = compras.map((compra) => [
    formatarDataAuditoria(compra.data_reserva),
    formatarDataAuditoria(compra.data_pagamento),
    statusLabelAuditoria(compra.status),
    `"${compra.bilhetes.join(", ")}"`,
    compra.bilhetes.length,
    compra.valor_total,
    `"${compra.vendedor_nome}"`,
    `"${compra.vendedor_cpf}"`,
    `"${compra.comprador_nome}"`,
    `"${compra.comprador_email}"`,
    `"${compra.comprador_telefone}"`,
    compra.comprovante_url ? "Sim" : "Não",
  ]);

  return [headers.join(";"), ...linhas.map((linha) => linha.join(";"))].join(
    "\n",
  );
}
