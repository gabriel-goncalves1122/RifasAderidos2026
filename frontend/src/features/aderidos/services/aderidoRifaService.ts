import { fetchAPI } from "@/shared/services/api";

interface DadosCompradorRifa {
  nome: string;
  telefone: string;
  email: string;
}

interface DadosCorrigirDadosRifas extends DadosCompradorRifa {
  numerosRifas: string[];
}

interface ResultadoMinhasRifas {
  bilhetes?: unknown[];
}

export const aderidoRifaService = {
  async buscarMinhasRifas() {
    const resultado = (await fetchAPI(
      "/rifas/minhas-rifas",
    )) as ResultadoMinhasRifas;

    return resultado.bilhetes || [];
  },

  async corrigirDadosRifasRecusadas({
    numerosRifas,
    nome,
    telefone,
    email,
  }: DadosCorrigirDadosRifas) {
    await fetchAPI("/rifas/corrigir-dados", "POST", {
      numerosRifas,
      nome,
      telefone,
      email,
    });

    return true;
  },
};
