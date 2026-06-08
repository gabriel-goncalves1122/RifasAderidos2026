import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button, Chip, Collapse, Paper, Stack, Typography } from "@mui/material";

import { StatusValidacaoPix } from "../../../../types/pixTransacoes";
import {
  PIX_VALIDACAO_VISUAL,
  obterVisualStatusValidacaoPix,
} from "../../../../utils/pixValidacaoUtils";

interface PixStatusLegendaProps {
  colapsavel?: boolean;
}

const STATUS_LEGENDA: StatusValidacaoPix[] = [
  "pendente_validacao",
  "aceita",
  "negada",
  "sem_confirmacao_bancaria",
];

function ConteudoLegenda() {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {STATUS_LEGENDA.map((status) => {
        const visual = obterVisualStatusValidacaoPix(status);

        return (
          <Chip
            key={status}
            label={`${visual.label}: ${visual.descricao}`}
            size="small"
            sx={{
              maxWidth: { xs: "100%", sm: "none" },
              height: "auto",
              minHeight: 30,
              borderRadius: 2,
              color: visual.color,
              bgcolor: visual.bgcolor,
              border: visual.border,
              fontWeight: 800,
              "& .MuiChip-label": {
                whiteSpace: "normal",
                py: 0.5,
              },
            }}
          />
        );
      })}
    </Stack>
  );
}

export function PixStatusLegenda({ colapsavel = false }: PixStatusLegendaProps) {
  const [aberta, setAberta] = useState(!colapsavel);

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        mb: 2,
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
      }}
    >
      <Stack spacing={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
        >
          <Typography
            sx={{
              color: "#021B16",
              fontSize: "0.84rem",
              fontWeight: 900,
            }}
          >
            Legenda de status
          </Typography>

          {colapsavel && (
            <Button
              type="button"
              size="small"
              aria-expanded={aberta}
              onClick={() => setAberta((valor) => !valor)}
              endIcon={
                <ExpandMoreIcon
                  sx={{
                    transform: aberta ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 160ms ease",
                  }}
                />
              }
              sx={{
                minWidth: 0,
                color: "#063D31",
                fontWeight: 850,
                textTransform: "none",
              }}
            >
              {aberta ? "Ocultar" : "Ver"}
            </Button>
          )}
        </Stack>

        <Collapse in={aberta} unmountOnExit={colapsavel}>
          <ConteudoLegenda />
        </Collapse>
      </Stack>
    </Paper>
  );
}

export const pixStatusLegendaLabels = PIX_VALIDACAO_VISUAL;
