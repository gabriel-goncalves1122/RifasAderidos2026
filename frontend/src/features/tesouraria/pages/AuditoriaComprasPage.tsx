import { Box, CircularProgress } from "@mui/material";

import { ModalImagemPix } from "@/shared/components/ModalImagemPix";

import { AuditoriaComprasTable } from "../components/auditoriaCompras/desktop/AuditoriaComprasTable";
import { AuditoriaComprasCardList } from "../components/auditoriaCompras/mobile/AuditoriaComprasCardList";
import { AuditoriaCompraDetalhesDialog } from "../components/auditoriaCompras/shared/AuditoriaCompraDetalhesDialog";
import { AuditoriaCompraEdicaoDialog } from "../components/auditoriaCompras/shared/AuditoriaCompraEdicaoDialog";
import { AuditoriaComprasEmptyState } from "../components/auditoriaCompras/shared/AuditoriaComprasEmptyState";
import { AuditoriaComprasFiltros } from "../components/auditoriaCompras/shared/AuditoriaComprasFiltros";
import { AuditoriaComprasHeader } from "../components/auditoriaCompras/shared/AuditoriaComprasHeader";
import { AuditoriaComprasResumo } from "../components/auditoriaCompras/shared/AuditoriaComprasResumo";
import { useAuditoriaComprasController } from "../hooks/useAuditoriaComprasController";

export function AuditoriaComprasPage() {
  const {
    carregando,
    filtros,
    comprasFiltradas,
    resumo,
    compraSelecionada,
    compraEdicao,
    comprovanteUrl,
    filtrosAtivos,
    possuiResultados,
    setFiltros,
    limparFiltros,
    baixarCSV,
    abrirComprovante,
    fecharComprovante,
    abrirDetalhes,
    fecharDetalhes,
    abrirEdicao,
    fecharEdicao,
  } = useAuditoriaComprasController();

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, px: { xs: 0, sm: 1.25, md: 0.5 } }}>
      <AuditoriaComprasHeader />
      <AuditoriaComprasResumo resumo={resumo} />
      <AuditoriaComprasFiltros
        filtros={filtros}
        filtrosAtivos={filtrosAtivos}
        possuiResultados={possuiResultados}
        onChangeFiltros={setFiltros}
        onLimparFiltros={limparFiltros}
        onExportarCsv={baixarCSV}
      />

      {comprasFiltradas.length === 0 ? (
        <AuditoriaComprasEmptyState />
      ) : (
        <>
          <AuditoriaComprasTable
            compras={comprasFiltradas}
            onVerComprovante={abrirComprovante}
            onEditar={abrirEdicao}
            onVerDetalhes={abrirDetalhes}
          />
          <AuditoriaComprasCardList
            compras={comprasFiltradas}
            onVerComprovante={abrirComprovante}
            onEditar={abrirEdicao}
            onVerDetalhes={abrirDetalhes}
          />
        </>
      )}

      <AuditoriaCompraDetalhesDialog
        compra={compraSelecionada}
        onClose={fecharDetalhes}
      />
      <AuditoriaCompraEdicaoDialog
        compra={compraEdicao}
        onClose={fecharEdicao}
      />
      <ModalImagemPix url={comprovanteUrl} onClose={fecharComprovante} />
    </Box>
  );
}
