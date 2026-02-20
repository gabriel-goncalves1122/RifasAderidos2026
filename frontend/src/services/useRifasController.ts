import { useState, useCallback } from "react";
import { storage, auth } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function useRifasController() {
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 1. BUSCAR AS RIFAS DO ADERIDO (Não apague esta função!)
  // =========================================================
  const buscarMinhasRifas = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const token = await user.getIdToken();

      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/minhas-rifas",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao buscar rifas");
      }

      return result.bilhetes;
    } catch (error) {
      console.error("Erro ao buscar rifas:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // 2. FINALIZAR A VENDA (Com o seu Upload)
  // =========================================================
  const finalizarVenda = async (dados: {
    nome: string;
    telefone: string;
    email: string;
    numerosRifas: string[];
    comprovante: File;
  }) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      console.log("1. Iniciando Upload...");

      // Upload para o Firebase Storage
      const extensao = dados.comprovante.name.split(".").pop();
      const nomeArquivo = `comprovantes/${user.uid}_${Date.now()}.${extensao}`;
      const storageRef = ref(storage, nomeArquivo);
      const snapshot = await uploadBytesResumable(
        storageRef,
        dados.comprovante,
      );
      const comprovanteUrl = await getDownloadURL(snapshot.ref);

      console.log("3. URL DA IMAGEM GERADA:", comprovanteUrl);

      // Chamada para o Backend
      const token = await user.getIdToken();
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/vender",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome: dados.nome,
            telefone: dados.telefone,
            email: dados.email,
            numerosRifas: dados.numerosRifas,
            comprovanteUrl: comprovanteUrl,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Erro ao salvar venda");

      alert("Teste de Upload: SUCESSO! Olhe o console (F12) para ver o link.");
      return true;
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao finalizar venda. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { buscarMinhasRifas, finalizarVenda, loading };
}
