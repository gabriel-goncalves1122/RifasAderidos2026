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

import { GrupoRifasRecusadas } from "./types/painelAderido";

interface AbaRecusadasProps {
  gruposRecusados: GrupoRifasRecusadas[];
  onVoltar: () => void;
  onAbrirCorrecao: (grupo: GrupoRifasRecusadas) => void;
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
          <ReportGmailerrorredIcon fontSize="large" /> Vendas recusadas - ação
          necessária
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Atualize os dados solicitados para que a venda volte para análise.
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
              borderColor: "#7A1F1F",
              boxShadow: "0 10px 28px rgba(2, 27, 22, 0.08)",
              border: "1px solid rgba(122, 31, 31, 0.14)",
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
                {grupo.motivo}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
                sx={{ display: "block", mb: 0.75 }}
              >
                Rifas para revisar
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 3 }}>
                {grupo.bilhetes.map((b) => (
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
                Corrigir dados
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
