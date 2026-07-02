export type {
  AderidoSecretaria,
  FaixaRifasSecretaria,
  FiltroTipoUsuario,
  FormEditarAderido,
  FormNovoAderido,
  ModalidadeAdesao,
  StatusCadastro,
} from "../../../../shared/types/secretaria";

export type SortDir = "asc" | "desc";

export type SecretariaTipoUsuarioTab = "aderidos" | "comissao";

export interface SortConfig {
  sortBy: string | null;
  sortDir: SortDir;
}

export interface Notificacao {
  open: boolean;
  mensagem: string;
  severidade: "success" | "error" | "info" | "warning";
}
