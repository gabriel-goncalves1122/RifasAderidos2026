// ============================================================================
// ARQUIVO: useRifasController.ts (Fica na pasta /controllers)
// ============================================================================

import { useState, useCallback } from "react";
import { storage, auth } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export function useRifasController() {
  const [loading, setLoading] = useState(false);

  // =========================================================
  // 1. BUSCAR AS RIFAS DO ADERIDO
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
          headers: { Authorization: `Bearer ${token}` },
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
  // 2. FINALIZAR A VENDA (Com Upload Blindado e Metadados)
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

      console.log("1. Iniciando Upload Seguro para o Storage...");

      // A. PREPARAÇÃO DO ARQUIVO
      const extensao = dados.comprovante.name.split(".").pop();
      const nomeArquivo = `comprovantes/${user.uid}_${Date.now()}.${extensao}`;
      const storageRef = ref(storage, nomeArquivo);

      // B. A MÁGICA DOS METADADOS: Carimbando as informações no arquivo!
      const metadata = {
        contentType: dados.comprovante.type,
        customMetadata: {
          vendedorId: user.uid,
          nomeComprador: dados.nome,
          bilhetesVendidos: dados.numerosRifas.join(","), // Salva ex: "00123,00124"
          dataUpload: new Date().toISOString(),
        },
      };

      // C. EXECUÇÃO DO UPLOAD (Agora enviando a imagem + metadados juntos)
      const snapshot = await uploadBytesResumable(
        storageRef,
        dados.comprovante,
        metadata, // <-- Metadados injetados aqui
      );

      const comprovanteUrl = await getDownloadURL(snapshot.ref);
      console.log("2. UPLOAD CONCLUÍDO. URL GERADA:", comprovanteUrl);

      // D. REGISTRO NO BACKEND
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
