// ============================================================================
// ARQUIVO: RifaGrid.tsx (CORRIGIDO)
// ============================================================================
import { Grid, Chip, Box, Typography, CircularProgress } from "@mui/material";
import { Bilhete } from "../../../types/models";

interface RifaGridProps {
  bilhetes: Bilhete[];
  carregando: boolean;
  selecionadas: string[];
  onToggleRifa: (numero: string) => void;
  // Removido tipoVisao se não estiver sendo usado para evitar alertas
}

export function RifaGrid({
  bilhetes,
  carregando,
  selecionadas,
  onToggleRifa,
}: RifaGridProps) {
  if (carregando) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Buscando bilhetes...
        </Typography>
      </Box>
    );
  }

  if (bilhetes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography color="text.secondary">
          Nenhuma rifa encontrada nesta categoria.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={1.5}>
      {bilhetes.map((bilhete) => {
        const isSelected = selecionadas.includes(bilhete.numero);

        // Adicione esta linha no seu RifaGrid.tsx logo após a verificação do reservado:
        let color:
          | "default"
          | "primary"
          | "success"
          | "warning"
          | "info"
          | "error" = "default"; // Adicionar 'error' ao tipo

        if (bilhete.status === "pago") color = "success";
        else if (bilhete.status === "pendente") color = "info";
        else if (bilhete.status === "reservado") color = "warning";
        else if (bilhete.status === "recusado")
          color = "error"; // <-- NOVA REGRA AQUI
        else if (isSelected) color = "primary";
        return (
          // Corrigido: Removido 'item' e usado apenas as props de tamanho
          <Grid key={bilhete.numero} size={{ xs: 3, sm: 2, md: 1.2 }}>
            <Chip
              label={bilhete.numero}
              color={color}
              variant={
                isSelected || bilhete.status !== "disponivel"
                  ? "filled"
                  : "outlined"
              }
              onClick={
                bilhete.status === "disponivel"
                  ? () => onToggleRifa(bilhete.numero)
                  : undefined
              }
              sx={{
                width: "100%",
                fontWeight: "bold",
                cursor: bilhete.status === "disponivel" ? "pointer" : "default",
              }}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}
