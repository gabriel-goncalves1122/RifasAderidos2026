import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { Aderido } from "../views/pages/SecretariaPage";
import { fetchAPI } from "./api"; // <-- Importamos a nossa ponte para o Backend

export function useSecretaria() {
  // ==========================================================================
  // BUSCAR TODOS OS ADERIDOS (Mantemos no Frontend para leituras rápidas)
  // ==========================================================================
  const buscarAderidos = async (): Promise<Aderido[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const lista: Aderido[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        lista.push({
          id: docSnap.id,
          email: data.email || data["E-mail"] || docSnap.id,
          nome: data.nome || "",
          cargo: data.cargo || data.Cargo || "",
          status_cadastro: data.uid ? "ativo" : "pendente",
        });
      });

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
  // ADICIONAR ADERIDO (AGORA DELEGA TUDO PARA O BACKEND)
  // ==========================================================================
  const adicionarAderidoIndividual = async (dadosNovos: any) => {
    try {
      // Fazemos o POST para a rota administrativa do nosso backend
      const resposta = await fetchAPI("/admin/aderidos", "POST", dadosNovos);
      return resposta;
    } catch (error: any) {
      console.error("Erro na criação do aderido:", error);
      throw new Error(error.message || "Erro ao adicionar o utilizador.");
    }
  };

  return { buscarAderidos, adicionarAderidoIndividual };
}
