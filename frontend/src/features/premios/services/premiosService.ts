import { fetchAPI } from "@/shared/services/api";
import { storageService } from "@/shared/services/storageService";
import type { PremioData } from "../types/premio";
import type { InfoSorteio } from "../types/sorteio";

interface BuscarPremiosResponse {
  infoSorteio: InfoSorteio;
  premios: PremioData[];
}

export const premiosService = {
  buscar: async (): Promise<BuscarPremiosResponse | null> => {
    try {
      return await fetchAPI("/premios", "GET", undefined, false);
    } catch {
      return null;
    }
  },

  salvarInfoSorteio: async (dados: Partial<InfoSorteio>): Promise<void> => {
    await fetchAPI("/premios/sorteio", "PUT", dados);
  },

  salvarPremio: async (dados: PremioData): Promise<void> => {
    await fetchAPI("/premios", "POST", dados);
  },

  excluir: async (id: string): Promise<void> => {
    await fetchAPI(`/premios/${id}`, "DELETE");
  },

  uploadImagem: async (arquivo: File): Promise<string> => {
    try {
      return await storageService.uploadImagem(arquivo, "premios");
    } catch {
      throw new Error("Falha no upload da imagem para o Firebase Storage.");
    }
  },
};
