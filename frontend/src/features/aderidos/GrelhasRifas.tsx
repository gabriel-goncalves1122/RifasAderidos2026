// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/GrelhaRifas.tsx
// ============================================================================
import { Box, Chip, Typography } from "@mui/material";

interface GrelhaRifasProps {
  rifas: any[];
  selecionadas: string[];
  onToggleSelecao: (numero: string, status: string) => void;
  onAbrirDetalhes: (rifa: any) => void;
}

export function GrelhaRifas({
  rifas,
  selecionadas,
  onToggleSelecao,
  onAbrirDetalhes,
}: GrelhaRifasProps) {
  if (rifas.length === 0) {
    return (
      <Typography
        color="text.secondary"
        sx={{ gridColumn: "1 / -1", textAlign: "center", py: 4 }}
      >
        Nenhuma rifa encontrada nesta categoria.
      </Typography>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(auto-fill, minmax(75px, 1fr))"
      gap={1.5}
    >
      {rifas.map((rifa) => {
        const isSelecionada = selecionadas.includes(rifa.numero);
        let cor: "default" | "primary" | "success" | "warning" | "error" =
          "default";

        if (isSelecionada) cor = "primary";
        else if (rifa.status === "pago") cor = "success";
        else if (rifa.status === "pendente") cor = "warning";
        else if (rifa.status === "recusado") cor = "error";

        return (
          <Chip
            key={rifa.numero}
            label={rifa.numero}
            color={cor}
            variant={
              rifa.status === "disponivel" && !isSelecionada
                ? "outlined"
                : "filled"
            }
            onClick={
              rifa.status === "disponivel"
                ? () => onToggleSelecao(rifa.numero, rifa.status)
                : rifa.status === "pago"
                  ? () => onAbrirDetalhes(rifa)
                  : undefined
            }
            sx={{
              fontWeight: "bold",
              fontSize: "1rem",
              height: "40px",
              borderRadius: "8px",
              borderWidth:
                rifa.status === "disponivel" && !isSelecionada ? "2px" : "0px",
              cursor:
                rifa.status === "disponivel" || rifa.status === "pago"
                  ? "pointer"
                  : "not-allowed",
              transition: "all 0.2s",
              "&:hover": {
                transform:
                  rifa.status === "disponivel" || rifa.status === "pago"
                    ? "scale(1.05)"
                    : "none",
              },
            }}
          />
        );
      })}
    </Box>
  );
}
