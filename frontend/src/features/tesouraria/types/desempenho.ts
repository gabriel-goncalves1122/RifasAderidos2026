
export interface ResumoGeralDesempenho {
  totalArrecadado: number;
  rifasPagas: number;
  aderidosAtivos: number;
}

export interface AderidoMetricaDesempenho {
  arrecadado: number;
  meta: number;
}

export interface TransacaoDesempenho {
  status: string;
  dataReserva: string;
  valorTotal: number;
}

export interface ReceitaPorDiaDesempenho {
  data: string;
  dataOrdenacao: number;
  valor: number;
}

export interface BarraResumoDesempenho {
  label: string;
  valor: number;
  cor: string;
}

export interface DesempenhoDados {
  resumoGeral: ResumoGeralDesempenho;
  receitaPorDia: ReceitaPorDiaDesempenho[];
  status: {
    pagas: number;
    pendentes: number;
    total: number;
    barras: BarraResumoDesempenho[];
  };
  metas: {
    bateramMeta: number;
    abaixoMeta: number;
    total: number;
    barras: BarraResumoDesempenho[];
  };
}
