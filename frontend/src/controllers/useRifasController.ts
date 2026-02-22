// ============================================================================
// ARQUIVO: useRifasController.ts (Fica na pasta /controllers)
// ============================================================================

import { useState, useCallback } from "react";
import { storage, auth } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth"; // <-- ADICIONE ISSO AQUI NO TOPO

export function useRifasController() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        `http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/minhas-rifas`,
        { method: "GET", headers: { Authorization: `Bearer ${token}` } },
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

  // =========================================================
  // [ADMIN] BUSCAR RIFAS PENDENTES
  // =========================================================
  const buscarPendentes = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const token = await user.getIdToken();
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/pendentes",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Erro ao buscar pendentes");

      return result.bilhetes;
    } catch (error) {
      console.error("Erro ao buscar pendentes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // [ADMIN] AVALIAR COMPROVANTE EM LOTE (Aprovar/Rejeitar)
  // =========================================================
  const avaliarComprovante = async (
    numerosRifas: string[], // <--- AGORA RECEBE UM ARRAY DE STRINGS
    decisao: "aprovar" | "rejeitar",
  ) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const token = await user.getIdToken();
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/avaliar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ numerosRifas, decisao }), // <--- ENVIA O ARRAY PARA O BACKEND
        },
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erro ao avaliar rifa");

      return true;
    } catch (error) {
      console.error("Erro ao avaliar:", error);
      alert("Falha ao processar a avaliação. Tente novamente.");
      return false;
    }
  };

  // ==========================================================================
  // BUSCAR RELATÓRIO GERAL (Exclusivo da Tesouraria)
  // ==========================================================================
  const buscarRelatorio = async () => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      const token = await user.getIdToken();
      // Lembre-se de usar a sua variável de ambiente API_URL se tiver
      const response = await fetch(
        `http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/relatorio`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Falha ao buscar relatório.");

      return await response.json();
    } catch (err: any) {
      console.error("Erro no relatório:", err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // [ADMIN] BUSCAR HISTÓRICO COMPLETO (Para gráficos e CSV)
  // =========================================================
  const buscarHistoricoDetalhado = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");

      const token = await user.getIdToken();
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/historico",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      return result.historico;
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      return [];
    }
  };

  // =========================================================
  // GESTÃO DE PRÊMIOS (FRONTEND)
  // =========================================================
  const buscarPremios = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/premios",
      );
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Erro ao buscar prêmios:", error);
      return null;
    }
  };

  const salvarInfoSorteio = async (dados: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");
      const token = await user.getIdToken();

      await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/sorteio",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dados),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar sorteio:", error);
    }
  };

  const uploadImagemPremio = async (arquivo: File): Promise<string> => {
    try {
      const { ref, uploadBytes, getDownloadURL } =
        await import("firebase/storage");
      const nomeArquivo = `premios/${Date.now()}_${arquivo.name}`;
      const storageRef = ref(storage, nomeArquivo);
      await uploadBytes(storageRef, arquivo);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Erro ao subir imagem:", error);
      throw new Error("Falha no upload da imagem");
    }
  };

  const salvarPremio = async (dados: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");
      const token = await user.getIdToken();

      await fetch(
        "http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/premios",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dados),
        },
      );
    } catch (error) {
      console.error("Erro ao salvar prêmio:", error);
    }
  };

  const excluirPremio = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");
      const token = await user.getIdToken();

      await fetch(
        `http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/premios/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (error) {
      console.error("Erro ao excluir prêmio:", error);
    }
  };

  // =========================================================
  // GESTÃO DE COMPROVANTES (ADERIDO)
  // =========================================================
  const anexarComprovante = async (rifaId: string, arquivo: File) => {
    try {
      // 1. Reutilizamos a lógica de upload para o Firebase Storage
      const urlDaImagem = await uploadImagemPremio(arquivo);

      // 2. Avisamos o Backend que esta rifa agora tem um comprovante
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não logado");
      const token = await user.getIdToken();

      await fetch(
        `http://127.0.0.1:5001/rifasaderidos2026/us-central1/api/rifas/${rifaId}/comprovante`,
        {
          method: "PUT", // Ou POST, dependendo de como está na sua API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comprovante_url: urlDaImagem }),
        },
      );

      return true;
    } catch (error) {
      console.error("Erro ao anexar comprovante:", error);
      return false;
    }
  };

  return {
    buscarMinhasRifas,
    finalizarVenda,
    buscarPendentes,
    avaliarComprovante,
    buscarRelatorio,
    buscarHistoricoDetalhado,
    excluirPremio,
    salvarPremio,
    uploadImagemPremio,
    buscarPremios,
    salvarInfoSorteio,
    anexarComprovante,

    loading,
    error,
  };
}
