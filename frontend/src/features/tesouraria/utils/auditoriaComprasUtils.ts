import {
  formatarDataCurta as formatarDataAuditoria,
  formatarMoeda as formatarMoedaAuditoria,
  somenteNumeros,
} from "./formatadores";
import {
  TransacaoTesouraria,
  AuditoriaComprasFiltros,
  ResumoAuditoriaCompras,
  StatusAuditoriaCompras,
} from "../types/auditoriaCompras";

export { formatarDataAuditoria, formatarMoedaAuditoria };

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
  busca: "",
  status: "todas",
  dataInicio: "",
  dataFim: "",
  comprovante: "todos",
};

export function normalizarTexto(valor?: string | null) {
  return String(valor || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function dataParaInputAuditoria(data?: string | null) {
  if (!data || data === "-") return "";

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) return "";

  return dataConvertida.toISOString().slice(0, 10);
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

function compraPassaPeriodo(
  compra: TransacaoTesouraria,
  dataInicio: string,
  dataFim: string,
) {
  const dataCompra = dataParaInputAuditoria(compra.dataReserva);

  if (!dataCompra) return !dataInicio && !dataFim;
  if (dataInicio && dataCompra < dataInicio) return false;
  if (dataFim && dataCompra > dataFim) return false;

  return true;
}

function compraPassaBusca(compra: TransacaoTesouraria, busca: string) {
  const termo = normalizarTexto(busca);
  const termoNumerico = somenteNumeros(busca);

  if (!termo && !termoNumerico) return true;

  const campos = [
    compra.compradorNome,
    compra.compradorEmail,
    compra.compradorTelefone,
    compra.compradorId || "",
    compra.vendedorNome,
    compra.vendedorCpf,
    compra.vendedorId || "",
    compra.status,
    formatarDataAuditoria(compra.dataReserva),
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
  compras: TransacaoTesouraria[],
  filtros: AuditoriaComprasFiltros,
) {
  return compras.filter((compra) => {
    const statusValido =
      filtros.status === "todas" ||
      normalizarTexto(compra.status) === filtros.status;

    const comprovanteValido =
      filtros.comprovante === "todos" ||
      (filtros.comprovante === "com" && Boolean(compra.comprovanteUrl)) ||
      (filtros.comprovante === "sem" && !compra.comprovanteUrl);

    return (
      statusValido &&
      comprovanteValido &&
      compraPassaPeriodo(compra, filtros.dataInicio, filtros.dataFim) &&
      compraPassaBusca(compra, filtros.busca)
    );
  });
}

export function calcularResumoAuditoria(
  compras: TransacaoTesouraria[],
): ResumoAuditoriaCompras {
  const totalRifas = compras.reduce(
    (acc, compra) => acc + compra.bilhetes.length,
    0,
  );
  const valorTotal = compras.reduce(
    (acc, compra) => acc + compra.valorTotal,
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
    filtros.busca.trim() ||
      filtros.status !== "todas" ||
      filtros.dataInicio ||
      filtros.dataFim ||
      filtros.comprovante !== "todos",
  );
}

export function criarCsvAuditoriaCompras(compras: TransacaoTesouraria[]) {
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
    formatarDataAuditoria(compra.dataReserva),
    formatarDataAuditoria(compra.dataPagamento),
    statusLabelAuditoria(compra.status),
    `"${compra.bilhetes.join(", ")}"`,
    compra.bilhetes.length,
    compra.valorTotal,
    `"${compra.vendedorNome}"`,
    `"${compra.vendedorCpf}"`,
    `"${compra.compradorNome}"`,
    `"${compra.compradorEmail}"`,
    `"${compra.compradorTelefone}"`,
    compra.comprovanteUrl ? "Sim" : "Não",
  ]);

  return [headers.join(";"), ...linhas.map((linha) => linha.join(";"))].join(
    "\n",
  );
}
