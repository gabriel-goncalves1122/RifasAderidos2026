import { Box } from "@mui/material";

import { EstatisticasAderido } from "../../EstatisticasAderido";
import { AbaRecusadas } from "../../AbaRecusadas";
import { CarrinhoFlutuante } from "../../CarrinhoFlutuante";
import { BlocoVendasHeader } from "../BlocoVendasHeader";
import { FiltrosRifas } from "../FiltrosRifas";
import { GrelhaRifas } from "../GrelhaRifas";
import { painelAderidoStyles } from "../../styles/painelAderidoStyles";
import type { GrupoRifasRecusadas, FiltroRifasAderido, RifaAderido } from "../../types/painelAderido";

interface MinhasRifasDesktopViewProps {
  visaoAtual: string;
  primeiroNome: string;
  valorArrecadado: number;
  notificacoesNaoLidas: number;
  totalPendencias: number;
  onAbrirNotificacoes: () => void;
  onAbrirRecusadas: () => void;
  filtro: FiltroRifasAderido;
  onChangeFiltro: (filtro: FiltroRifasAderido) => void;
  rifasFiltradas: RifaAderido[];
  selecionadas: string[];
  onToggleSelecao: (numero: string, status: string) => void;
  onAbrirDetalhes: (rifa: RifaAderido) => void;
  gruposRecusados: GrupoRifasRecusadas[];
  onVoltar: () => void;
  onAbrirCorrecao: (grupo: GrupoRifasRecusadas) => void;
  possuiSelecao: boolean;
  valorTotalSelecionado: number;
  onVenderClick: () => void;
}

export function MinhasRifasDesktopView({
  visaoAtual,
  primeiroNome,
  valorArrecadado,
  notificacoesNaoLidas,
  totalPendencias,
  onAbrirNotificacoes,
  onAbrirRecusadas,
  filtro,
  onChangeFiltro,
  rifasFiltradas,
  selecionadas,
  onToggleSelecao,
  onAbrirDetalhes,
  gruposRecusados,
  onVoltar,
  onAbrirCorrecao,
  possuiSelecao,
  valorTotalSelecionado,
  onVenderClick,
}: MinhasRifasDesktopViewProps) {
  return (
    <Box sx={painelAderidoStyles.root}>
      <EstatisticasAderido
        primeiroNome={primeiroNome}
        valorArrecadado={valorArrecadado}
        notificacoesNaoLidas={notificacoesNaoLidas}
        totalPendencias={totalPendencias}
        onAbrirNotificacoes={onAbrirNotificacoes}
        onAbrirRecusadas={onAbrirRecusadas}
      />

      {visaoAtual === "geral" ? (
        <Box sx={painelAderidoStyles.blocoVendasArea}>
          <BlocoVendasHeader />

          <FiltrosRifas
            filtro={filtro}
            onChangeFiltro={onChangeFiltro}
          />

          <GrelhaRifas
            rifas={rifasFiltradas}
            selecionadas={selecionadas}
            onToggleSelecao={onToggleSelecao}
            onAbrirDetalhes={onAbrirDetalhes}
          />
        </Box>
      ) : (
        <AbaRecusadas
          gruposRecusados={gruposRecusados}
          onVoltar={onVoltar}
          onAbrirCorrecao={onAbrirCorrecao}
        />
      )}

      {possuiSelecao && visaoAtual === "geral" && (
        <CarrinhoFlutuante
          quantidade={selecionadas.length}
          valorTotal={valorTotalSelecionado}
          onVenderClick={onVenderClick}
        />
      )}
    </Box>
  );
}
