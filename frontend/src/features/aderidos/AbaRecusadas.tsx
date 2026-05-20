// ============================================================================
// ARQUIVO: frontend/src/views/components/aderidos/AbaRecusadas.tsx
// ============================================================================
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReportGmailerrorredIcon from "@mui/icons-material/ReportGmailerrorred";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";

interface AbaRecusadasProps {
  gruposRecusados: any[];
  onVoltar: () => void;
  onAbrirCorrecao: (grupo: any) => void;
}

export function AbaRecusadas({
  gruposRecusados,
  onVoltar,
  onAbrirCorrecao,
}: AbaRecusadasProps) {
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
          onClick={onVoltar}
          color="primary"
          sx={{ bgcolor: "rgba(0,0,0,0.05)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="error.main"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ReportGmailerrorredIcon fontSize="large" /> Vendas Negadas pela
          Tesouraria
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        A tesouraria encontrou problemas nos comprovativos abaixo. Selecione uma
        venda para corrigir os dados e anexar um novo comprovativo.
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
        gap={3}
      >
        {gruposRecusados.map((grupo, idx) => (
          <Card
            key={idx}
            sx={{
              borderLeft: "6px solid",
              borderColor: "error.main",
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {grupo.comprador}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {grupo.data
                    ? new Date(grupo.data).toLocaleDateString("pt-BR")
                    : "Data Indisponível"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />

              <Typography
                variant="body2"
                color="error.dark"
                fontWeight="bold"
                sx={{ mb: 2 }}
              >
                Motivo: {grupo.motivo}
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 3 }}>
                {grupo.bilhetes.map((b: string) => (
                  <Chip
                    key={b}
                    size="small"
                    color="error"
                    variant="filled"
                    label={b}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<BuildCircleIcon />}
                onClick={() => onAbrirCorrecao(grupo)}
              >
                Corrigir Informações
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
