export const AREAS_DOCUMENTOS_SECRETARIA = [
  "Presidência",
  "Secretaria",
  "Tesouraria",
  "Eventos",
  "Marketing",
  "Jurídico e contratos",
  "Geral",
] as const;

export const TIPOS_DOCUMENTOS_SECRETARIA = [
  "ata",
  "contrato",
  "oficio",
  "planilha",
  "relatorio",
  "imagem",
  "outro",
] as const;

export type AreaDocumentoSecretaria =
  (typeof AREAS_DOCUMENTOS_SECRETARIA)[number];

export type TipoDocumentoSecretaria =
  (typeof TIPOS_DOCUMENTOS_SECRETARIA)[number];

export interface DocumentoSecretaria {
  id: string;
  titulo: string;
  area: AreaDocumentoSecretaria;
  tipo: TipoDocumentoSecretaria;
  nomeArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
  storagePath: string;
  urlVisualizacao?: string;
  autorNome: string;
  criadoEm: string;
  atualizadoEm: string;
  dataDocumento?: string;
  descricao?: string;
  periodoReferencia?: string;
  textoAlternativo?: string;
  creditoImagem?: string;
}

export type ListarDocumentosSecretariaResponse = DocumentoSecretaria[];

export type CriarDocumentoSecretariaRequest = Pick<
  DocumentoSecretaria,
  | "titulo"
  | "area"
  | "tipo"
  | "dataDocumento"
  | "descricao"
  | "periodoReferencia"
  | "textoAlternativo"
  | "creditoImagem"
>;

export interface ArquivoDocumentoSecretaria {
  buffer: Buffer;
  nomeArquivo: string;
  mimeType: string;
  tamanhoBytes: number;
}

export interface CriarDocumentoSecretariaResponse {
  sucesso: true;
  documento: DocumentoSecretaria;
}

export type AtualizarDocumentoSecretariaRequest = Partial<
  CriarDocumentoSecretariaRequest
>;

export interface AtualizarDocumentoSecretariaResponse {
  sucesso: true;
  documento: DocumentoSecretaria;
}
