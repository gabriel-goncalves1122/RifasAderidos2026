// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/components/detalhesAderido/ResumoOperacionalAderido.tsx
// ============================================================================
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SellIcon from "@mui/icons-material/Sell";

import { AderidoSecretaria } from "../../../../shared/types/secretaria";

interface ResumoOperacionalAderidoProps {
  aderido: AderidoSecretaria;
}

function formatarMoeda(valor?: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor || 0);
}

export function ResumoOperacionalAderido({
  aderido,
}: ResumoOperacionalAderidoProps) {
  const modalidadeLabel =
    aderido.modalidade_adesao === "meio" ? "Meio-aderido" : "Aderido completo";

  const faixaRifas = aderido.faixa_rifas
    ? `${aderido.faixa_rifas.inicio || "-"} até ${
        aderido.faixa_rifas.fim || "-"
      }`
    : "Não informada";

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        bgcolor: "primary.50",
        borderColor: "primary.100",
      }}
    >
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Resumo operacional
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                size="small"
                color={
                  aderido.modalidade_adesao === "meio" ? "warning" : "primary"
                }
                label={modalidadeLabel}
              />

              <Chip
                size="small"
                variant="outlined"
                label={aderido.status_cadastro || "pendente"}
              />
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <ConfirmationNumberIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Faixa de rifas
                </Typography>
              </Stack>

              <Typography variant="body2" fontWeight={700}>
                {faixaRifas}
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <SellIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Rifas vendidas
                </Typography>
              </Stack>

              <Typography variant="body2" fontWeight={700}>
                {aderido.rifas_vendidas || 0}
              </Typography>
            </Box>

            <Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <AttachMoneyIcon fontSize="small" color="primary" />
                <Typography variant="caption" color="text.secondary">
                  Arrecadado
                </Typography>
              </Stack>

              <Typography variant="body2" fontWeight={700}>
                {formatarMoeda(aderido.total_arrecadado)}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
