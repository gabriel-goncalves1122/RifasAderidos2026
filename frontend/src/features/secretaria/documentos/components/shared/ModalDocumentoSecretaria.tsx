import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { secretariaColors } from "../../../styles/colors";
import { secretariaComponents } from "../../../styles/components";
import { AREAS_DOCUMENTOS_COMISSAO } from "../../constants/documentosAreas";
import {
  TIPOS_CADASTRO_DOCUMENTO,
  TIPOS_DOCUMENTOS_COMISSAO,
} from "../../constants/documentosTipos";
import {
  arquivoAceitoParaTipo,
  criarDocumentoFormInicial,
  documentoParaFormData,
  formatarTamanhoArquivo,
  inferirMimeTypeDocumento,
} from "../../utils/documentosSecretariaUtils";
import type {
  DocumentoComissao,
  DocumentoFormData,
  TipoDocumentoCadastro,
  TipoDocumentoComissao,
} from "../../types/documentosSecretariaTypes";

const LIMITE_DOCUMENTO_BYTES = 25 * 1024 * 1024;

interface ModalDocumentoSecretariaProps {
  open: boolean;
  modo: "criar" | "editar";
  tipoCadastro: TipoDocumentoCadastro;
  documento: DocumentoComissao | null;
  onClose: () => void;
  onSalvar: (dados: DocumentoFormData) => Promise<void>;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Typography
      variant="subtitle2"
      sx={{ color: secretariaColors.verdeEscuro, fontWeight: 900 }}
    >
      {children}
    </Typography>
  );
}

