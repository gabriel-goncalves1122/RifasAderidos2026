// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/utils/calcularResumoSecretaria.ts
// ============================================================================
import { AderidoSecretaria } from "../../../shared/types/secretaria";
import { ResumoSecretaria } from "../components/ResumoSecretariaCards";

function isUsuarioComissao(aderido: AderidoSecretaria): boolean {
  return !!aderido.cargo && aderido.cargo.toLowerCase() !== "aderido";
}

export function calcularResumoSecretaria(
  aderidos: AderidoSecretaria[],
): ResumoSecretaria {
  return aderidos.reduce<ResumoSecretaria>(
    (resumo, aderido) => {
      const modalidade = aderido.modalidade_adesao || "completo";

      resumo.total += 1;

      if (modalidade === "meio") {
        resumo.meioAderidos += 1;
      } else {
        resumo.aderidos += 1;
      }

      if (aderido.status_cadastro === "pendente") {
        resumo.pendentes += 1;
      }

      if (isUsuarioComissao(aderido)) {
        resumo.comissao += 1;
      }

      return resumo;
    },
    {
      total: 0,
      aderidos: 0,
      meioAderidos: 0,
      pendentes: 0,
      comissao: 0,
    },
  );
}
