import { describe, expect, it } from "vitest";

import { AREAS_DOCUMENTOS_COMISSAO } from "@/features/secretaria/documentos/constants/documentosAreas";
import {
  TIPOS_CADASTRO_DOCUMENTO,
  TIPOS_DOCUMENTOS_COMISSAO,
} from "@/features/secretaria/documentos/constants/documentosTipos";

describe("constantes de documentos da Secretaria", () => {
  it("expõe áreas esperadas", () => {
    expect(AREAS_DOCUMENTOS_COMISSAO).toContain("Tesouraria");
    expect(AREAS_DOCUMENTOS_COMISSAO).toContain("Jurídico e contratos");
  });

  it("expõe tipos de documento e tipos de cadastro", () => {
    expect(TIPOS_DOCUMENTOS_COMISSAO.map((tipo) => tipo.value)).toContain("ata");
    expect(TIPOS_CADASTRO_DOCUMENTO.pdf.mimeType).toBe("application/pdf");
    expect(TIPOS_CADASTRO_DOCUMENTO.imagem.tipoPadrao).toBe("imagem");
  });
});
