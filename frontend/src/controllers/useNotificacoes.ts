import { fetchAPI } from "./api";

export function useNotificacoes() {
  const buscarNotificacoes = async () => {
    try {
      const result = await fetchAPI("/notificacoes");
      return result.notificacoes || [];
    } catch (error) {
      return [];
    }
  };

  const marcarNotificacoesLidas = async (ids: string[]) => {
    await fetchAPI("/notificacoes/ler", "PUT", { ids });
  };

  return { buscarNotificacoes, marcarNotificacoesLidas };
}
