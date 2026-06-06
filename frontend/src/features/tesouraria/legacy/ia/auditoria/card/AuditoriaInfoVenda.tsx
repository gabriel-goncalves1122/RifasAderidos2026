import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { Box, Chip, Stack, Typography } from "@mui/material";

import { auditoriaCardStyles } from "../../auditoriaCardStyles";

interface AuditoriaInfoVendaProps {
  vendedorNome: string;
  bilhetes: string[];
}

export function AuditoriaInfoVenda({
  vendedorNome,
  bilhetes,
}: AuditoriaInfoVendaProps) {
  return (
    <Box sx={auditoriaCardStyles.blocoSecundario}>
      <Typography sx={auditoriaCardStyles.blocoTitulo}>
        Informações da venda
      </Typography>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AssignmentIndIcon sx={{ color: "#063D31" }} fontSize="small" />

          <Box>
            <Typography sx={auditoriaCardStyles.label}>
              Vendedor responsável
            </Typography>

            <Typography sx={auditoriaCardStyles.textoForte}>
              {vendedorNome || "Nome não informado"}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="flex-start">
          <ReceiptLongIcon sx={{ color: "#526760" }} fontSize="small" />

          <Box>
            <Typography sx={auditoriaCardStyles.label}>
              Rifas reservadas ({bilhetes.length})
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6, mt: 0.75 }}>
              {bilhetes.map((numero) => (
                <Chip
                  key={numero}
                  label={numero}
                  size="small"
                  sx={auditoriaCardStyles.chipNumero}
                />
              ))}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
