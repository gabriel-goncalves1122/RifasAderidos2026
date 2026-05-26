// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/GrelhaRifas.tsx
// ============================================================================
import { Box, ButtonBase } from "@mui/material";

import { painelAderidoStyles } from "../styles/painelAderidoStyles";
import { RifaAderido } from "../types/painelAderido";
import { obterConfigStatusRifa } from "../utils/rifasStatus";
import { EmptyRifasState } from "./EmptyRifasState";

interface GrelhaRifasProps {
  rifas: RifaAderido[];
  selecionadas: string[];
  onToggleSelecao: (numero: string, status: string) => void;
  onAbrirDetalhes: (rifa: RifaAderido) => void;
}

function montarEstiloRifa(
  rifa: RifaAderido,
  isSelecionada: boolean,
  podeClicar: boolean,
) {
  const config = obterConfigStatusRifa(rifa.status);

  if (isSelecionada) {
    return {
      bgcolor: "#052E23",
      color: "#FFFFFF",
      borderColor: "#052E23",
      boxShadow: "0 8px 16px rgba(5, 46, 35, 0.20)",

      "&:hover": {
        bgcolor: "#031F18",
        borderColor: "#031F18",
        transform: "translateY(-1px)",
        boxShadow: "0 10px 20px rgba(5, 46, 35, 0.24)",
      },

      "&.Mui-disabled": {
        color: "#FFFFFF",
        opacity: 1,
      },
    };
  }

  return {
    bgcolor: config.bg,
    color: config.color,
    borderColor: config.border,
    boxShadow: "0 3px 8px rgba(2, 27, 22, 0.045)",

    "&:hover": {
      bgcolor: podeClicar ? config.hoverBg : config.bg,
      borderColor: podeClicar ? "#8DBEAD" : config.border,
      transform: podeClicar ? "translateY(-1px)" : "none",
      boxShadow: podeClicar
        ? "0 8px 16px rgba(2, 27, 22, 0.08)"
        : "0 3px 8px rgba(2, 27, 22, 0.045)",
    },

    "&.Mui-disabled": {
      color: config.color,
      opacity: 1,
    },
  };
}

export function GrelhaRifas({
  rifas,
  selecionadas,
  onToggleSelecao,
  onAbrirDetalhes,
}: GrelhaRifasProps) {
  if (rifas.length === 0) {
    return <EmptyRifasState />;
  }

  return (
    <Box sx={painelAderidoStyles.gridRifasWrapper}>
      <Box sx={painelAderidoStyles.gridRifas}>
        {rifas.map((rifa) => {
          const isSelecionada = selecionadas.includes(rifa.numero);
          const config = obterConfigStatusRifa(rifa.status);
          const podeClicar = config.selecionavel || config.abreDetalhes;

          const handleClick = () => {
            // Rifas disponíveis entram ou saem da seleção atual.
            if (config.selecionavel) {
              onToggleSelecao(rifa.numero, rifa.status);
              return;
            }

            // Rifas pagas abrem detalhes, mas não entram no carrinho.
            if (config.abreDetalhes) {
              onAbrirDetalhes(rifa);
            }
          };

          return (
            <ButtonBase
              key={rifa.numero}
              onClick={podeClicar ? handleClick : undefined}
              disabled={!podeClicar}
              aria-label={`Rifa ${rifa.numero} - ${config.label}`}
              aria-pressed={isSelecionada}
              sx={{
                ...painelAderidoStyles.rifaButton,
                cursor: podeClicar ? "pointer" : "default",
                ...montarEstiloRifa(rifa, isSelecionada, podeClicar),
              }}
            >
              {rifa.numero}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
