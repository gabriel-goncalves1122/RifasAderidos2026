// ============================================================================
// ARQUIVO: backend/functions/src/modules/rifas/rifasService.ts
// ============================================================================
import * as admin from "firebase-admin";
import { enviarEmailRecibo } from "./emailService";
import { Bilhete, Usuario, Comprador } from "../types/models"; // <-- IMPORTAÇÃO DE TIPOS

export interface DadosVenda {
  nome: string;
  telefone: string;
  email?: string;
  numerosRifas: string[];
  comprovanteUrl: string;
}

export class RifasService {
  /**
   * Busca todas as rifas que pertencem a um aderido específico (pelo e-mail).
   */
  static async buscarPorAderido(emailLogado: string): Promise<Bilhete[]> {
    const db = admin.firestore();

    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", emailLogado)
      .limit(1)
      .get();

    if (userDocs.empty) {
      throw new Error("USER_NOT_FOUND");
    }

    const userData = userDocs.docs[0].data() as Usuario;
    // BLINDAGEM: Se não houver id_aderido, usa o ID do documento (UID)
    const idAderido = userData.id_aderido || userDocs.docs[0].id;

    const bilhetesSnapshot = await db
      .collection("bilhetes")
      .where("vendedor_id", "==", idAderido)
      .get();

    const bilhetes = bilhetesSnapshot.docs.map((doc) => doc.data() as Bilhete);

    // BLINDAGEM: Ordena numericamente com segurança contra campos vazios ou nulos
    bilhetes.sort((a, b) => {
      const numA = parseInt(a.numero || "0") || 0;
      const numB = parseInt(b.numero || "0") || 0;
      return numA - numB;
    });

    return bilhetes;
  }

  /**
   * Processa uma nova venda, reserva os bilhetes e dispara o e-mail de "Pendente".
   */
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

    let vendedorNome = "Nome não registado";
    let vendedorCpf = "CPF não registado";
    let idAderido = "";

    // 1. Vai buscar os dados oficiais do aderido à coleção 'usuarios'
    if (emailLogado) {
      const userDocs = await db
        .collection("usuarios")
        .where("email", "==", emailLogado)
        .limit(1)
        .get();

      if (!userDocs.empty) {
        const userData = userDocs.docs[0].data() as Usuario;
        vendedorNome = userData.nome || vendedorNome;
        vendedorCpf = userData.cpf || vendedorCpf;
        // BLINDAGEM: Fallback para o ID do documento
        idAderido = userData.id_aderido || userDocs.docs[0].id;
      }
    }

    const batch = db.batch();
    const compradorRef = db.collection("compradores").doc();
    const momentoExatoDaReserva = new Date().toISOString();

    // 2. Regista o comprador na base de dados garantindo o modelo Comprador
    const novoComprador: Comprador = {
      id: compradorRef.id,
      nome,
      telefone,
      email: email || null,
      criado_em: momentoExatoDaReserva,
    };
    batch.set(compradorRef, novoComprador);

    // 3. Atualiza cada bilhete selecionado
    numerosRifas.forEach((numero: string) => {
      const bilheteRef = db.collection("bilhetes").doc(numero);

      // CORREÇÃO: Forçamos o tipo para incluir o telefone diretamente no bilhete
      const updateBilhete: Partial<Bilhete> & Record<string, any> = {
        status: "pendente",
        comprador_id: compradorRef.id,
        comprador_nome: nome,
        comprador_telefone: telefone || null, // <-- AGORA O TELEFONE É SALVO AQUI TAMBÉM!
        comprador_email: email || null,
        vendedor_nome: vendedorNome,
        vendedor_cpf: vendedorCpf,
        vendedor_id: idAderido,
        data_reserva: momentoExatoDaReserva,
        comprovante_url: comprovanteUrl,
      };

      batch.set(bilheteRef, updateBilhete, { merge: true });
    });

    await batch.commit();

