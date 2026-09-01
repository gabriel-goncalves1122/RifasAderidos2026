import { Box, Chip, TextField } from "@mui/material";
import { colors } from "@/shared/tokens/colors";
import { STATUS_FILTROS_AUDITORIA_COMPRAS } from "../../../utils/auditoriaComprasUtils";
import { AuditoriaComprasFiltrosProps } from "../shared/auditoriaComprasFiltrosTypes";

export function AuditoriaFiltroStatusChips({
  filtros,
  onChangeFiltros,
}: Pick<AuditoriaComprasFiltrosProps, "filtros" | "onChangeFiltros">) {
  return (
    <>
      {STATUS_FILTROS_AUDITORIA_COMPRAS.map((filtro) => {
        const ativo = filtros.status === filtro.value;

        return (
          <Chip
            key={filtro.value}
            label={filtro.label}
            clickable
            onClick={() => onChangeFiltros({ ...filtros, status: filtro.value })}
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
    </>
  );
}

export function AuditoriaFiltroDatas({
  filtros,
  onChangeFiltros,
  bgColor = colors.fundoSuave,
}: Pick<AuditoriaComprasFiltrosProps, "filtros" | "onChangeFiltros"> & {
  bgColor?: string;
}) {
  return (
    <>
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
            bgcolor: bgColor,
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
            bgcolor: bgColor,
          },
        }}
      />
    </>
  );
}
