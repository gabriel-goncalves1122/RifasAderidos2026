import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/shared/hooks/useDebounce";

import { documentosSecretariaService } from "../services/documentosSecretariaService";
import {
  filtrarDocumentosSecretaria,
  inferirTipoCadastroDocumento,
  obterUrlVisualizacaoSegura,
} from "../utils/documentosSecretariaUtils";
import type {
  AreaDocumentoComissao,
  DocumentoComissao,
  DocumentoEditorState,
  DocumentoFormData,
  DocumentoPreviewState,
  TipoDocumentoCadastro,
} from "../types/documentosSecretariaTypes";

export function useDocumentosSecretaria() {
  const [documentos, setDocumentos] = useState<DocumentoComissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [area, setArea] = useState<AreaDocumentoComissao | "todas">("todas");
  const [preview, setPreview] = useState<DocumentoPreviewState>({
    open: false,
    documento: null,
    url: null,
    loading: false,
    erro: null,
  });
  const previewRequestId = useRef(0);
  const previewUrlAtual = useRef<string | null>(null);
  const [editor, setEditor] = useState<DocumentoEditorState>({
    open: false,
    modo: "criar",
    tipoCadastro: "pdf",
    documento: null,
  });

  const carregarDocumentos = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const resposta = await documentosSecretariaService.listarDocumentos();
      setDocumentos(resposta);
    } catch {
      setErro("Não foi possível carregar os documentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  const debouncedBusca = useDebounce(busca, 250);

  const documentosFiltrados = useMemo(
    () => filtrarDocumentosSecretaria(documentos, { busca: debouncedBusca, area }),
    [area, debouncedBusca, documentos],
  );

  const revogarPreviewUrl = useCallback(() => {
    if (previewUrlAtual.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlAtual.current);
    }
    previewUrlAtual.current = null;
  }, []);

  const abrirPreview = useCallback(async (documento: DocumentoComissao) => {
    previewRequestId.current += 1;
    const requestId = previewRequestId.current;
    revogarPreviewUrl();

    const urlLegada = obterUrlVisualizacaoSegura(documento.urlVisualizacao);
    setPreview({
      open: true,
      documento,
      url: urlLegada,
      loading: Boolean(documento.storagePath),
      erro: null,
    });

    if (!documento.storagePath) return;

    try {
      const blob = await documentosSecretariaService.baixarConteudo(documento.id);
      if (previewRequestId.current !== requestId) return;

      const url = URL.createObjectURL(blob);
      previewUrlAtual.current = url;
      setPreview({ open: true, documento, url, loading: false, erro: null });
    } catch {
      if (previewRequestId.current !== requestId) return;
      setPreview({
        open: true,
        documento,
        url: urlLegada,
        loading: false,
        erro: "Não foi possível carregar o arquivo.",
      });
    }
  }, [revogarPreviewUrl]);

  const fecharPreview = useCallback(() => {
    previewRequestId.current += 1;
    revogarPreviewUrl();
    setPreview({
      open: false,
      documento: null,
      url: null,
      loading: false,
      erro: null,
    });
  }, [revogarPreviewUrl]);

  useEffect(() => () => revogarPreviewUrl(), [revogarPreviewUrl]);

  const abrirCriacao = useCallback((tipoCadastro: TipoDocumentoCadastro) => {
    setEditor({
      open: true,
      modo: "criar",
      tipoCadastro,
      documento: null,
    });
  }, []);

  const abrirEdicao = useCallback((documento: DocumentoComissao) => {
    setEditor({
      open: true,
      modo: "editar",
      tipoCadastro: inferirTipoCadastroDocumento(documento),
      documento,
    });
  }, []);

  const fecharEditor = useCallback(() => {
    setEditor((atual) => ({ ...atual, open: false }));
  }, []);

  const salvarDocumento = useCallback(
    async (dados: DocumentoFormData) => {
      if (editor.modo === "editar" && editor.documento) {
        const atualizado = await documentosSecretariaService.atualizarDocumento(
          editor.documento,
          dados,
        );

        setDocumentos((atuais) =>
          atuais.map((documento) =>
            documento.id === atualizado.id ? atualizado : documento,
          ),
        );
        if (preview.documento?.id === atualizado.id) {
          fecharPreview();
        }
        await carregarDocumentos();
        fecharEditor();
        return;
      }

      const novoDocumento =
        await documentosSecretariaService.criarDocumento(dados);
      setDocumentos((atuais) => [novoDocumento, ...atuais]);
      await carregarDocumentos();
      fecharEditor();
    },
    [
      carregarDocumentos,
      editor.documento,
      editor.modo,
      fecharEditor,
      fecharPreview,
      preview.documento?.id,
    ],
  );

  return {
    documentos,
    documentosFiltrados,
    loading,
    erro,
    busca,
    area,
    preview,
    editor,
    setBusca,
    setArea,
    abrirPreview,
    fecharPreview,
    abrirCriacao,
    abrirEdicao,
    fecharEditor,
    salvarDocumento,
    recarregar: carregarDocumentos,
  };
}
