// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/services/secretariaService.ts
// ============================================================================
import { fetchAPI } from "@/shared/services/api";

import {
  AderidoSecretaria,
  FormEditarAderido,
  FormNovoAderido,
} from "../../../shared/types/secretaria";

import { normalizarAderidoSecretaria } from "../mappers/secretariaMapper";

export const secretariaService = {
  async buscarAderidos(): Promise<AderidoSecretaria[]> {
    // A API já deve retornar a lista com o contrato preenchido e na ordem correta
    const dados = await fetchAPI("/admin/aderidos", "GET");

    // Mantemos a normalização para segurança (defensiva) 
    // caso ainda haja dados legados que o backend não tratou.
    const lista = (dados as any[]).map((d) =>
      normalizarAderidoSecretaria(d.id, d),
    );

    return lista;
  },

  async adicionarAderidoIndividual(dados: FormNovoAderido) {
    // Criação fica no backend porque envolve regra de negócio e dados relacionados.
    return fetchAPI("/admin/aderidos", "POST", dados);
  },

  async atualizarAderidoSecretaria(id: string, dados: FormEditarAderido) {
    // O backend deve usar update/merge para preservar documentos legados do Firestore.
    return fetchAPI(`/admin/aderidos/${id}`, "PUT", dados);
  },
};
