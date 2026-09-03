import type {
  DocumentoComissao,
  DocumentoFormData,
  DocumentosSecretariaFiltros,
  TipoDocumentoCadastro,
  TipoPreviewDocumento,
} from "../types/documentosSecretariaTypes";
import { TIPOS_CADASTRO_DOCUMENTO } from "../constants/documentosTipos";

const normalizarTexto = (valor: string) =>
  valor
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();

export function filtrarDocumentosSecretaria(
  documentos: DocumentoComissao[],
  filtros: DocumentosSecretariaFiltros,
) {
  const busca = normalizarTexto(filtros.busca);

  return documentos.filter((documento) => {
    const correspondeArea =
      filtros.area === "todas" || documento.area === filtros.area;

    if (!correspondeArea) {
      return false;
    }

    if (!busca) {
      return true;
    }

    const textoDocumento = normalizarTexto(
      [
        documento.titulo,
        documento.area,
        documento.tipo,
        documento.nomeArquivo,
        documento.autorNome,
      ].join(" "),
    );

    return textoDocumento.includes(busca);
  });
}

export function formatarTamanhoArquivo(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  const unidades = ["B", "KB", "MB", "GB"];
  let valor = bytes;
  let indice = 0;

  while (valor >= 1024 && indice < unidades.length - 1) {
    valor /= 1024;
    indice += 1;
  }

  const casas = indice <= 1 ? 0 : 1;
  return `${valor.toFixed(casas)} ${unidades[indice]}`;
}

export function formatarDataDocumento(valor: string) {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(data);
}

export function obterTipoPreviewDocumento(mimeType: string): TipoPreviewDocumento {
  if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(mimeType)) {
    return "imagem";
  }

  if (mimeType === "application/pdf") {
    return "pdf";
  }

  return "indisponivel";
}

export function obterUrlVisualizacaoSegura(url?: string) {
  if (!url) {
    return null;
  }

  if (url.startsWith("/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    return ["https:", "http:"].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

export function inferirTipoCadastroDocumento(
  documento: DocumentoComissao,
): TipoDocumentoCadastro {
  if (documento.tipoCadastro) {
    return documento.tipoCadastro;
  }

  if (documento.mimeType.startsWith("image/")) {
    return "imagem";
  }

  if (documento.tipo === "planilha") {
    return "planilha";
  }

  return "pdf";
}

export function criarDocumentoFormInicial(
  tipoCadastro: TipoDocumentoCadastro,
): DocumentoFormData {
  const config = TIPOS_CADASTRO_DOCUMENTO[tipoCadastro];

  return {
    titulo: "",
    area: "Geral",
    tipo: config.tipoPadrao,
    nomeArquivo: "",
    mimeType: config.mimeType,
    tamanhoBytes: 0,
    tipoCadastro,
    arquivo: null,
    dataDocumento: "",
    descricao: "",
    periodoReferencia: "",
    textoAlternativo: "",
    creditoImagem: "",
  };
}

export function documentoParaFormData(
  documento: DocumentoComissao,
): DocumentoFormData {
  const tipoCadastro = inferirTipoCadastroDocumento(documento);

  return {
    ...criarDocumentoFormInicial(tipoCadastro),
    titulo: documento.titulo,
    area: documento.area,
    tipo: documento.tipo,
    nomeArquivo: documento.nomeArquivo,
    mimeType: documento.mimeType,
    tamanhoBytes: documento.tamanhoBytes,
    arquivo: null,
    dataDocumento: documento.dataDocumento ?? "",
    descricao: documento.descricao ?? "",
    periodoReferencia: documento.periodoReferencia ?? "",
    textoAlternativo: documento.textoAlternativo ?? "",
    creditoImagem: documento.creditoImagem ?? "",
  };
}

export function inferirMimeTypeDocumento(arquivo: File) {
  if (arquivo.type) {
    return arquivo.type;
  }

  const nome = arquivo.name.toLowerCase();

  if (nome.endsWith(".csv")) return "text/csv";
  if (nome.endsWith(".xls")) return "application/vnd.ms-excel";
  if (nome.endsWith(".xlsx")) {
    return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }
  if (nome.endsWith(".pdf")) return "application/pdf";

  return "application/octet-stream";
}

export function inferirTipoCadastroPorArquivo(
  arquivo: File,
): TipoDocumentoCadastro | null {
  const mimeType = inferirMimeTypeDocumento(arquivo);
  const nome = arquivo.name.toLowerCase();

  if (mimeType === "application/pdf" || nome.endsWith(".pdf")) {
    return "pdf";
  }

  if (
    mimeType === "text/csv" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    nome.endsWith(".csv") ||
    nome.endsWith(".xls") ||
    nome.endsWith(".xlsx")
  ) {
    return "planilha";
  }

  if (mimeType.startsWith("image/")) {
    return "imagem";
  }

  return null;
}

export function arquivoAceitoParaTipo(
  arquivo: File,
  tipoCadastro: TipoDocumentoCadastro,
) {
  const tipoInferido = inferirTipoCadastroPorArquivo(arquivo);
  return tipoInferido === tipoCadastro;
}
