import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/shared/config/firebase";

export const storageService = {
  async uploadImagem(arquivo: File, pasta = "premios"): Promise<string> {
    const storageRef = ref(storage, `${pasta}/${Date.now()}_${arquivo.name}`);
    await uploadBytes(storageRef, arquivo);
    return getDownloadURL(storageRef);
  },
};
