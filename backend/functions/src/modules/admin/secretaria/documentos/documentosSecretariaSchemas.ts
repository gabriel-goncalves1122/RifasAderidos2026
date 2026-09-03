import * as yup from "yup";

import {
  AREAS_DOCUMENTOS_SECRETARIA,
  TIPOS_DOCUMENTOS_SECRETARIA,
} from "./documentosSecretariaTypes";

const areaSchema = yup
  .string()
  .oneOf([...AREAS_DOCUMENTOS_SECRETARIA], "Área inválida.");

const tipoSchema = yup
  .string()
  .oneOf([...TIPOS_DOCUMENTOS_SECRETARIA], "Tipo de documento inválido.");

export const criarDocumentoSecretariaSchema = yup.object().shape({
  titulo: yup.string().trim().required("Título é obrigatório."),
  area: areaSchema.required("Área é obrigatória."),
  tipo: tipoSchema.required("Tipo é obrigatório."),
  dataDocumento: yup.string().optional().default(""),
  descricao: yup.string().optional().default(""),
  periodoReferencia: yup.string().optional().default(""),
  textoAlternativo: yup.string().optional().default(""),
  creditoImagem: yup.string().optional().default(""),
});

export const atualizarDocumentoSecretariaSchema =
  criarDocumentoSecretariaSchema.partial();
