import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { CargoChip } from "../shared/CargoChip";
import type { AderidoSecretaria } from "../../types";
import { surfaces } from "../../styles/surfaces";

const STATUS_DOT: Record<string, string> = {
  ativo: "#2e7d32",
  pendente: "#ed6c02",
  inativo: "#9e9e9e",
};

interface SecretariaMobileSwipeableCardProps {
  aderido: AderidoSecretaria;
  onSelecionar: (aderido: AderidoSecretaria) => void;
}

export function SecretariaMobileSwipeableCard({
  aderido,
  onSelecionar,
}: SecretariaMobileSwipeableCardProps) {
  const nomeAderido = aderido.nome || "Não definido";

  return (
    <Card
      variant="outlined"
      sx={{
        ...surfaces.card,
        overflow: "hidden",
      }}
    >
      <CardActionArea
        aria-label={`Abrir detalhes de ${nomeAderido}`}
        onClick={() => onSelecionar(aderido)}
        sx={{
          cursor: "pointer",
          "&:focus-visible": {
            outline: "3px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Box sx={{ position: "relative", mt: 0.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: aderido.status_cadastro === "ativo" ? "primary.main" : "grey.400",
                }}
              >
                {aderido.nome ? aderido.nome.charAt(0).toUpperCase() : "?"}
              </Avatar>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  bgcolor: STATUS_DOT[aderido.status_cadastro] || "#9e9e9e",
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body1" fontWeight={700} noWrap sx={{ fontFamily: "Inter, sans-serif" }}>
                {nomeAderido}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap display="block" sx={{ mb: 0.5, fontFamily: "Inter, sans-serif" }}>
                {aderido.email}
              </Typography>
              <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                <CargoChip cargo={aderido.cargo} />
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
