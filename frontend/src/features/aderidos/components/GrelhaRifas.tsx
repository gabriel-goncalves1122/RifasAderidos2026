// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/GrelhaRifas.tsx
// ============================================================================
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, ButtonBase, Tooltip } from "@mui/material";

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
      bgcolor: "#063D31",
      color: "#FFFFFF",
      borderColor: "#063D31",
      boxShadow: "0 8px 16px rgba(6, 61, 49, 0.20)",

      "&:hover": {
        bgcolor: "#021B16",
        borderColor: "#021B16",
        transform: "translateY(-1px)",
        boxShadow: "0 10px 20px rgba(6, 61, 49, 0.24)",
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
          const tooltip = config.selecionavel
            ? "Clique para vender"
            : config.abreDetalhes
              ? "Clique para ver detalhes"
              : "";
          const ariaLabel = config.selecionavel
            ? `Rifa ${rifa.numero} disponível para vender`
            : config.abreDetalhes
              ? `Rifa ${rifa.numero} paga, clique para ver detalhes`
              : `Rifa ${rifa.numero} - ${config.label}`;

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

          const botaoRifa = (
            <ButtonBase
              key={rifa.numero}
              data-testid={`rifa-${rifa.numero}`}
              onClick={podeClicar ? handleClick : undefined}
              disabled={!podeClicar}
              aria-label={ariaLabel}
              aria-pressed={isSelecionada}
              sx={{
                ...painelAderidoStyles.rifaButton,
                position: "relative",
                cursor: config.abreDetalhes
                  ? "help"
                  : config.selecionavel
                    ? "pointer"
                    : "default",
                ...montarEstiloRifa(rifa, isSelecionada, podeClicar),
              }}
            >
              {config.abreDetalhes && (
                <InfoOutlinedIcon
                  data-testid={`rifa-${rifa.numero}-detalhes-icon`}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    fontSize: 15,
                    color: "#063D31",
                  }}
                />
              )}

              {rifa.numero}
            </ButtonBase>
          );

          if (!tooltip) return botaoRifa;

          return (
            <Tooltip key={rifa.numero} title={tooltip} arrow>
              {botaoRifa}
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
