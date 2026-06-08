// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/CardArrecadacao.tsx
// ============================================================================
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Box, Stack, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";
import { formatarMoedaBR } from "../../utils/formatadoresAderido";

interface CardArrecadacaoProps {
  valorArrecadado: number;
}

export function CardArrecadacao({ valorArrecadado }: CardArrecadacaoProps) {
  return (
    <Box sx={painelAderidoStyles.resumoCompactoItem}>
      <Stack sx={painelAderidoStyles.resumoMetaLinha}>
        <Box sx={painelAderidoStyles.resumoIconBox}>
          <AccountBalanceWalletOutlinedIcon fontSize="small" />
        </Box>

        <Typography sx={painelAderidoStyles.resumoCardLabel}>
          Arrecadado
        </Typography>
      </Stack>

      <Box sx={painelAderidoStyles.resumoConteudoLinha}>
        <Typography sx={painelAderidoStyles.resumoCardValor}>
          {formatarMoedaBR(valorArrecadado)}
        </Typography>

        <Typography sx={painelAderidoStyles.resumoCardDescricao}>
          Confirmado nas vendas aprovadas.
        </Typography>
      </Box>
    </Box>
  );
}
