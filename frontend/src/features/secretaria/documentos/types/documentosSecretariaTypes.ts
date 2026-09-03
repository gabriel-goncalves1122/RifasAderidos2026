import type { AREAS_DOCUMENTOS_COMISSAO } from "../constants/documentosAreas";

export type AreaDocumentoComissao =
  (typeof AREAS_DOCUMENTOS_COMISSAO)[number];

export type TipoDocumentoCadastro = "pdf" | "planilha" | "imagem";

export type TipoDocumentoComissao =
  | "ata"
  | "contrato"
  | "oficio"
  | "planilha"
  | "relatorio"
  | "imagem"
  | "outro";

export interface DocumentoComissao {
  id: string;
  titulo: string;
  area: AreaDocumentoComissao;
  tipo: TipoDocumentoComissao;
  nomeArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
  storagePath: string;
  criadoEm: string;
  atualizadoEm: string;
  autorNome: string;
  urlVisualizacao?: string;
  tipoCadastro?: TipoDocumentoCadastro;
  dataDocumento?: string;
  descricao?: string;
  periodoReferencia?: string;
  textoAlternativo?: string;
  creditoImagem?: string;
}

export interface DocumentoPreviewState {
  open: boolean;
  documento: DocumentoComissao | null;
  url: string | null;
  loading: boolean;
  erro: string | null;
}

export interface DocumentosSecretariaFiltros {
  busca: string;
  area: AreaDocumentoComissao | "todas";
}

export type TipoPreviewDocumento = "imagem" | "pdf" | "indisponivel";

export interface DocumentoFormData {
  titulo: string;
  area: AreaDocumentoComissao;
  tipo: TipoDocumentoComissao;
  nomeArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
  tipoCadastro: TipoDocumentoCadastro;
  arquivo: File | null;
  dataDocumento: string;
  descricao: string;
  periodoReferencia: string;
  textoAlternativo: string;
  creditoImagem: string;
}

export interface DocumentoEditorState {
  open: boolean;
  modo: "criar" | "editar";
  tipoCadastro: TipoDocumentoCadastro;
  documento: DocumentoComissao | null;
}
