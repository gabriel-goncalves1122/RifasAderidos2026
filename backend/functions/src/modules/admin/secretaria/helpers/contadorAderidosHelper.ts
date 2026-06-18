export interface EstadoContadorAderidos {
  ultimaPosicao: number;
  ultimoBilhete: number;
}

interface DocumentoLegado {
  id?: string;
  data?: () => unknown;
}

const ESTADO_CONTADOR_VAZIO: EstadoContadorAderidos = {
  ultimaPosicao: 0,
  ultimoBilhete: 0,
};

function lerDados(doc: DocumentoLegado): Record<string, unknown> {
  const dados = doc.data?.();
  return dados && typeof dados === "object" ? (dados as Record<string, unknown>) : {};
}

function numeroInteiroPositivo(valor: unknown): number {
  const numero =
    typeof valor === "number"
      ? valor
      : typeof valor === "string"
        ? Number.parseInt(valor.replace(/\D/g, ""), 10)
        : Number.NaN;

  return Number.isFinite(numero) && numero > 0 ? Math.floor(numero) : 0;
}

function extrairPosicaoPorId(id?: string): number {
  const match = id?.match(/^ADERIDO_(\d+)$/i);
  return match ? numeroInteiroPositivo(match[1]) : 0;
}

function extrairFimFaixaRifas(dados: Record<string, unknown>): number {
  const faixa = dados.faixa_rifas;

  if (!faixa || typeof faixa !== "object") {
    return 0;
  }

  return numeroInteiroPositivo((faixa as Record<string, unknown>).fim);
}

export function reconstruirEstadoContadorAderidosLegado(
  usuarioDocs: DocumentoLegado[],
  bilheteDocs: DocumentoLegado[],
): EstadoContadorAderidos {
  const ultimaPosicao = usuarioDocs.reduce((maior, doc) => {
    const dados = lerDados(doc);
    return Math.max(
      maior,
      numeroInteiroPositivo(dados.posicao_adesao),
      extrairPosicaoPorId(doc.id),
    );
  }, ESTADO_CONTADOR_VAZIO.ultimaPosicao);

  const maiorBilheteEmUsuarios = usuarioDocs.reduce((maior, doc) => {
    return Math.max(maior, extrairFimFaixaRifas(lerDados(doc)));
  }, ESTADO_CONTADOR_VAZIO.ultimoBilhete);

  const maiorBilheteEmBilhetes = bilheteDocs.reduce((maior, doc) => {
    const dados = lerDados(doc);
    return Math.max(
      maior,
      numeroInteiroPositivo(doc.id),
      numeroInteiroPositivo(dados.numero),
    );
  }, ESTADO_CONTADOR_VAZIO.ultimoBilhete);

  return {
    ultimaPosicao,
    ultimoBilhete: Math.max(maiorBilheteEmUsuarios, maiorBilheteEmBilhetes),
  };
}

export function normalizarEstadoContadorAderidos(
  dados: Record<string, unknown> | undefined,
  fallback: EstadoContadorAderidos = ESTADO_CONTADOR_VAZIO,
): EstadoContadorAderidos {
  return {
    ultimaPosicao:
      numeroInteiroPositivo(dados?.ultima_posicao) || fallback.ultimaPosicao,
    ultimoBilhete:
      numeroInteiroPositivo(dados?.ultimo_bilhete) || fallback.ultimoBilhete,
  };
}
