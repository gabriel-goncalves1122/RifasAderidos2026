import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import { AuditoriaCompraActions } from "../shared/AuditoriaCompraActions";
import { AuditoriaStatusChip } from "../shared/AuditoriaStatusChip";
import { CompraAuditavel } from "../../../types/auditoriaCompras";
import {
  formatarDataAuditoria,
  formatarMoedaAuditoria,
} from "../../../utils/auditoriaComprasUtils";

interface AuditoriaComprasCardProps {
  compra: CompraAuditavel;
  onVerComprovante: (compra: CompraAuditavel) => void;
  onEditar: (compra: CompraAuditavel) => void;
  onVerDetalhes: (compra: CompraAuditavel) => void;
}

export function AuditoriaCompraCard({
  compra,
  onVerComprovante,
  onEditar,
  onVerDetalhes,
}: AuditoriaComprasCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 12px 28px rgba(2, 27, 22, 0.07)",
        overflow: "hidden",
      }}
    >
      <Stack spacing={0}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={1}
          sx={{
            p: 1.5,
            borderLeft: "5px solid #063D31",
            borderBottom: "1px solid rgba(2, 27, 22, 0.08)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 950,
                fontSize: "1rem",
                lineHeight: 1.18,
              }}
            >
              {compra.comprador_nome}
            </Typography>
            <Typography sx={{ color: "#526760", fontSize: "0.78rem", mt: 0.35 }}>
              {formatarDataAuditoria(compra.data_reserva)}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography
              sx={{
                color: "#063D31",
                fontWeight: 950,
                fontSize: "1.12rem",
                whiteSpace: "nowrap",
              }}
            >
              {formatarMoedaAuditoria(compra.valor_total)}
            </Typography>
            <Typography sx={{ color: "#526760", fontSize: "0.74rem", mt: 0.25 }}>
              {compra.bilhetes.length} rifa(s)
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={1.25} sx={{ p: 1.5 }}>
          <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
            <AuditoriaStatusChip status={compra.status} />
            {compra.comprovante_url ? (
              <Chip
                label="Com comprovante"
                size="small"
                sx={{
                  height: 28,
                  borderRadius: 2,
                  bgcolor: "#EAF3EF",
                  color: "#063D31",
                  fontWeight: 850,
                }}
              />
            ) : (
              <Chip
                label="Sem comprovante"
                size="small"
                sx={{
                  height: 28,
                  borderRadius: 2,
                  bgcolor: "#F6F8F7",
                  color: "#526760",
                  fontWeight: 850,
                }}
              />
            )}
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 1,
            }}
          >
            <Box
              sx={{
                p: 1.15,
                borderRadius: 2.25,
                bgcolor: "#F6F8F7",
                border: "1px solid rgba(2, 27, 22, 0.08)",
              }}
            >
              <Typography
                sx={{
                  color: "#526760",
                  fontSize: "0.72rem",
                  fontWeight: 850,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Contato do comprador
              </Typography>
              <Typography
                sx={{
                  color: "#021B16",
                  fontWeight: 850,
                  mt: 0.25,
                  overflowWrap: "anywhere",
                }}
              >
                {compra.comprador_email || "Sem e-mail"}
              </Typography>
              <Typography sx={{ color: "#526760", fontSize: "0.8rem", mt: 0.2 }}>
                {compra.comprador_telefone || "Sem telefone"}
              </Typography>
            </Box>

            <Box
              sx={{
                p: 1.15,
                borderRadius: 2.25,
                bgcolor: "#EAF3EF",
                border: "1px solid rgba(6, 61, 49, 0.12)",
              }}
            >
              <Typography
                sx={{
                  color: "#526760",
                  fontSize: "0.72rem",
                  fontWeight: 850,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                Vendedor responsável
              </Typography>
              <Typography sx={{ color: "#021B16", fontWeight: 850, mt: 0.25 }}>
                {compra.vendedor_nome}
              </Typography>
            </Box>
          </Box>

          <Stack direction="row" spacing={0.65} flexWrap="wrap" useFlexGap>
            {compra.bilhetes.map((bilhete) => (
              <Chip
                key={bilhete}
                label={`Rifa ${bilhete}`}
                size="small"
                sx={{
                  height: 28,
                  borderRadius: 2,
                  bgcolor: "#EAF3EF",
                  color: "#063D31",
                  border: "1px solid rgba(6, 61, 49, 0.14)",
                  fontWeight: 850,
                }}
              />
            ))}
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{
            px: 1.25,
            py: 0.75,
            bgcolor: "#FAFCFB",
            borderTop: "1px solid rgba(2, 27, 22, 0.08)",
          }}
        >
          <AuditoriaCompraActions
            compra={compra}
            onVerComprovante={onVerComprovante}
            onEditar={onEditar}
            onVerDetalhes={onVerDetalhes}
          />
        </Stack>
      </Stack>
    </Paper>
  );
}
