// ============================================================================
// ARQUIVO: frontend/src/features/rifas/services/rifasService.ts
// ============================================================================
import { fetchAPI } from "@/shared/services/api";

import {
  DadosCorrigirRifas,
  DadosCorrigirDadosRifas,
  DadosFinalizarVenda,
  EnviarCorrecaoParams,
  EnviarVendaParams,
  ResultadoMinhasRifas,
} from "../types/rifas";

import { rifasStorageService } from "./rifasStorageService";

export const rifaService = {
  async buscarMinhasRifas() {
    const resultado = (await fetchAPI(
      "/rifas/minhas-rifas",
    )) as ResultadoMinhasRifas;

    return resultado.bilhetes || [];
  },

  async enviarVenda({
    nome,
    telefone,
    email,
    numerosRifas,
    comprovanteUrl,
  }: EnviarVendaParams) {
    // A API recebe apenas a URL final do comprovante, nunca o File bruto.
    return fetchAPI("/rifas/vender", "POST", {
      nome,
      telefone,
      email,
      numerosRifas,
      comprovanteUrl,
    });
  },

  async finalizarVenda(dados: DadosFinalizarVenda) {
    if (import.meta.env.DEV) {
      console.log("[RifaService] Finalizar venda chamado");
    }

    const comprovanteUrl = await rifasStorageService.uploadComprovante({
      arquivo: dados.comprovante,
      pasta: "comprovantes",
      nomeBase: "venda",
      metadados: {
        tipo: "venda_rifa",
        bilhetesVendidos: dados.numerosRifas.join(","),
      },
    });

    if (import.meta.env.DEV) {
      console.log(
        "[RifaService] Upload concluído. Agora chamando API /rifas/vender",
      );
    }

    await this.enviarVenda({
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      numerosRifas: dados.numerosRifas,
      comprovanteUrl,
    });

    if (import.meta.env.DEV) {
      console.log("[RifaService] API /rifas/vender respondeu com sucesso");
    }

    return true;
  },

  async enviarCorrecao({
    numerosRifas,
    nome,
    telefone,
    email,
    comprovanteUrl,
  }: EnviarCorrecaoParams) {
    return fetchAPI("/rifas/corrigir", "POST", {
      numerosRifas,
      nome,
      telefone,
      email,
      comprovanteUrl,
    });
  },

  async corrigirRifasRecusadas(dados: DadosCorrigirRifas) {
    const comprovanteUrl = await rifasStorageService.uploadComprovante({
      arquivo: dados.comprovante,
      pasta: "comprovantes",
      nomeBase: "correcao",
      metadados: {
        tipo: "correcao_tesouraria",
        bilhetesCorrigidos: dados.numerosRifas.join(","),
      },
    });

    await this.enviarCorrecao({
      numerosRifas: dados.numerosRifas,
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      comprovanteUrl,
    });

    return true;
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

  async anexarComprovante(rifaId: string, arquivo: File) {
    const comprovanteUrl = await rifasStorageService.uploadComprovanteAtrasado(
      rifaId,
      arquivo,
    );

    await fetchAPI(`/rifas/${rifaId}/comprovante`, "PUT", {
      comprovante_url: comprovanteUrl,
    });

    return true;
  },
};
