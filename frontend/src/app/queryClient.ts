import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000, // 5 minutos globais para obsoleto
      gcTime: 10 * 60_000, // 10 minutos no lixo
      retry: 1,
      refetchOnWindowFocus: false, // Pode ser mantido false para evitar requisições desnecessárias a cada alt+tab
    },
    mutations: {
      retry: 0,
    },
  },
});
