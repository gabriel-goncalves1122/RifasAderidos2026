// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/components/resumo/HeaderAderido.tsx
// ============================================================================
import { Stack, Typography } from "@mui/material";

import { painelAderidoStyles } from "../../styles/painelAderidoStyles";
import { BotaoNotificacoes } from "./BotaoNotificacoes";

interface HeaderAderidoProps {
  primeiroNome: string;
  notificacoesNaoLidas: number;
  onAbrirNotificacoes: () => void;
}

function obterNomeSeguro(primeiroNome: string) {
  const nome = primeiroNome.trim();

  if (nome.toLowerCase() === "aderido") return "";

  return nome;
}

export function HeaderAderido({
  primeiroNome,
  notificacoesNaoLidas,
  onAbrirNotificacoes,
}: HeaderAderidoProps) {
  return (
    <Stack sx={painelAderidoStyles.aderidoHeader}>
      <Stack sx={painelAderidoStyles.aderidoHeaderConteudo}>
        <Typography sx={painelAderidoStyles.aderidoHeaderEyebrow}>
          Meu Painel
        </Typography>

        <Typography component="h1" sx={painelAderidoStyles.aderidoHeaderTitulo}>
          {obterNomeSeguro(primeiroNome)
            ? `Olá, ${obterNomeSeguro(primeiroNome)}`
            : "Olá"}
        </Typography>
      </Stack>

      <BotaoNotificacoes
        notificacoesNaoLidas={notificacoesNaoLidas}
        onAbrirNotificacoes={onAbrirNotificacoes}
      />
    </Stack>
  );
}
