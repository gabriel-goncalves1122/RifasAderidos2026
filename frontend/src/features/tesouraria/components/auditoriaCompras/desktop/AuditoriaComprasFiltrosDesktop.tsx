import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { AuditoriaComprasFiltrosProps } from "../shared/auditoriaComprasFiltrosTypes";
import { FiltroComprovante } from "../../../types/auditoriaCompras";
import { STATUS_FILTROS_AUDITORIA_COMPRAS } from "../../../utils/auditoriaComprasUtils";

export function AuditoriaComprasFiltrosDesktop({
  filtros,
  filtrosAtivos,
  possuiResultados,
  onChangeFiltros,
  onLimparFiltros,
  onExportarCsv,
}: AuditoriaComprasFiltrosProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { sm: 1.75, md: 2 },
        mb: 2.5,
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 12px 28px rgba(2, 27, 22, 0.05)",
      }}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          <Box>
            <Typography
              sx={{
                color: "#021B16",
                fontWeight: 950,
                fontSize: "1rem",
                lineHeight: 1.15,
              }}
            >
              Filtros da auditoria
            </Typography>
            <Typography sx={{ color: "#526760", fontSize: "0.84rem", mt: 0.3 }}>
              Localize uma compra por comprador, contato, vendedor ou rifa.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} flexShrink={0}>
            <Button
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={onExportarCsv}
              disabled={!possuiResultados}
              sx={{
                borderRadius: 2,
                bgcolor: "#063D31",
                color: "#FFFFFF",
                fontWeight: 850,
                textTransform: "none",
                px: 1.5,
                "&:hover": { bgcolor: "#052F26" },
                "&.Mui-disabled": {
                  bgcolor: "#EAF3EF",
                  color: "#526760",
                },
              }}
            >
              Exportar CSV
            </Button>

            <Tooltip title="Exportação em lote de comprovantes será integrada na próxima etapa">
              <span>
                <Button
                  startIcon={<DownloadOutlinedIcon />}
                  disabled
                  sx={{
                    borderRadius: 2,
                    color: "#063D31",
                    bgcolor: "#EAF3EF",
                    fontWeight: 850,
                    textTransform: "none",
                    px: 1.5,
                  }}
                >
                  Exportar comprovantes
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              sm: "1fr 0.55fr 0.55fr",
              lg: "1.45fr 0.62fr 0.62fr 0.72fr",
            },
            gap: 1,
          }}
        >
          <TextField
            size="small"
            placeholder="Buscar comprador, CPF, e-mail, telefone ou rifa"
            value={filtros.termoBusca}
            onChange={(event) =>
              onChangeFiltros({ ...filtros, termoBusca: event.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#526760" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F6F8F7",
              },
            }}
          />

          <TextField
            size="small"
            label="Início"
            type="date"
            value={filtros.dataInicio}
            onChange={(event) =>
              onChangeFiltros({ ...filtros, dataInicio: event.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F6F8F7",
              },
            }}
          />

          <TextField
            size="small"
            label="Fim"
            type="date"
            value={filtros.dataFim}
            onChange={(event) =>
              onChangeFiltros({ ...filtros, dataFim: event.target.value })
            }
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F6F8F7",
              },
            }}
          />

          <TextField
            select
            size="small"
            label="Comprovante"
            value={filtros.comprovante}
            onChange={(event) =>
              onChangeFiltros({
                ...filtros,
                comprovante: event.target.value as FiltroComprovante,
              })
            }
            sx={{
              gridColumn: { sm: "1 / -1", lg: "auto" },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#F6F8F7",
              },
            }}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="com">Com comprovante</MenuItem>
            <MenuItem value="sem">Sem comprovante</MenuItem>
          </TextField>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {STATUS_FILTROS_AUDITORIA_COMPRAS.map((filtro) => {
              const ativo = filtros.status === filtro.value;

              return (
                <Chip
                  key={filtro.value}
                  label={filtro.label}
                  clickable
                  onClick={() =>
                    onChangeFiltros({ ...filtros, status: filtro.value })
                  }
                  sx={{
                    height: 34,
                    borderRadius: 999,
                    fontWeight: 850,
                    bgcolor: ativo ? "#063D31" : "#FFFFFF",
                    color: ativo ? "#FFFFFF" : "#063D31",
                    border: ativo
                      ? "1px solid #063D31"
                      : "1px solid rgba(6, 61, 49, 0.18)",
                    "&:hover": {
                      bgcolor: ativo ? "#052F26" : "#EAF3EF",
                    },
                  }}
                />
              );
            })}
          </Stack>

          {filtrosAtivos && (
            <Button
              startIcon={<CloseIcon />}
              onClick={onLimparFiltros}
              sx={{
                borderRadius: 2,
                color: "#063D31",
                fontWeight: 850,
                textTransform: "none",
              }}
            >
              Limpar filtros
            </Button>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
