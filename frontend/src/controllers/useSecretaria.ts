// ============================================================================
// ARQUIVO: frontend/src/controllers/useSecretaria.ts
// ============================================================================
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Aderido } from "../views/pages/SecretariaPage";
import Papa from "papaparse";

export function useSecretaria() {
  const buscarAderidos = async (): Promise<Aderido[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista: Aderido[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          email: data.email || data["E-mail"] || docSnap.id,
          nome: data.nome || "Aderido Sem Nome",
          cargo: data.cargo || data.Cargo || "",
          // Se tiver um UID do Firebase Auth, a conta está "ativa". Senão, está "pendente" (só o e-mail autorizado)
          status_cadastro: data.uid ? "ativo" : "pendente",
        });
      });

      // Ordena: Primeiro os ativos, depois os pendentes, e por ordem alfabética
      lista.sort((a, b) => {
        if (a.status_cadastro === "ativo" && b.status_cadastro === "pendente")
          return -1;
        if (a.status_cadastro === "pendente" && b.status_cadastro === "ativo")
          return 1;
        return (a.nome || a.email).localeCompare(b.nome || b.email);
      });

      return lista;
    } catch (error) {
      console.error("Erro ao buscar aderidos:", error);
      throw new Error("Não foi possível carregar a lista de aderidos.");
    }
  };

  // ==========================================================================
  // FUNÇÃO MESTRA DE INJEÇÃO (PADRÃO REQUISITADO: ADERIDO_XXX)
  // ==========================================================================
  const injetarAderidosCSV = async (
    arquivoCsv: File,
    BILHETES_POR_PESSOA: number = 120,
  ) => {
    return new Promise((resolve, reject) => {
      Papa.parse(arquivoCsv, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const linhas = results.data as any[];
            if (linhas.length === 0)
              throw new Error("O arquivo CSV está vazio.");

            console.log(
              `[CSV] Iniciando injeção de ${linhas.length} aderidos...`,
            );

            // 1. DESCOBRIR A ÚLTIMA POSIÇÃO (posicao_adesao)
            const usersSnap = await getDocs(
              query(
                collection(db, "usuarios"),
                orderBy("posicao_adesao", "desc"),
                limit(1),
              ),
            );
            let proximaPosicao = 1;
            if (!usersSnap.empty) {
              const ultimaPosicao = usersSnap.docs[0].data().posicao_adesao;
              if (typeof ultimaPosicao === "number")
                proximaPosicao = ultimaPosicao + 1;
            }

            // 2. DESCOBRIR O ÚLTIMO BILHETE GERADO NA COLEÇÃO BILHETES
            const bilhetesSnap = await getDocs(
              query(
                collection(db, "bilhetes"),
                orderBy("numero", "desc"),
                limit(1),
              ),
            );
            let proximoNumeroBilhete = 1;
            if (!bilhetesSnap.empty) {
              const ultimoBilhete = parseInt(bilhetesSnap.docs[0].id, 10);
              if (!isNaN(ultimoBilhete))
                proximoNumeroBilhete = ultimoBilhete + 1;
            }

            // 3. PEGAR EMAILS EXISTENTES PARA NÃO DUPLICAR
            const usuariosExistentesSnap = await getDocs(
              collection(db, "usuarios"),
            );
            const emailsExistentes = new Set();
            usuariosExistentesSnap.forEach((d) => {
              const email = d.data().email || d.data()["E-mail"];
              if (email) emailsExistentes.add(email.toLowerCase().trim());
            });

            let registrosInjetados = 0;
            let numeroAtual = proximoNumeroBilhete;

            // O Firebase suporta no máximo 500 operações por Batch.
            // 1 utilizador = 1 doc + 120 bilhetes = 121 operações.
            // Guardamos de 4 em 4 alunos por Batch (4 * 121 = 484 < 500).
            const ALUNOS_POR_BATCH = 4;

            for (let i = 0; i < linhas.length; i += ALUNOS_POR_BATCH) {
              const grupoDeAlunos = linhas.slice(i, i + ALUNOS_POR_BATCH);
              const batch = writeBatch(db);
              let grupoTemOperacoes = false;

              for (const linha of grupoDeAlunos) {
                // Mapeamento das colunas (seguro contra falhas de digitação no CSV)
                const email = (linha["E-mail"] || linha["Email"] || "").trim();
                const nome = (linha["Nome"] || "").trim().toUpperCase();
                const cargo = (linha["Cargo"] || "").trim();
                const curso = (linha["Curso"] || "").trim().toUpperCase();
                const telefone = (linha["Telefone"] || "").trim();
                const dataNasc = (linha["Data de Nascimento"] || "").trim();
                const genero = (linha["Gênero"] || "").trim();

                // Ignora se não houver e-mail ou se já estiver cadastrado
                if (!email || emailsExistentes.has(email.toLowerCase()))
                  continue;

                grupoTemOperacoes = true;

                // ==============================================================
                // A. CRIAR O NOVO USUÁRIO NO BANCO NO FORMATO EXATO PEDIDO
                // ==============================================================
                const idAderido = `ADERIDO_${String(proximaPosicao).padStart(3, "0")}`;
                const userRef = doc(collection(db, "usuarios"), idAderido);

                batch.set(userRef, {
                  cadastrado_em: new Date().toISOString(),
                  cargo: cargo,
                  curso: curso,
                  data_nascimento: dataNasc,
                  email: email.toLowerCase(),
                  genero: genero,
                  id_aderido: idAderido,
                  nome: nome,
                  posicao_adesao: proximaPosicao,
                  status: "Aderido",
                  telefone: telefone,
                  uid: null, // Importante mantermos isto para o site saber que ele ainda não definiu password
                });

                // ==============================================================
                // B. GERAR OS NOVOS 120 BILHETES PARA ESTE ALUNO
                // ==============================================================
                for (let b = 0; b < BILHETES_POR_PESSOA; b++) {
                  const numeroString = String(numeroAtual).padStart(5, "0");
                  const bilheteRef = doc(
                    collection(db, "bilhetes"),
                    numeroString,
                  );

                  batch.set(bilheteRef, {
                    numero: numeroString,
                    status: "disponivel",
                    vendedor_id: idAderido,
                    comprador_id: null,
                    comprovante_url: null,
                    data_reserva: null,
                  });

                  numeroAtual++;
                }

                // Prepara a fita para o próximo aluno
                emailsExistentes.add(email.toLowerCase());
                proximaPosicao++;
                registrosInjetados++;
              }

              // Envia este pequeno grupo de 4 alunos para o Firebase
              if (grupoTemOperacoes) {
                await batch.commit();
                console.log(
                  `[CSV] Pacote guardado! Já foram injetados ${registrosInjetados} alunos...`,
                );
              }
            }

            if (registrosInjetados === 0) {
              resolve(
                "Nenhum utilizador novo foi encontrado (todos já estavam cadastrados ou faltava e-mail).",
              );
            } else {
              resolve(
                `Relatório: ${registrosInjetados} novos aderidos importados. ${registrosInjetados * BILHETES_POR_PESSOA} bilhetes gerados!`,
              );
            }
          } catch (err: any) {
            console.error("Erro na injeção:", err);
            reject(
              err.message || "Erro desconhecido ao processar a base de dados.",
            );
          }
        },
        error: (err) => reject(`Erro ao ler o ficheiro CSV: ${err.message}`),
      });
    });
  };

  return { buscarAderidos, injetarAderidosCSV };
}
