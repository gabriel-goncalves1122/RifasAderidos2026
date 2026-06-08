export type TipoNotificacaoRifa =
  | "correcao_dados"
  | "rifa_liberada"
  | "informativo";

export interface NotificacaoRifa {
  id: string;
  titulo?: string | null;
  mensagem?: string | null;
  lida?: boolean;
  data_criacao?: string | null;
  rifas?: string[];
  tipo?: TipoNotificacaoRifa | string | null;
}
