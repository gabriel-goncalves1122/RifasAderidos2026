// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/PainelRecusadas.tsx
// ============================================================================
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
} from "@mui/material";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import RefreshIcon from "@mui/icons-material/Refresh";

interface RifaRecusada {
  numero: string;
  comprador_nome?: string;
  data_reserva?: string;
  motivo_recusa?: string;
}

interface Props {
  rifasRecusadas: RifaRecusada[];
  onLiberarRifas: (numeros: string[]) => void;
}

export function PainelRecusadas({ rifasRecusadas, onLiberarRifas }: Props) {
  if (rifasRecusadas.length === 0) return null;

  // Agrupa as rifas pelo comprador e data
  const gruposRecusados = Object.values(
    rifasRecusadas.reduce((acc: any, rifa) => {
      const key = `${rifa.comprador_nome}-${rifa.data_reserva}`;
      if (!acc[key]) {
        acc[key] = {
          comprador: rifa.comprador_nome || "Desconhecido",
          data: rifa.data_reserva,
          motivo: rifa.motivo_recusa || "Sem motivo informado",
          bilhetes: [],
        };
      }
      acc[key].bilhetes.push(rifa.numero);
      return acc;
    }, {}),
  ) as any[];

  return (
    <Box
      sx={{
        bgcolor: "#fffdfa",
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "error.light",
        height: "100%",
      }}
    >
      <Typography
        variant="h6"
        color="error.main"
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
      >
        <ReportGmailerrorredIcon /> Vendas Recusadas
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        A tesouraria invalidou os comprovativos abaixo. Reveja o motivo e libere
        as rifas para tentar vender novamente.
      </Typography>

      {gruposRecusados.map((grupo, idx) => (
        <Card
          key={idx}
          sx={{
            mb: 2,
            borderLeft: "4px solid",
            borderColor: "error.main",
            boxShadow: 1,
          }}
        >
          <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {grupo.comprador}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {grupo.data
                  ? new Date(grupo.data).toLocaleDateString("pt-BR")
                  : "Data Indisponível"}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Typography
              variant="body2"
              color="error.dark"
              fontWeight="bold"
              sx={{ mb: 1.5 }}
            >
              Motivo: {grupo.motivo}
            </Typography>

            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
              {grupo.bilhetes.map((b: string) => (
                <Chip
                  key={b}
                  size="small"
                  color="error"
                  variant="outlined"
                  label={b}
                />
              ))}
            </Box>

            <Button
              fullWidth
              variant="outlined"
              color="error"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={() => onLiberarRifas(grupo.bilhetes)}
            >
              Limpar e Liberar Rifas
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
