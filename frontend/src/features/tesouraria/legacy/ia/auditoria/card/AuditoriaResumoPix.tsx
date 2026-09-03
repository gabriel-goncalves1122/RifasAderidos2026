import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { Box, Stack, Typography } from "@mui/material";

import { auditoriaCardStyles } from "../../auditoriaCardStyles";
import { formatarMoedaTesouraria } from "../../auditoriaUtils";

interface AuditoriaResumoPixProps {
  compradorNome: string;
  valorTotal: number;
}

export function AuditoriaResumoPix({
  compradorNome,
  valorTotal,
}: AuditoriaResumoPixProps) {
  return (
    <Box sx={auditoriaCardStyles.blocoPrimario}>
      <Typography sx={auditoriaCardStyles.blocoTitulo}>
        Conferência do comprovante
      </Typography>

      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AttachMoneyIcon sx={{ color: "#063D31" }} />

          <Box>
            <Typography sx={auditoriaCardStyles.label}>Valor esperado</Typography>
            <Typography sx={auditoriaCardStyles.valorPix}>
              {formatarMoedaTesouraria(valorTotal)}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.25} alignItems="center">
          <PersonSearchIcon sx={{ color: "#526760" }} />

          <Box>
            <Typography sx={auditoriaCardStyles.label}>
              Titular informado
            </Typography>

            <Typography sx={auditoriaCardStyles.textoForte}>
              {compradorNome || "Nome não informado"}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
