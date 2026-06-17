import { Box } from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

import { usePremiosController } from "./hooks/usePremiosController";
import { usePremiosLayout } from "./hooks/usePremiosLayout";
import { PremiosDesktopView } from "./components/desktop/PremiosDesktopView";
import { PremiosMobileView } from "./components/mobile/PremiosMobileView";
import { HeaderForm } from "./components/shared/HeaderForm";
import { PrizeForm } from "./components/shared/PrizeForm";
import { EmptyState } from "@/shared/components/EmptyState";

interface PremiosTabProps {
  isAdmin: boolean;
}

export function PremiosTab({ isAdmin }: PremiosTabProps) {
  const {
    carregando,
    salvando,
    infoSorteio,
    premios,
    modalHeaderAberto,
    modalPremioAberto,
    premioEmEdicao,
    previewFoto,
    setModalHeaderAberto,
    setModalPremioAberto,
    guardarHeader,
    abrirModalPremio,
    lidarComFoto,
    guardarPremio,
    removerPremio,
    revogarPreview,
  } = usePremiosController();

  const { isMobile } = usePremiosLayout();

  const premioHero =
    carregando ? undefined
    : premios.find((p) => p.colocacao?.trim().startsWith("1"));
  const premiosRest = premioHero
    ? premios.filter((p) => p.id !== premioHero.id)
    : premios;

  const ViewComponent = isMobile ? PremiosMobileView : PremiosDesktopView;

  return (
    <>
      <ViewComponent
        carregando={carregando}
        premioHero={premioHero}
        premiosRest={premiosRest}
        infoSorteio={infoSorteio}
        isAdmin={isAdmin}
        onEditarHeader={() => setModalHeaderAberto(true)}
        onAbrirModalPremio={abrirModalPremio}
      />

      {!carregando && premios.length === 0 && (
        <Box sx={{ mt: -4, px: { xs: 2, sm: 3, md: 4 }, maxWidth: 980, mx: "auto", pb: 6 }}>
          <EmptyState
            icon={<CardGiftcardIcon sx={{ fontSize: 56 }} />}
            title="Nenhum prêmio anunciado ainda."
            description="A comissão atualizará esta secção em breve."
          />
        </Box>
      )}

      <HeaderForm
        open={modalHeaderAberto}
        salvando={salvando}
        infoSorteio={infoSorteio}
        onClose={() => setModalHeaderAberto(false)}
        onSubmit={guardarHeader}
      />

      <PrizeForm
        open={modalPremioAberto}
        salvando={salvando}
        premioEmEdicao={premioEmEdicao}
        previewFoto={previewFoto}
        onClose={() => {
          revogarPreview();
          setModalPremioAberto(false);
        }}
        onSubmit={guardarPremio}
        onDelete={removerPremio}
        onFotoChange={lidarComFoto}
      />
    </>
  );
}
