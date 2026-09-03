import type {
  TipoDocumentoCadastro,
  TipoDocumentoComissao,
} from "../types/documentosSecretariaTypes";

export const TIPOS_DOCUMENTOS_COMISSAO: Array<{
  value: TipoDocumentoComissao;
  label: string;
}> = [
  { value: "ata", label: "Ata" },
  { value: "contrato", label: "Contrato" },
  { value: "oficio", label: "Ofício" },
  { value: "planilha", label: "Planilha" },
  { value: "relatorio", label: "Relatório" },
  { value: "imagem", label: "Imagem" },
  { value: "outro", label: "Outro" },
];

export const TIPOS_CADASTRO_DOCUMENTO: Record<
  TipoDocumentoCadastro,
  {
    label: string;
    mimeType: string;
    extensao: string;
    tipoPadrao: TipoDocumentoComissao;
  }
> = {
  pdf: {
    label: "PDF",
    mimeType: "application/pdf",
    extensao: "pdf",
    tipoPadrao: "relatorio",
  },
  planilha: {
    label: "Planilha",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extensao: "xlsx",
    tipoPadrao: "planilha",
  },
  imagem: {
    label: "Imagem",
    mimeType: "image/png",
    extensao: "png",
    tipoPadrao: "imagem",
  },
};
