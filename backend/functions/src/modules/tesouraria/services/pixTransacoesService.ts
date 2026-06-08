import * as admin from "firebase-admin";

import { Bilhete } from "../../types/models";
import {
  BilheteComNumero,
  PixTransacao,
  PixTransacoesResumo,
  ResultadoSincronizacaoPix,
} from "../types/tesourariaTypes";
import {
  calcularResumoPixTransacoes,
  chaveCompra,
  montarPixTransacao,
  valorDataSeguro,
} from "../helpers/pixTransacoesHelper";

export class PixTransacoesService {
  static async buscarTransacoes(): Promise<PixTransacao[]> {
    const db = admin.firestore();
    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("status", "in", ["pago", "pendente", "recusado"])
      .get();

    const grupos = new Map<string, BilheteComNumero[]>();

    bilhetesSnap.docs.forEach((doc) => {
      const bilhete = {
        ...(doc.data() as Bilhete),
        numero: doc.id,
      };
      const chave = chaveCompra(bilhete);
      const grupoAtual = grupos.get(chave) || [];

      grupoAtual.push(bilhete);
      grupos.set(chave, grupoAtual);
    });

    return Array.from(grupos.values())
      .map(montarPixTransacao)
      .sort(
        (a, b) =>
          valorDataSeguro(b.dataPagamento || b.dataCriacao) -
          valorDataSeguro(a.dataPagamento || a.dataCriacao),
      );
  }

  static async obterResumo(): Promise<PixTransacoesResumo> {
    return calcularResumoPixTransacoes(await this.buscarTransacoes());
  }

  static async sincronizar(): Promise<ResultadoSincronizacaoPix> {
    return {
      sucesso: true,
      sincronizado: false,
      mensagem:
        "Sincronização externa de Pix não configurada. Dados locais preservados.",
    };
  }
}
