import { storage } from "../config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { fetchAPI } from "./api";

export function usePremios() {
  const buscarPremios = async () => {
    try {
      return await fetchAPI("/premios", "GET", undefined, false);
    } catch (error) {
      return null;
    }
  };

  const salvarInfoSorteio = async (dados: any) => {
    await fetchAPI("/sorteio", "PUT", dados);
  };

  const salvarPremio = async (dados: any) => {
    await fetchAPI("/premios", "POST", dados);
  };

  const excluirPremio = async (id: string) => {
    await fetchAPI(`/premios/${id}`, "DELETE");
  };

  const uploadImagemPremio = async (arquivo: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `premios/${Date.now()}_${arquivo.name}`);
      await uploadBytes(storageRef, arquivo);
      return await getDownloadURL(storageRef);
    } catch (error) {
      throw new Error("Falha no upload da imagem para o Firebase Storage.");
    }
  };

  return {
    buscarPremios,
    salvarInfoSorteio,
    salvarPremio,
    excluirPremio,
    uploadImagemPremio,
  };
}
