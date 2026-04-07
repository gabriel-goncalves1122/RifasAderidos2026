import { useState, useCallback } from "react";
import { storage, auth } from "../config/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { fetchAPI } from "./api";

export function useRifas() {
  const [loading, setLoading] = useState(false);

  const buscarMinhasRifas = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAPI("/minhas-rifas");
      return result.bilhetes || [];
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

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

      const extensao = dados.comprovante.name.split(".").pop();
      const nomeArquivo = `comprovantes/${user.uid}_${Date.now()}.${extensao}`;
      const storageRef = ref(storage, nomeArquivo);
      const metadata = {
        contentType: dados.comprovante.type,
        customMetadata: {
          vendedorId: user.uid,
          bilhetesVendidos: dados.numerosRifas.join(","),
        },
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        dados.comprovante,
        metadata,
      );
      const comprovanteUrl = await getDownloadURL(snapshot.ref);

      await fetchAPI("/vender", "POST", {
        nome: dados.nome,
        telefone: dados.telefone,
        email: dados.email,
        numerosRifas: dados.numerosRifas,
        comprovanteUrl,
      });
      return true;
    } catch (error) {
      alert("Erro ao finalizar venda. Tente novamente.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const anexarComprovante = async (rifaId: string, arquivo: File) => {
    try {
      const storageRef = ref(
        storage,
        `comprovantes_atrasados/${Date.now()}_${arquivo.name}`,
      );
      await uploadBytes(storageRef, arquivo);
      const urlDaImagem = await getDownloadURL(storageRef);

      await fetchAPI(`/${rifaId}/comprovante`, "PUT", {
        comprovante_url: urlDaImagem,
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  return { buscarMinhasRifas, finalizarVenda, anexarComprovante, loading };
}