export function ModalDocumentoSecretaria({
  open,
  modo,
  tipoCadastro,
  documento,
  onClose,
  onSalvar,
}: ModalDocumentoSecretariaProps) {
  const [form, setForm] = useState<DocumentoFormData>(() =>
    criarDocumentoFormInicial(tipoCadastro),
  );
  const [saving, setSaving] = useState(false);
  const [erroArquivo, setErroArquivo] = useState<string | null>(null);
  const [erroEnvio, setErroEnvio] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setForm(
      modo === "editar" && documento
        ? documentoParaFormData(documento)
        : criarDocumentoFormInicial(tipoCadastro),
    );
    setErroArquivo(null);
    setErroEnvio(null);
  }, [documento, modo, open, tipoCadastro]);

  const tituloModal = useMemo(() => {
    const tipoLabel = TIPOS_CADASTRO_DOCUMENTO[tipoCadastro].label;
    return modo === "editar" ? `Editar ${tipoLabel}` : `Adicionar ${tipoLabel}`;
  }, [modo, tipoCadastro]);

  const handleChange = <K extends keyof DocumentoFormData>(
    campo: K,
    valor: DocumentoFormData[K],
  ) => {
    setForm((atual) => ({ ...atual, [campo]: valor }));
  };

  const handleSalvar = async () => {
    if (!form.titulo.trim() || !form.nomeArquivo.trim()) return;
    if (modo === "criar" && !form.arquivo) {
      setErroArquivo("Selecione um arquivo para continuar.");
      return;
    }

    setSaving(true);
    setErroEnvio(null);
    try {
      await onSalvar({
        ...form,
        titulo: form.titulo.trim(),
        nomeArquivo: form.nomeArquivo.trim(),
        tamanhoBytes: Number.isFinite(form.tamanhoBytes)
          ? form.tamanhoBytes
          : 0,
      });
    } catch (error) {
      setErroEnvio(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o documento.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleArquivoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!arquivo) {
      return;
    }

    if (arquivo.size > LIMITE_DOCUMENTO_BYTES) {
      setErroArquivo("O arquivo deve ter no máximo 25 MB.");
      return;
    }

    if (!arquivoAceitoParaTipo(arquivo, tipoCadastro)) {
      setErroArquivo(
        `Selecione um arquivo compatível com ${TIPOS_CADASTRO_DOCUMENTO[tipoCadastro].label}.`,
      );
      return;
    }

    setErroArquivo(null);
    setForm((atual) => ({
      ...atual,
      arquivo,
      nomeArquivo: arquivo.name,
      mimeType: inferirMimeTypeDocumento(arquivo),
      tamanhoBytes: arquivo.size,
    }));
  };

  const accept = useMemo(() => {
    if (tipoCadastro === "pdf") return "application/pdf,.pdf";
    if (tipoCadastro === "imagem") {
      return "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";
    }
    return ".xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  }, [tipoCadastro]);

  const arquivoPronto = modo === "editar" || !!form.arquivo;

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          ...secretariaComponents.surface,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          color: secretariaColors.pretoEsverdeado,
          fontWeight: 950,
          borderBottom: `1px solid ${secretariaColors.borda}`,
        }}
      >
        {tituloModal}
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: secretariaColors.branco }}>
        <Stack spacing={2.25}>
          {erroEnvio && <Alert severity="error">{erroEnvio}</Alert>}
          <Stack spacing={1.5}>
            <SectionTitle>Identificação</SectionTitle>
            <TextField
              label="Título"
              value={form.titulo}
              onChange={(event) => handleChange("titulo", event.target.value)}
              required
              fullWidth
              size="small"
              sx={secretariaComponents.formField}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <FormControl fullWidth size="small" sx={secretariaComponents.selectField}>
                <InputLabel id="documento-area-form-label">Área</InputLabel>
                <Select
                  labelId="documento-area-form-label"
                  label="Área"
                  value={form.area}
                  onChange={(event) =>
                    handleChange("area", event.target.value as DocumentoFormData["area"])
                  }
                >
                  {AREAS_DOCUMENTOS_COMISSAO.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" sx={secretariaComponents.selectField}>
                <InputLabel id="documento-tipo-form-label">Tipo</InputLabel>
                <Select
                  labelId="documento-tipo-form-label"
                  label="Tipo"
                  value={form.tipo}
                  onChange={(event) =>
                    handleChange("tipo", event.target.value as TipoDocumentoComissao)
                  }
                >
                  {TIPOS_DOCUMENTOS_COMISSAO.map((tipo) => (
                    <MenuItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <SectionTitle>Arquivo</SectionTitle>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1.5px dashed ${secretariaColors.borda}`,
                bgcolor: "#F6F8F7",
              }}
            >
              <Stack spacing={1.25} alignItems="flex-start">
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadOutlinedIcon />}
                  disabled={saving}
                  sx={{ borderRadius: 2, fontWeight: 850 }}
                >
                  {form.nomeArquivo ? "Trocar arquivo" : "Selecionar arquivo"}
                  <input
                    hidden
                    type="file"
                    accept={accept}
                    onChange={handleArquivoChange}
                    data-testid="documento-upload-input"
                  />
                </Button>

                {form.nomeArquivo ? (
                  <Typography sx={{ color: secretariaColors.pretoEsverdeado, fontWeight: 800 }}>
                    {form.nomeArquivo} · {formatarTamanhoArquivo(form.tamanhoBytes)}
                  </Typography>
                ) : (
                  <Typography sx={{ color: secretariaColors.cinzaTexto, fontSize: "0.86rem" }}>
                    Escolha um arquivo {TIPOS_CADASTRO_DOCUMENTO[tipoCadastro].label}.
                  </Typography>
                )}

                {erroArquivo && (
                  <Alert severity="warning" sx={{ width: "100%", borderRadius: 2 }}>
                    {erroArquivo}
                  </Alert>
                )}
              </Stack>
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={1.5}>
            <SectionTitle>Detalhes</SectionTitle>
            {tipoCadastro === "pdf" && (
              <>
                <TextField
                  label="Data do documento"
                  type="date"
                  value={form.dataDocumento}
                  onChange={(event) =>
                    handleChange("dataDocumento", event.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  sx={secretariaComponents.formField}
                />
                <TextField
                  label="Descrição"
                  value={form.descricao}
                  onChange={(event) =>
                    handleChange("descricao", event.target.value)
                  }
                  multiline
                  minRows={2}
                  size="small"
                  sx={secretariaComponents.formField}
                />
              </>
            )}

            {tipoCadastro === "planilha" && (
              <>
                <TextField
                  label="Período de referência"
                  value={form.periodoReferencia}
                  onChange={(event) =>
                    handleChange("periodoReferencia", event.target.value)
                  }
                  size="small"
                  sx={secretariaComponents.formField}
                />
                <TextField
                  label="Descrição"
                  value={form.descricao}
                  onChange={(event) =>
                    handleChange("descricao", event.target.value)
                  }
                  multiline
                  minRows={2}
                  size="small"
                  sx={secretariaComponents.formField}
                />
              </>
            )}

            {tipoCadastro === "imagem" && (
              <>
                <TextField
                  label="Texto alternativo"
                  value={form.textoAlternativo}
                  onChange={(event) =>
                    handleChange("textoAlternativo", event.target.value)
                  }
                  size="small"
                  sx={secretariaComponents.formField}
                />
                <TextField
                  label="Crédito da imagem"
                  value={form.creditoImagem}
                  onChange={(event) =>
                    handleChange("creditoImagem", event.target.value)
                  }
                  size="small"
                  sx={secretariaComponents.formField}
                />
              </>
            )}
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, px: 3, borderTop: `1px solid ${secretariaColors.borda}` }}>
        <Button onClick={onClose} disabled={saving} color="inherit">
          Cancelar
        </Button>
        <Button
          variant="contained"
          startIcon={<SaveOutlinedIcon />}
          disabled={saving || !form.titulo.trim() || !form.nomeArquivo.trim() || !arquivoPronto}
          onClick={handleSalvar}
          sx={{ borderRadius: 2, fontWeight: 850 }}
        >
          {saving
            ? "Enviando arquivo..."
            : modo === "editar"
              ? "Salvar alterações"
              : "Adicionar documento"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
