// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/services/secretariaService.ts
// ============================================================================
import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../shared/config/firebase";
import { fetchAPI } from "@/shared/services/api";

import {
  AderidoSecretaria,
  FormEditarAderido,
  FormNovoAderido,
} from "../../../shared/types/secretaria";

import { normalizarAderidoSecretaria } from "../mappers/secretariaMapper";

export const secretariaService = {
  async buscarAderidos(): Promise<AderidoSecretaria[]> {
    const querySnapshot = await getDocs(collection(db, "usuarios"));

    const lista = querySnapshot.docs.map((docSnap) =>
      normalizarAderidoSecretaria(docSnap.id, docSnap.data()),
    );

    // Ordenação fica no service porque é regra padrão da listagem administrativa.
    return lista.sort((a, b) => {
      if (a.status_cadastro === "ativo" && b.status_cadastro !== "ativo") {
        return -1;
      }

      if (a.status_cadastro !== "ativo" && b.status_cadastro === "ativo") {
        return 1;
      }

      return (a.nome || a.email).localeCompare(b.nome || b.email);
    });
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
