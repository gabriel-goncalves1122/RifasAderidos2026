import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { Button, Collapse, Paper, Stack, Typography } from "@mui/material";

import { PixTransacoesCampoBusca } from "./PixTransacoesCampoBusca";
import { PixTransacoesFiltrosChips } from "./PixTransacoesFiltrosChips";
import { PixTransacoesFiltrosProps } from "./pixTransacoesFiltrosTypes";

export function PixTransacoesFiltrosMobile({
  filtros,
  onChangeFiltros,
}: PixTransacoesFiltrosProps) {
  const [buscaAberta, setBuscaAberta] = useState(Boolean(filtros.busca));

  const buscaAtiva = filtros.busca.trim().length > 0;
  const filtroStatusAtivo = filtros.status !== "todas";
  const totalFiltrosAtivos =
    Number(buscaAtiva) + Number(filtroStatusAtivo);

  useEffect(() => {
    if (buscaAtiva) {
      setBuscaAberta(true);
    }
  }, [buscaAtiva]);

  const limparFiltros = () => {
    onChangeFiltros({ status: "todas", busca: "" });
    setBuscaAberta(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.25,
        mb: 0,
        maxWidth: "100%",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: "#FFFFFF",
        border: "1px solid rgba(2, 27, 22, 0.10)",
        boxShadow: "0 8px 20px rgba(2, 27, 22, 0.06)",
      }}
    >
      <Stack spacing={1.1} sx={{ minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            type="button"
            aria-expanded={buscaAberta}
            startIcon={<SearchIcon />}
            onClick={() => setBuscaAberta((aberta) => !aberta)}
            sx={{
              minWidth: 0,
              flex: 1,
              justifyContent: "flex-start",
              borderRadius: 2.5,
              bgcolor: "#F6F8F7",
              color: "#063D31",
              border: "1px solid rgba(6, 61, 49, 0.16)",
              fontWeight: 850,
              textTransform: "none",
              overflow: "hidden",
              px: 1.25,
              "&:hover": {
                bgcolor: "#EAF3EF",
              },
              "& .MuiButton-startIcon": {
                flexShrink: 0,
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.88rem",
                fontWeight: 850,
              }}
            >
              {buscaAtiva ? filtros.busca : "Buscar Pix"}
            </Typography>
          </Button>

          {totalFiltrosAtivos > 0 && (
            <Button
              type="button"
              aria-label="Limpar filtros Pix"
              startIcon={<CloseIcon />}
              onClick={limparFiltros}
              sx={{
                flexShrink: 0,
                borderRadius: 2.5,
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

        <Collapse in={buscaAberta} unmountOnExit>
          <PixTransacoesCampoBusca filtros={filtros} onChangeFiltros={onChangeFiltros} />
        </Collapse>

        <PixTransacoesFiltrosChips
          filtros={filtros}
          onChangeFiltros={onChangeFiltros}
          marginTop={0}
        />
      </Stack>
    </Paper>
  );
}