    // 4. Envia o email se o comprador tiver fornecido um
    if (email) {
      enviarEmailRecibo(email, nome, numerosRifas, "pendente");
    }
  }

  // ==========================================================================
  // CORRIGIR RIFAS RECUSADAS
  // ==========================================================================
  static async corrigirRifasRecusadas(
    emailLogado: string,
    numerosRifas: string[],
    dadosAtualizados: {
      nome: string;
      telefone: string;
      email: string;
      comprovanteUrl: string;
    },
  ): Promise<boolean> {
    const db = admin.firestore();

    const userDocs = await db
      .collection("usuarios")
      .where("email", "==", emailLogado)
      .limit(1)
      .get();

    if (userDocs.empty) throw new Error("USER_NOT_FOUND");

    const userData = userDocs.docs[0].data() as Usuario;
    // BLINDAGEM: Fallback para o ID do documento
    const idAderido = userData.id_aderido || userDocs.docs[0].id;
    const batch = db.batch();

    try {
      for (const numero of numerosRifas) {
        const bilheteRef = db.collection("bilhetes").doc(numero);
        const bilheteSnap = await bilheteRef.get();

        if (bilheteSnap.exists) {
          const dadosBilhete = bilheteSnap.data() as Bilhete;

          if (
            dadosBilhete?.vendedor_id === idAderido &&
            dadosBilhete?.status === "recusado"
          ) {
            const updateBilhete: Partial<Bilhete> & Record<string, any> = {
              status: "pendente",
              comprador_nome: dadosAtualizados.nome,
              comprador_email: dadosAtualizados.email || null,
              comprovante_url: dadosAtualizados.comprovanteUrl,
              motivo_recusa: null,
              log_automacao: null,
              data_reserva: new Date().toISOString(),
            };

            updateBilhete.comprador_telefone =
              dadosAtualizados.telefone || null;

            batch.update(bilheteRef, updateBilhete);
          }
        }
      }

      await batch.commit();
      return true;
    } catch (error) {
      console.error("[RifasService] Erro ao corrigir rifas:", error);
      throw new Error("Falha ao salvar a correção no banco de dados.");
    }
  }

  /**
   * Puxa o relatório completo que cruza os utilizadores com os bilhetes pagos.
   */
  static async obterRelatorioTesouraria() {
    const db = admin.firestore();

    const usuariosSnap = await db.collection("usuarios").get();
    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("status", "==", "pago")
      .get();

    const vendasPorCpf: Record<string, number> = {};
    bilhetesSnap.forEach((doc) => {
      const data = doc.data() as Bilhete;
      if (data.vendedor_cpf) {
        vendasPorCpf[data.vendedor_cpf] =
          (vendasPorCpf[data.vendedor_cpf] || 0) + 1;
      }
    });

    let totalArrecadadoGlobal = 0;
    let rifasPagasGlobal = 0;

    const aderidos = usuariosSnap.docs
      // BLINDAGEM: Checa pelo cargo em vez de depender de doc.id começar com "ADERIDO_"
      .filter((doc) => {
        const data = doc.data();
        return (
          data.role === "aderido" ||
          data.cargo === "aderido" ||
          (!data.role && !data.cargo)
        );
      })
      .map((doc) => {
        const user = doc.data() as Usuario;
        const rifasVendidas = vendasPorCpf[user.cpf] || 0;
        const arrecadado = rifasVendidas * 10;

        totalArrecadadoGlobal += arrecadado;
        rifasPagasGlobal += rifasVendidas;

        return {
          id: doc.id,
          nome: user.nome || "Aderido Sem Nome",
          cpf: user.cpf || "-",
          arrecadado: arrecadado,
          meta: user.meta_vendas || 1200,
          rifasVendidas: rifasVendidas,
        };
      });

    return {
      resumoGeral: {
        totalArrecadado: totalArrecadadoGlobal,
        rifasPagas: rifasPagasGlobal,
        aderidosAtivos: aderidos.length,
      },
      aderidos,
    };
  }

  /**
   * Busca absolutamente todos os bilhetes que tiveram interação (para CSV/Gráficos)
   */
  static async obterHistoricoDetalhado() {
    const db = admin.firestore();
    const bilhetesSnap = await db
      .collection("bilhetes")
      .where("status", "in", ["pago", "pendente"])
      .get();

    const historico = bilhetesSnap.docs.map((doc) => {
      // Cast relaxado para poder ler o comprador_telefone sem o TypeScript reclamar
      const data = doc.data() as Bilhete & Record<string, any>;
      return {
        numero_rifa: doc.id,
        vendedor_nome: data.vendedor_nome || "Desconhecido",
        vendedor_cpf: data.vendedor_cpf || "-",
        comprador_nome: data.comprador_nome || "Desconhecido",
        comprador_telefone: data.comprador_telefone || "-", // <-- ADICIONADO NO HISTÓRICO
        comprador_email: data.comprador_email || "-",
        data_reserva: data.data_reserva || "-",
        data_pagamento: data.data_pagamento || "-",
        status: data.status,
        valor: 10,
      };
    });

    historico.sort((a, b) => {
      const dataA = new Date(a.data_reserva || 0).getTime() || 0;
      const dataB = new Date(b.data_reserva || 0).getTime() || 0;
      return dataB - dataA;
    });

    return historico;
  }
}
