// ============================================================================
// ARQUIVO: frontend/src/controllers/useSecretaria.ts
// RESPONSABILIDADE: Lógica de negócio e comunicação com Firebase para a Secretaria.
// ============================================================================
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase"; // Ajuste o caminho se necessário
import { Aderido } from "../views/pages/SecretariaPage"; // Tipagem que está na View

export function useSecretaria() {
  // Busca a lista de todos os usuários cadastrados e injetados
  const buscarAderidos = async (): Promise<Aderido[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista: Aderido[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lista.push({
          id: doc.id,
          email: data.email || doc.id,
          nome: data.nome || "",
          cargo: data.cargo || "aderido",
          status_cadastro: data.nome ? "ativo" : "pendente",
        });
      });

      // Ordena: Ativos primeiro, depois ordem alfabética
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

  // Função placeholder para a futura injeção de dados via CSV da Keeper
  const injetarAderidosLote = async (dadosCsv: any[]) => {
    // TODO: Implementar lógica de salvar no Firestore em Lote (Batch)
    console.log("Dados prontos para injeção:", dadosCsv);
    return true;
  };

  return {
    buscarAderidos,
    injetarAderidosLote,
  };
}
