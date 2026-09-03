// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/membros/services/secretariaService.ts
// ============================================================================
import { fetchAPI } from "@/shared/services/api";

import {
  AderidoSecretaria,
  FormEditarAderido,
  FormNovoAderido,
} from "../../../../shared/types/secretaria";

import { normalizarAderidoSecretaria } from "../mappers/secretariaMapper";

function obterIdRegistroSecretaria(registro: unknown): string | null {
  if (!registro || typeof registro !== "object") return null;

  const dados = registro as Record<string, unknown>;
  const id = dados.id ?? dados.id_aderido;
  const idNormalizado = String(id || "").trim();

  return idNormalizado || null;
}

export const secretariaService = {
  async buscarAderidos(): Promise<AderidoSecretaria[]> {
    // A API já deve retornar a lista com o contrato preenchido e na ordem correta
    const dados = await fetchAPI("/admin/aderidos", "GET");

    // Mantemos a normalização para segurança (defensiva)
    // caso ainda haja dados legados que o backend não tratou.
    const lista = (Array.isArray(dados) ? dados : []).flatMap((registro) => {
      const id = obterIdRegistroSecretaria(registro);

      return id ? [normalizarAderidoSecretaria(id, registro)] : [];
    });

    return lista;
  },

  async adicionarAderidoIndividual(dados: FormNovoAderido) {
    // Criação fica no backend porque envolve regra de negócio e dados relacionados.
    return fetchAPI("/admin/aderidos", "POST", dados);
  },

  async atualizarAderidoSecretaria(id: string, dados: FormEditarAderido) {
    const idSeguro = id.trim();

    if (!idSeguro) {
      throw new Error("ID do aderido não informado para atualização.");
    }

    // O backend deve usar update/merge para preservar documentos legados do Firestore.
    return fetchAPI(
      `/admin/aderidos/${encodeURIComponent(idSeguro)}`,
      "PUT",
      dados,
    );
  },
};
