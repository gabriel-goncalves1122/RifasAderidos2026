// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/CardArrecadacao.tsx
// ============================================================================
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { formatarMoeda } from "@/shared/utils/formatadores";
import { ResumoCard } from "./ResumoCard";

interface CardArrecadacaoProps {
  valorArrecadado: number;
}

export function CardArrecadacao({ valorArrecadado }: CardArrecadacaoProps) {
  return (
    <ResumoCard
      icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
      label="Arrecadado"
      valor={formatarMoeda(valorArrecadado)}
      descricao="Confirmado nas vendas aprovadas."
    />
  );
}
