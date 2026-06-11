import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
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
import { colors } from "../../../styles/colors";

export function AuditoriaComprasFiltrosMobile({
  filtros,
  filtrosAtivos,
  possuiResultados,
  onChangeFiltros,
  onLimparFiltros,
  onExportarCsv,
}: AuditoriaComprasFiltrosProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        mb: 1.75,
        borderRadius: 2.25,
        bgcolor: colors.branco,
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 10px 24px rgba(2, 27, 22, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <Stack spacing={1.2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar compra, rifa ou contato"
            value={filtros.termoBusca}
            onChange={(event) =>
              onChangeFiltros({ ...filtros, termoBusca: event.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.cinzaTexto }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: colors.fundoSuave,
              },
            }}
          />

          <IconButton
            aria-label="Abrir filtros de auditoria"
            onClick={() => setAberto((valor) => !valor)}
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: aberto || filtrosAtivos ? colors.verdeEscuro : colors.verdeClaro,
              color: aberto || filtrosAtivos ? colors.branco : colors.verdeEscuro,
              flexShrink: 0,
              "&:hover": {
                bgcolor: aberto || filtrosAtivos ? colors.verdeEscuroHover : colors.verdeHover,
              },
            }}
          >
            {aberto ? <ExpandMoreIcon /> : <TuneOutlinedIcon />}
          </IconButton>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            overflowX: "auto",
            pb: 0.25,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
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
                  height: 32,
                  borderRadius: 999,
                  fontWeight: 850,
                  flexShrink: 0,
                  bgcolor: ativo ? colors.verdeEscuro : colors.branco,
                  color: ativo ? colors.branco : colors.verdeEscuro,
                  border: ativo
                    ? `1px solid ${colors.verdeEscuro}`
                    : "1px solid rgba(6, 61, 49, 0.18)",
                }}
              />
            );
          })}
        </Box>

        <Collapse in={aberto}>
          <Stack spacing={1.1} sx={{ pt: 0.25 }}>
            <Typography
              sx={{
                color: colors.cinzaTexto,
                fontSize: "0.78rem",
                fontWeight: 850,
              }}
            >
              Refine por período e disponibilidade de comprovante.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              <TextField
                size="small"
                label="Início"
                type="date"
                value={filtros.dataInicio}
                onChange={(event) =>
                  onChangeFiltros({
                    ...filtros,
                    dataInicio: event.target.value,
                  })
                }
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    bgcolor: colors.fundoSuave,
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
                    bgcolor: colors.fundoSuave,
                  },
                }}
              />
            </Box>

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
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: colors.fundoSuave,
                },
              }}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="com">Com comprovante</MenuItem>
              <MenuItem value="sem">Sem comprovante</MenuItem>
            </TextField>

            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                startIcon={<FileDownloadOutlinedIcon />}
                onClick={onExportarCsv}
                disabled={!possuiResultados}
                sx={{
                  borderRadius: 2,
                  bgcolor: colors.verdeEscuro,
                  color: colors.branco,
                  fontWeight: 850,
                  textTransform: "none",
                  "&:hover": { bgcolor: colors.verdeEscuroHover },
                  "&.Mui-disabled": {
                    bgcolor: colors.verdeClaro,
                    color: colors.cinzaTexto,
                  },
                }}
              >
                Exportar CSV
              </Button>

              <Tooltip title="Exportação em lote de comprovantes será integrada na próxima etapa">
                <span style={{ flex: 1 }}>
                  <Button
                    fullWidth
                    startIcon={<DownloadOutlinedIcon />}
                    disabled
                    sx={{
                      borderRadius: 2,
                      color: colors.verdeEscuro,
                      bgcolor: colors.verdeClaro,
                      fontWeight: 850,
                      textTransform: "none",
                    }}
                  >
                    Comprovantes
                  </Button>
                </span>
              </Tooltip>
            </Stack>

            {filtrosAtivos && (
              <Button
                startIcon={<CloseIcon />}
                onClick={onLimparFiltros}
                sx={{
                  alignSelf: "stretch",
                  borderRadius: 2,
                  color: colors.verdeEscuro,
                  fontWeight: 850,
                  textTransform: "none",
                }}
              >
                Limpar filtros
              </Button>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Paper>
  );
}
