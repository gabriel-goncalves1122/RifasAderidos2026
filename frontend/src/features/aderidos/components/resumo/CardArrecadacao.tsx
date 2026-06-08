// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/CardArrecadacao.tsx
// ============================================================================
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";

import { formatarMoedaBR } from "../../utils/formatadoresAderido";
import { ResumoCard } from "./ResumoCard";

interface CardArrecadacaoProps {
  valorArrecadado: number;
}

export function CardArrecadacao({ valorArrecadado }: CardArrecadacaoProps) {
  return (
    <ResumoCard
      icon={<AccountBalanceWalletOutlinedIcon fontSize="small" />}
      label="Arrecadado"
      valor={formatarMoedaBR(valorArrecadado)}
      descricao="Confirmado nas vendas aprovadas."
    />
  );
}
