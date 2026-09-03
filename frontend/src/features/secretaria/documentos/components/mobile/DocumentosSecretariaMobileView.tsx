import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import { colors } from "@/shared/tokens/colors";
import { DocumentoCard } from "../shared/DocumentoCard";
import { DocumentosSecretariaHeader } from "../shared/DocumentosSecretariaHeader";
import { DocumentosSecretariaToolbar } from "../shared/DocumentosSecretariaToolbar";
import { documentosSecretariaStyles } from "../../styles/documentosSecretariaStyles";
import type {
  AreaDocumentoComissao,
  DocumentoComissao,
} from "../../types/documentosSecretariaTypes";

interface DocumentosSecretariaMobileViewProps {
  documentos: DocumentoComissao[];
  total: number;
  loading: boolean;
  erro: string | null;
  busca: string;
  area: AreaDocumentoComissao | "todas";
  onBuscaChange: (value: string) => void;
  onAreaChange: (value: AreaDocumentoComissao | "todas") => void;
  onAbrirDocumento: (documento: DocumentoComissao) => void;
  onEditarDocumento: (documento: DocumentoComissao) => void;
}

export function DocumentosSecretariaMobileView({
  documentos,
  total,
  loading,
  erro,
  busca,
  area,
  onBuscaChange,
  onAreaChange,
  onAbrirDocumento,
  onEditarDocumento,
}: DocumentosSecretariaMobileViewProps) {
  return (
    <Box>
      <DocumentosSecretariaHeader total={total} />
      <DocumentosSecretariaToolbar
        busca={busca}
        area={area}
        onBuscaChange={onBuscaChange}
        onAreaChange={onAreaChange}
      />

      {erro && <Alert severity="error">{erro}</Alert>}

      {loading ? (
        <Box sx={{ py: 8, display: "grid", placeItems: "center" }}>
          <CircularProgress />
        </Box>
      ) : documentos.length === 0 ? (
        <Typography
          sx={{ py: 5, color: colors.cinzaTexto, textAlign: "center" }}
        >
          Nenhum documento encontrado.
        </Typography>
      ) : (
        <Box sx={documentosSecretariaStyles.mobileList}>
          {documentos.map((documento) => (
            <DocumentoCard
              key={documento.id}
              documento={documento}
              onAbrir={onAbrirDocumento}
              onEditar={onEditarDocumento}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
