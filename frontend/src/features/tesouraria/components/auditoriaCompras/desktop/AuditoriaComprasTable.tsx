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
import { colors } from "../../../styles/colors";
import { surfaces } from "../../../styles/surfaces";
import { components } from "../../../styles/components";
import { typography } from "../../../styles/typography";

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
        ...surfaces.paperComSombra,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow
            sx={components.tabelaCabecalho}
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
              sx={components.linhaTabela}
            >
              <TableCell sx={{ minWidth: 128 }}>
                <Typography sx={typography.bodyDestaque}>
                  {formatarDataAuditoria(compra.data_reserva)}
                </Typography>
                <Typography sx={typography.bodyPequeno}>
                  Reserva
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 180 }}>
                <Typography
                  sx={{
                    ...typography.bodyDestaque,
                    fontWeight: 950,
                  }}
                >
                  {compra.comprador_nome}
                </Typography>
                <Typography sx={{ ...typography.bodyPequeno, mt: 0.3 }}>
                  ID: {compra.comprador_id || "sem comprador_id"}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 190 }}>
                <Typography
                  sx={{
                    color: colors.pretoEsverdeado,
                    fontSize: "0.86rem",
                    fontWeight: 750,
                    overflowWrap: "anywhere",
                  }}
                >
                  {compra.comprador_email || "Sem e-mail"}
                </Typography>
                <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.8rem" }}>
                  {compra.comprador_telefone || "Sem telefone"}
                </Typography>
              </TableCell>
              <TableCell sx={{ minWidth: 170 }}>
                <Typography sx={typography.bodyDestaque}>
                  {compra.vendedor_nome}
                </Typography>
                <Typography sx={{ color: colors.cinzaTexto, fontSize: "0.8rem" }}>
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
                        ...components.chipBilhete,
                        height: 24,
                        borderRadius: 1.5,
                        border: "1px solid rgba(6, 61, 49, 0.18)",
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
                  sx={components.labelVerde}
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
