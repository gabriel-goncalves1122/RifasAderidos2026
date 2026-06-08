import { Box, Drawer, Paper, Stack, Typography } from "@mui/material";

import { PixAderidoResumo } from "../../../../utils/pixAderidosUtils";
import {
  formatarDataPix,
  formatarMoedaPix,
} from "../../../../utils/pixTransacoesUtils";

interface PixAderidoDetalhesDrawerProps {
  aderido: PixAderidoResumo | null;
  onClose: () => void;
}

export function PixAderidoDetalhesDrawer({
  aderido,
  onClose,
}: PixAderidoDetalhesDrawerProps) {
  const transacoesPagas = (aderido?.transacoes || []).filter(
    (transacao) => transacao.statusPagamento === "PAID",
  );

  return (
    <Drawer
      anchor="bottom"
      open={Boolean(aderido)}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          p: 2,
          bgcolor: "#FFFFFF",
        },
      }}
    >
      {aderido && (
        <Stack spacing={2} sx={{ pb: 1 }}>
          <Box
            sx={{
              width: 42,
              height: 4,
              borderRadius: 999,
              bgcolor: "rgba(2, 27, 22, 0.18)",
              mx: "auto",
            }}
          />

          <Box>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 950,
                fontSize: "1.08rem",
                lineHeight: 1.2,
              }}
            >
              {aderido.nome}
            </Typography>
            <Typography sx={{ color: "#526760", fontSize: "0.82rem", mt: 0.4 }}>
              {aderido.cpfLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.25,
                borderRadius: 2,
                bgcolor: "#EAF3EF",
                border: "1px solid rgba(6, 61, 49, 0.14)",
              }}
            >
              <Typography sx={{ color: "#526760", fontSize: "0.72rem" }}>
                Arrecadado
              </Typography>
              <Typography sx={{ color: "#063D31", fontWeight: 950, mt: 0.35 }}>
                {formatarMoedaPix(aderido.totalArrecadado)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 1.25,
                borderRadius: 2,
                bgcolor: "#F6F8F7",
                border: "1px solid rgba(2, 27, 22, 0.08)",
              }}
            >
              <Typography sx={{ color: "#526760", fontSize: "0.72rem" }}>
                Rifas restantes
              </Typography>
              <Typography sx={{ color: "#021B16", fontWeight: 950, mt: 0.35 }}>
                {aderido.rifasRestantes}
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 900,
                fontSize: "0.92rem",
                mb: 1,
              }}
            >
              Transações relacionadas
            </Typography>

            <Stack spacing={1}>
              {transacoesPagas.length > 0 ? (
                transacoesPagas.slice(0, 5).map((transacao) => (
                  <Box
                    key={transacao.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      py: 0.85,
                      borderTop: "1px solid rgba(2, 27, 22, 0.08)",
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#021B16",
                          fontWeight: 850,
                          fontSize: "0.85rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {transacao.compradorNome || "Pagador não informado"}
                      </Typography>
                      <Typography sx={{ color: "#526760", fontSize: "0.75rem" }}>
                        {formatarDataPix(transacao.dataPagamento)}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: "#063D31",
                        fontWeight: 950,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatarMoedaPix(transacao.valorPago)}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "#526760", fontSize: "0.85rem" }}>
                  Nenhum Pix pago vinculado.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>
      )}
    </Drawer>
  );
}
