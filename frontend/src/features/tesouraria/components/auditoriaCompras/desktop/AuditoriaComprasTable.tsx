import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { CompraAuditavel } from "../../../types/auditoriaCompras";
import {
  formatarDataAuditoria,
  formatarMoedaAuditoria,
} from "../../../utils/auditoriaComprasUtils";
import { AuditoriaCompraActions } from "../shared/AuditoriaCompraActions";
import { AuditoriaStatusChip } from "../shared/AuditoriaStatusChip";

interface AuditoriaComprasTableProps {
  compras: CompraAuditavel[];
  onVerComprovante: (compra: CompraAuditavel) => void;
  onEditar: (compra: CompraAuditavel) => void;
  onVerDetalhes: (compra: CompraAuditavel) => void;
  onReenviarEmailComprovante: (compra: CompraAuditavel) => void;
  reenviandoEmailComprovanteId?: string | null;
}

export function AuditoriaComprasTable({
  compras,
  onVerComprovante,
  onEditar,
  onVerDetalhes,
  onReenviarEmailComprovante,
  reenviandoEmailComprovanteId,
}: AuditoriaComprasTableProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: { xs: "none", md: "block" },
        borderRadius: 2.25,
        overflow: "hidden",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        bgcolor: "#FFFFFF",
        boxShadow: "0 12px 30px rgba(2, 27, 22, 0.05)",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "#F6F8F7",
              "& th": {
                color: "#526760",
                fontWeight: 900,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                py: 1.45,
                borderColor: "rgba(2, 27, 22, 0.08)",
              },
            }}
          >
            <TableCell>Data</TableCell>
            <TableCell>Comprador</TableCell>
            <TableCell>Contato</TableCell>
            <TableCell>Vendedor</TableCell>
            <TableCell>Rifas</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Valor</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {compras.map((compra) => (
            <TableRow
              key={compra.id}
              hover
              data-testid={`auditoria-compra-${compra.id}`}
              sx={{
                "& td": {
                  borderColor: "rgba(2, 27, 22, 0.08)",
                  verticalAlign: "middle",
                  py: 1.45,
                },
                "&:hover": {
                  bgcolor: "#FAFCFB",
                },
              }}
            >
              <TableCell sx={{ minWidth: 128 }}>
                <Typography sx={{ color: "#021B16", fontWeight: 850 }}>
                  {formatarDataAuditoria(compra.data_reserva)}
                </Typography>
                <Typography sx={{ color: "#526760", fontSize: "0.78rem" }}>
                  Reserva
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>
                <Typography
                  sx={{
                    color: "#021B16",
                    fontWeight: 950,
                    lineHeight: 1.2,
                  }}
                >
                  {compra.comprador_nome}
                </Typography>
                <Typography sx={{ color: "#526760", fontSize: "0.78rem", mt: 0.3 }}>
                  ID: {compra.comprador_id || "sem comprador_id"}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 190 }}>
                <Typography
                  sx={{
                    color: "#021B16",
                    fontSize: "0.86rem",
                    fontWeight: 750,
                    overflowWrap: "anywhere",
                  }}
                >
                  {compra.comprador_email || "Sem e-mail"}
                </Typography>
                <Typography sx={{ color: "#526760", fontSize: "0.8rem" }}>
                  {compra.comprador_telefone || "Sem telefone"}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 170 }}>
                <Typography sx={{ color: "#021B16", fontWeight: 850, lineHeight: 1.2 }}>
                  {compra.vendedor_nome}
                </Typography>
                <Typography sx={{ color: "#526760", fontSize: "0.8rem" }}>
                  {compra.vendedor_cpf}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  spacing={0.5}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ maxWidth: 160 }}
                >
                  {compra.bilhetes.map((bilhete) => (
                    <Chip
                      key={bilhete}
                      label={bilhete}
                      size="small"
                      sx={{
                        height: 24,
                        borderRadius: 1.5,
                        bgcolor: "#EAF3EF",
                        color: "#063D31",
                        border: "1px solid rgba(6, 61, 49, 0.18)",
                        fontWeight: 850,
                      }}
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                <AuditoriaStatusChip status={compra.status} />
              </TableCell>
              <TableCell align="right" sx={{ minWidth: 118 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    px: 1,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: "#EAF3EF",
                    color: "#063D31",
                    fontWeight: 950,
                  }}
                >
                  {formatarMoedaAuditoria(compra.valor_total)}
                </Box>
              </TableCell>
              <TableCell align="right">
                <AuditoriaCompraActions
                  compra={compra}
                  onVerComprovante={onVerComprovante}
                  onEditar={onEditar}
                  onVerDetalhes={onVerDetalhes}
                  onReenviarEmailComprovante={onReenviarEmailComprovante}
                  reenviandoEmailComprovante={
                    Boolean(compra.comprador_id) &&
                    compra.comprador_id === reenviandoEmailComprovanteId
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
