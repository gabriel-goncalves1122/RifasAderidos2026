import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

import { CargoChip } from "./CargoChip";
import type { AderidoSecretaria } from "@/shared/types/secretaria";
import { surfaces } from "../../styles/surfaces";

const STATUS_DOT: Record<string, string> = {
  ativo: "#2e7d32",
  pendente: "#ed6c02",
  inativo: "#9e9e9e",
};

interface SecretariaCardListProps {
  aderidos: AderidoSecretaria[];
  onSelecionar: (aderido: AderidoSecretaria) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } },
};

interface SecretariaCardItemProps {
  aderido: AderidoSecretaria;
  onSelecionar: (aderido: AderidoSecretaria) => void;
}

const SecretariaCardItem = React.memo(function SecretariaCardItem({
  aderido,
  onSelecionar,
}: SecretariaCardItemProps) {
  return (
    <Card
      component={motion.div}
      variants={itemVariants}
      variant="outlined"
      sx={{
        ...surfaces.card,
        cursor: "pointer",
        "&:active": { bgcolor: "action.selected" },
        willChange: "transform, opacity",
      }}
      onClick={() => onSelecionar(aderido)}
    >
      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ position: "relative" }}>
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
            <Typography
              variant="body2"
              fontWeight={700}
              color={aderido.nome ? "text.primary" : "text.disabled"}
              noWrap
            >
              {aderido.nome || "Não definido"}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {aderido.email}
            </Typography>
          </Box>

          <CargoChip cargo={aderido.cargo} />
        </Stack>
      </CardContent>
    </Card>
  );
});

export function SecretariaCardList({ aderidos, onSelecionar }: SecretariaCardListProps) {
  if (aderidos.length === 0) return null;

  return (
    <Stack
      spacing={1.5}
      component={motion.div}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {aderidos.map((aderido) => (
        <SecretariaCardItem
          key={aderido.id}
          aderido={aderido}
          onSelecionar={onSelecionar}
        />
      ))}
    </Stack>
  );
}
