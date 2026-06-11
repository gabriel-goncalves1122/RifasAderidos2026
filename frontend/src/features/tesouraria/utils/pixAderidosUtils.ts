
import { PixTransacao } from "../types/pixTransacoes";
import { META_RIFAS_ADERIDO } from "./constants";
import { somenteNumeros } from "./formatadores";
export const CPF_NAO_INFORMADO = "CPF não informado";
export const ADERIDO_NAO_VINCULADO = "Sem aderido vinculado";

export interface PixAderidoResumo {
  chave: string;
  nome: string;
  cpf?: string;
  cpfLabel: string;
  totalArrecadado: number;
  quantidadeTransacoesPagas: number;
  rifasPagas: number;
  rifasRestantes: number;
  transacoes: PixTransacao[];
}

export function formatarCpfTesouraria(cpf?: string | null) {
  const cpfNumerico = somenteNumeros(cpf).slice(0, 11);

  if (!cpfNumerico) return CPF_NAO_INFORMADO;
  if (cpfNumerico.length <= 3) return cpfNumerico;
  if (cpfNumerico.length <= 6) {
    return `${cpfNumerico.slice(0, 3)}.${cpfNumerico.slice(3)}`;
  }
  if (cpfNumerico.length <= 9) {
    return `${cpfNumerico.slice(0, 3)}.${cpfNumerico.slice(3, 6)}.${cpfNumerico.slice(6)}`;
  }

  return `${cpfNumerico.slice(0, 3)}.${cpfNumerico.slice(
    3,
    6,
  )}.${cpfNumerico.slice(6, 9)}-${cpfNumerico.slice(9)}`;
}

function obterChaveAderido(transacao: PixTransacao) {
  const cpf = somenteNumeros(transacao.aderido?.cpf);

  if (cpf) return `cpf:${cpf}`;
  if (transacao.aderido?.id) return `id:${transacao.aderido.id}`;
  if (transacao.aderido?.nome) return `nome:${transacao.aderido.nome}`;

  return "sem-aderido";
}

function contarRifasPagasTransacao(transacao: PixTransacao) {
  if (transacao.statusPagamento !== "PAID") return 0;

  if (transacao.rifas?.length) {
    const rifasPagas = new Set(
      transacao.rifas
        .filter((rifa) => !rifa.status || rifa.status === "pago")
        .map((rifa) => rifa.numero),
    );

    return rifasPagas.size;
  }

  return transacao.quantidadeRifas || 0;
}

export function agruparPixAderidos(
  transacoes: PixTransacao[],
): PixAderidoResumo[] {
  const grupos = transacoes.reduce<
    Record<
      string,
      Omit<PixAderidoResumo, "rifasRestantes"> & {
        rifasNumeradasPagas: Set<string>;
        rifasPagasLegado: number;
      }
    >
  >((acc, transacao) => {
    const chave = obterChaveAderido(transacao);
    const nome = transacao.aderido?.nome || ADERIDO_NAO_VINCULADO;
    const cpf = somenteNumeros(transacao.aderido?.cpf);

    if (!acc[chave]) {
      acc[chave] = {
        chave,
        nome,
        cpf: cpf || undefined,
        cpfLabel: formatarCpfTesouraria(cpf),
        totalArrecadado: 0,
        quantidadeTransacoesPagas: 0,
        rifasPagas: 0,
        rifasNumeradasPagas: new Set(),
        rifasPagasLegado: 0,
        transacoes: [],
      };
    }

    acc[chave].transacoes.push(transacao);

    if (transacao.statusPagamento === "PAID") {
      acc[chave].totalArrecadado += transacao.valorPago;
      acc[chave].quantidadeTransacoesPagas += 1;

      if (transacao.rifas?.length) {
        transacao.rifas
          .filter((rifa) => !rifa.status || rifa.status === "pago")
          .forEach((rifa) => acc[chave].rifasNumeradasPagas.add(rifa.numero));
      } else {
        acc[chave].rifasPagasLegado += contarRifasPagasTransacao(transacao);
      }
    }

    return acc;
  }, {});

  return Object.values(grupos)
    .map(({ rifasNumeradasPagas, rifasPagasLegado, ...grupo }) => {
      const rifasPagas = rifasNumeradasPagas.size + rifasPagasLegado;

      return {
        ...grupo,
        rifasPagas,
        rifasRestantes: Math.max(META_RIFAS_ADERIDO - rifasPagas, 0),
      };
    })
    .sort((a, b) => b.totalArrecadado - a.totalArrecadado);
}
