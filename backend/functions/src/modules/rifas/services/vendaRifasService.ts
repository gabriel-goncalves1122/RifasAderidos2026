// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/services/vendaRifasService.ts
// ============================================================================
import * as admin from "firebase-admin";

import { enviarEmailRecibo } from "../emailService";
import { Bilhete, Comprador } from "../../types/models";
import { DadosVenda } from "../types/rifasTypes";
import { obterContextoAderidoPorEmail } from "../helpers/usuarioRifasHelper";

export class VendaRifasService {
  static async processarVenda(
    uid: string,
    emailLogado: string,
    dadosVenda: DadosVenda,
  ): Promise<void> {
    const db = admin.firestore();

    const { nome, telefone, email, numerosRifas, comprovanteUrl } = dadosVenda;

    if (!comprovanteUrl || !numerosRifas || numerosRifas.length === 0) {
      throw new Error("INVALID_DATA");
    }

    const contextoAderido = await obterContextoAderidoPorEmail(emailLogado);

    const batch = db.batch();
    const compradorRef = db.collection("compradores").doc();
    const momentoExatoDaReserva = new Date().toISOString();

    const novoComprador: Comprador = {
      id: compradorRef.id,
      nome,
      telefone,
      email: email || null,
      criado_em: momentoExatoDaReserva,
    };

    batch.set(compradorRef, novoComprador);

    numerosRifas.forEach((numero: string) => {
      const bilheteRef = db.collection("bilhetes").doc(numero);

      const updateBilhete: Partial<Bilhete> & Record<string, any> = {
        status: "pendente",
        comprador_id: compradorRef.id,
        comprador_nome: nome,
        comprador_telefone: telefone || null,
        comprador_email: email || null,
        vendedor_nome: contextoAderido.vendedorNome,
        vendedor_cpf: contextoAderido.vendedorCpf,
        vendedor_id: contextoAderido.idAderido,
        data_reserva: momentoExatoDaReserva,
        comprovante_url: comprovanteUrl,
      };

      batch.set(bilheteRef, updateBilhete, { merge: true });
    });

    await batch.commit();

    if (email) {
      await enviarEmailRecibo(email, nome, numerosRifas, "pendente")
        .catch((erro) => {
          console.error("[Venda] Falha ao enviar email:", erro);
        });
    }
  }
}
