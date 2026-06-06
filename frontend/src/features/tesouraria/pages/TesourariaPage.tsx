import { Box, CircularProgress } from "@mui/material";

import { PixTransacoesDesktopView } from "../components/pix/transacoes/desktop/PixTransacoesDesktopView";
import { PixTransacoesMobileView } from "../components/pix/transacoes/mobile/PixTransacoesMobileView";
import { PixHeader } from "../components/pix/layout/PixHeader";
import { PixTabs } from "../components/pix/layout/PixTabs";
import { PixAderidosTab } from "../components/pix/tabs/PixAderidosTab";
import { PixConciliacaoTab } from "../components/pix/tabs/PixConciliacaoTab";
import { PixVisaoGeralTab } from "../components/pix/tabs/PixVisaoGeralTab";
import { usePixController } from "../hooks/usePixController";

interface TesourariaPageProps {
  variante?: "desktop" | "mobile";
}

export function TesourariaPage({ variante = "desktop" }: TesourariaPageProps) {
  const {
    resumo,
    transacoes,
    carregando,
    sincronizando,
    pixProps,
    abaVisivel,
    setAbaAtual,
    onSincronizar,
  } = usePixController({ variante });

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4 }}>
      <PixHeader
        sincronizando={sincronizando}
        onSincronizar={onSincronizar}
      />

      <PixTabs abaAtual={abaVisivel} onChangeAba={setAbaAtual} />

      {abaVisivel === "visao-geral" && (
        <PixVisaoGeralTab resumo={resumo} transacoes={transacoes} />
      )}

      {abaVisivel === "transacoes" &&
        (variante === "mobile" ? (
          <PixTransacoesMobileView {...pixProps} />
        ) : (
          <PixTransacoesDesktopView {...pixProps} />
        ))}

      {abaVisivel === "conciliacao" && (
        <PixConciliacaoTab transacoes={transacoes} />
      )}

      {abaVisivel === "aderidos" && (
        <PixAderidosTab transacoes={transacoes} />
      )}
    </Box>
  );
}
