import { premiosService } from "../services/premiosService";

export function usePremios() {
  return {
    buscarPremios: premiosService.buscar,
    salvarInfoSorteio: premiosService.salvarInfoSorteio,
    salvarPremio: premiosService.salvarPremio,
    excluirPremio: premiosService.excluir,
    uploadImagemPremio: premiosService.uploadImagem,
  };
}
