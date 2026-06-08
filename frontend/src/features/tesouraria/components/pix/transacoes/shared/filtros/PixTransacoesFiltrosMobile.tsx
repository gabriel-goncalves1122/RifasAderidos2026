import CloseIcon from "@mui/icons-material/Close";
import { Button, Chip, Paper, Stack } from "@mui/material";

import { PixTransacoesCampoBusca } from "./PixTransacoesCampoBusca";
import { PixTransacoesFiltrosChips } from "./PixTransacoesFiltrosChips";
import { PixTransacoesFiltrosProps } from "./pixTransacoesFiltrosTypes";

export function PixTransacoesFiltrosMobile({
  filtros,
  onChangeFiltros,
}: PixTransacoesFiltrosProps) {
  const buscaAtiva = filtros.busca.trim().length > 0;
  const filtroStatusAtivo = filtros.status !== "todas";
  const totalFiltrosAtivos =
    Number(buscaAtiva) + Number(filtroStatusAtivo);

  const limparFiltros = () => {
    onChangeFiltros({ status: "todas", busca: "" });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        mb: 0,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 2.25,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 8px 20px rgba(2, 27, 22, 0.06)",
      }}
    >
      <Stack spacing={1.1} sx={{ minWidth: 0 }}>
        <PixTransacoesCampoBusca filtros={filtros} onChangeFiltros={onChangeFiltros} />

        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={
              totalFiltrosAtivos > 0
                ? `${totalFiltrosAtivos} filtro${totalFiltrosAtivos > 1 ? "s" : ""} ativo${totalFiltrosAtivos > 1 ? "s" : ""}`
                : "Sem filtros ativos"
            }
            size="small"
            sx={{
              height: 30,
              borderRadius: 2,
              color: totalFiltrosAtivos > 0 ? "#063D31" : "#526760",
              bgcolor: totalFiltrosAtivos > 0 ? "#EAF3EF" : "#F6F8F7",
              border: "1px solid rgba(6, 61, 49, 0.14)",
              fontWeight: 850,
            }}
          />
          {totalFiltrosAtivos > 0 && (
            <Button
              type="button"
              aria-label="Limpar filtros Pix"
              startIcon={<CloseIcon />}
              onClick={limparFiltros}
              sx={{
                flexShrink: 0,
                borderRadius: 2,
                color: "#063D31",
                bgcolor: "#EAF3EF",
                border: "1px solid rgba(6, 61, 49, 0.16)",
                fontWeight: 850,
                textTransform: "none",
                px: 1.2,
                "&:hover": {
                  bgcolor: "#DDECE6",
                },
              }}
            >
              Limpar
            </Button>
          )}
        </Stack>

        <PixTransacoesFiltrosChips
          filtros={filtros}
          onChangeFiltros={onChangeFiltros}
          marginTop={0}
        />
      </Stack>
    </Paper>
  );
}
