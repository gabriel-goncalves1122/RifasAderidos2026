// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/utils/filtrarAderidos.ts
// ============================================================================
import {
  AderidoSecretaria,
  FiltroTipoUsuario,
  ModalidadeAdesao,
  StatusCadastro,
} from "../../../shared/types/secretaria";

interface FiltrosSecretaria {
  busca: string;
  modalidade: "todos" | ModalidadeAdesao;
  status: "todos" | StatusCadastro;
  tipoUsuario: FiltroTipoUsuario;
}

function isUsuarioComissao(aderido: AderidoSecretaria): boolean {
  return !!aderido.cargo && aderido.cargo.toLowerCase() !== "aderido";
}

export function filtrarAderidos(
  aderidos: AderidoSecretaria[],
  filtros: FiltrosSecretaria,
): AderidoSecretaria[] {
  const termo = filtros.busca.trim().toLowerCase();

  return aderidos.filter((aderido) => {
    const modalidade = aderido.modalidade_adesao || "completo";
    const usuarioComissao = isUsuarioComissao(aderido);

    const matchBusca =
      !termo ||
      aderido.nome?.toLowerCase().includes(termo) ||
      aderido.email.toLowerCase().includes(termo);

    const matchModalidade =
      filtros.modalidade === "todos" || modalidade === filtros.modalidade;

    const matchStatus =
      filtros.status === "todos" || aderido.status_cadastro === filtros.status;

    const matchTipoUsuario =
      filtros.tipoUsuario === "todos" ||
      (filtros.tipoUsuario === "comissao" && usuarioComissao) ||
      (filtros.tipoUsuario === "aderidos" && !usuarioComissao);

    return matchBusca && matchModalidade && matchStatus && matchTipoUsuario;
  });
}
