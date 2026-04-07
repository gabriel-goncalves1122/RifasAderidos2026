// ============================================================================
// ARQUIVO: frontend/src/views/components/AuditoriaTable.tsx
// ============================================================================
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Stack,
  Button,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload"; // ÍCONE NOVO

import { useAuditoria } from "../../../controllers/useAuditoria";
import { Bilhete } from "../../../types/models";
import { AuditoriaCard } from "./AuditoriaCard";
import { ModalRelatorioIA } from "./ModalRelatorioIA";
import { ModalImagemPix } from "../comuns/ModalImagemPix";
import { ModalConfirmacaoAuditoria } from "./ModalConfirmacaoAuditoria";

// ============================================================================
// IMPORTS DO FIREBASE PARA SALVAR O CSV NA NUVEM
// ============================================================================
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../config/firebase"; // <--- Ajustado de ../../../ para ../../

export interface TransacaoAgrupada {
  comprovante_url: string | null;
  vendedor_cpf: string;
  vendedor_nome: string;
  comprador_nome: string;
  comprador_telefone?: string;
  data_reserva: string | null;
  log_automacao?: string;
  ia_resultado?: string;
  ia_mensagem?: string;
  bilhetes: string[];
  valor_total: number;
}

export function AuditoriaTable() {
  const { buscarPendentes, avaliarComprovante, auditarEmLoteComIA } =
    useAuditoria();

  const [pendentes, setPendentes] = useState<Bilhete[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const [comprovanteAtivo, setComprovanteAtivo] = useState<string | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mensagemIA, setMensagemIA] = useState<string | null>(null);
  const [modalResumoIA, setModalResumoIA] = useState(false);

  // ESTADO NOVO PARA O UPLOAD DO CSV
  const [uploadLoading, setUploadLoading] = useState(false);

  const [modalConfirmacao, setModalConfirmacao] = useState<{
    open: boolean;
    chaveUnica: string | null;
    numeros: string[];
    decisao: "aprovar" | "rejeitar" | null;
    motivo: string;
  }>({ open: false, chaveUnica: null, numeros: [], decisao: null, motivo: "" });

  const carregarLista = async () => {
    setCarregando(true);
    const dados = await buscarPendentes();
    setPendentes(dados || []);
    setCarregando(false);
  };

  useEffect(() => {
    carregarLista();
  }, []);

  // ============================================================================
  // FUNÇÃO MÁGICA QUE LÊ O CSV DO COMPUTADOR E GUARDA O TEXTO NO FIREBASE
  // ============================================================================
  const handleUploadExtrato = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    const reader = new FileReader();

    reader.onload = async (evento) => {
      try {
        const textoCsv = evento.target?.result as string;

        // Escreve o ficheiro na base de dados (Documento: configuracoes/sistema)
        await setDoc(
          doc(db, "configuracoes", "sistema"),
          {
            extrato_csv: textoCsv,
            atualizado_em: new Date().toISOString(),
          },
          { merge: true },
        );

        alert(
          "✅ Extrato da InfinitePay guardado na nuvem com sucesso! Já pode rodar a IA.",
        );
      } catch (error) {
        console.error("Erro ao salvar extrato:", error);
        alert("❌ Falha ao salvar o extrato na base de dados.");
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // Agrupamento das transações
  const transacoesAgrupadas = pendentes.reduce<
    Record<string, TransacaoAgrupada>
  >((acc, bilhete: any) => {
    const chave = bilhete.comprovante_url || bilhete.numero;
    if (!acc[chave]) {
      acc[chave] = {
        comprovante_url: bilhete.comprovante_url,
        vendedor_cpf: bilhete.vendedor_cpf,
        vendedor_nome: bilhete.vendedor_nome || "Nome não informado",
        comprador_nome: bilhete.comprador_nome || "Nome não informado",
        comprador_telefone: bilhete.comprador_telefone,
        log_automacao: bilhete.log_automacao,
        ia_resultado: bilhete.IA_resultado,
        ia_mensagem: bilhete.IA_mensagem,
        data_reserva: bilhete.data_reserva,
        bilhetes: [bilhete.numero],
        valor_total: 10, // Assumindo R$ 10 por rifa
      };
    } else {
      acc[chave].bilhetes.push(bilhete.numero);
      acc[chave].valor_total += 10;
    }
    return acc;
  }, {});

  const listaTransacoes = Object.values(transacoesAgrupadas);

  // ==========================================================================
  // CÁLCULO DOS KPIs (Indicadores de Desempenho no Topo)
  // ==========================================================================
  let valorTotalFila = 0;
  let qtdPreAprovados = 0;
  let valorPreAprovados = 0;
  let qtdDivergentes = 0;
  let valorDivergentes = 0;

  listaTransacoes.forEach((t) => {
    valorTotalFila += t.valor_total;

    const msgIA = t.ia_mensagem || t.log_automacao;
    const isAprovado = t.ia_resultado === "APROVADO" || msgIA?.includes("✅");
    const isDivergente =
      t.ia_resultado === "DIVERGENTE" ||
      t.ia_resultado === "ERRO" ||
      msgIA?.includes("⚠️") ||
      msgIA?.includes("❌");

    if (isAprovado) {
      qtdPreAprovados++;
      valorPreAprovados += t.valor_total;
    } else if (isDivergente) {
      qtdDivergentes++;
      valorDivergentes += t.valor_total;
    }
  });

  const formatarMoeda = (valor: number) =>
    `R$ ${valor.toFixed(2).replace(".", ",")}`;

  // ==========================================================================
  // FUNÇÕES DE AÇÃO
  // ==========================================================================
  const executarTriagemIA = async () => {
    setCarregandoIA(true);
    setMensagemIA(null);
    try {
      const resposta = await auditarEmLoteComIA();
      setMensagemIA(resposta.mensagem);
      await carregarLista();
      setModalResumoIA(true);
    } catch (error) {
      setMensagemIA("Erro na comunicação com a Inteligência Artificial.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const aprovarEmLoteIA = async (transacoes: TransacaoAgrupada[]) => {
    setModalResumoIA(false);
    for (const t of transacoes) {
      setProcessandoId(t.comprovante_url || t.bilhetes[0]);
      await avaliarComprovante(t.bilhetes, "aprovar");
    }
    setProcessandoId(null);
    await carregarLista();
  };

  const confirmarAvaliacao = async () => {
    const { chaveUnica, numeros, decisao, motivo } = modalConfirmacao;
    if (!numeros.length || !decisao) return;

    setModalConfirmacao({ ...modalConfirmacao, open: false });
    setProcessandoId(chaveUnica || numeros[0]);
    setModalResumoIA(false);

    await avaliarComprovante(numeros, decisao, motivo);

    setProcessandoId(null);
    await carregarLista();
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* 1. CABEÇALHO E BOTÕES DE AÇÃO */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" color="text.primary" fontWeight="bold">
            Painel de Auditoria
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visão geral da fila e processamento via OCR.
          </Typography>
          {mensagemIA && (
            <Typography
              variant="body2"
              color="primary.main"
              fontWeight="bold"
              sx={{ mt: 1 }}
            >
              {mensagemIA}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* NOSSO NOVO BOTÃO DE UPLOAD DO CSV */}
          <Button
            component="label"
            variant="outlined"
            color="secondary"
            startIcon={
              uploadLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FileUploadIcon />
              )
            }
            disabled={uploadLoading || carregandoIA}
          >
            {uploadLoading ? "A carregar..." : "Carregar Extrato (.csv)"}
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleUploadExtrato}
            />
          </Button>

          {listaTransacoes.some((t) => t.ia_resultado || t.log_automacao) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModalResumoIA(true)}
            >
              Ver Relatório da IA
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={executarTriagemIA}
            disabled={carregandoIA || listaTransacoes.length === 0}
            startIcon={
              carregandoIA ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <FactCheckIcon />
              )
            }
          >
            {carregandoIA ? "Analisando Fila..." : "Rodar Triagem IA"}
          </Button>
        </Box>
      </Box>

      {/* 2. CARDS DE RESUMO FINANCEIRO (KPIs) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Card: Total na Fila */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "5px solid",
            borderColor: "primary.main",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Total na Fila
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="text.primary"
                sx={{ mt: 0.5 }}
              >
                {formatarMoeda(valorTotalFila)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {listaTransacoes.length} transações pendentes
              </Typography>
            </Box>
            <AccountBalanceWalletIcon
              color="primary"
              sx={{ opacity: 0.5, fontSize: 32 }}
            />
          </Box>
        </Paper>

        {/* Card: Pré-Aprovados IA */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "5px solid",
            borderColor: "success.main",
            bgcolor: qtdPreAprovados > 0 ? "#f0fdf4" : "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="success.main"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Pré-Aprovados (IA)
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="success.main"
                sx={{ mt: 0.5 }}
              >
                {formatarMoeda(valorPreAprovados)}
              </Typography>
              <Typography variant="caption" color="success.main">
                {qtdPreAprovados} transações validadas
              </Typography>
            </Box>
            <CheckCircleOutlineIcon
              color="success"
              sx={{ opacity: 0.5, fontSize: 32 }}
            />
          </Box>
        </Paper>

        {/* Card: Divergências IA */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            borderRadius: 2,
            borderLeft: "5px solid",
            borderColor: "warning.main",
            bgcolor: qtdDivergentes > 0 ? "#fffbeb" : "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="warning.main"
                fontWeight="bold"
                textTransform="uppercase"
              >
                Divergências (IA)
              </Typography>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="warning.main"
                sx={{ mt: 0.5 }}
              >
                {formatarMoeda(valorDivergentes)}
              </Typography>
              <Typography variant="caption" color="warning.main">
                {qtdDivergentes} transações com alerta
              </Typography>
            </Box>
            <WarningAmberIcon
              color="warning"
              sx={{ opacity: 0.5, fontSize: 32 }}
            />
          </Box>
        </Paper>
      </Box>

      {/* 3. LISTA DE TRANSAÇÕES */}
      {listaTransacoes.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 5,
            bgcolor: "white",
            borderRadius: 2,
            border: "1px dashed #ccc",
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 60, color: "success.light", mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary">
            Fila Limpa!
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {listaTransacoes.map((t) => (
            <AuditoriaCard
              key={t.comprovante_url || t.bilhetes[0]}
              transacao={t}
              isProcessando={
                processandoId === (t.comprovante_url || t.bilhetes[0])
              }
              onVerPix={(url) => setComprovanteAtivo(url)}
              onAprovar={(url, numeros) =>
                setModalConfirmacao({
                  open: true,
                  chaveUnica: url,
                  numeros,
                  decisao: "aprovar",
                  motivo: "",
                })
              }
              onRejeitar={(url, numeros, motivo) =>
                setModalConfirmacao({
                  open: true,
                  chaveUnica: url,
                  numeros,
                  decisao: "rejeitar",
                  motivo,
                })
              }
            />
          ))}
        </Stack>
      )}

      {/* MODAIS DE APOIO */}
      <ModalRelatorioIA
        open={modalResumoIA}
        onClose={() => setModalResumoIA(false)}
        transacoes={listaTransacoes}
        onAprovarLote={aprovarEmLoteIA}
        onRejeitar={(url, numeros, motivo) =>
          setModalConfirmacao({
            open: true,
            chaveUnica: url,
            numeros,
            decisao: "rejeitar",
            motivo,
          })
        }
      />
      <ModalImagemPix
        url={comprovanteAtivo}
        onClose={() => setComprovanteAtivo(null)}
      />
      <ModalConfirmacaoAuditoria
        open={modalConfirmacao.open}
        decisao={modalConfirmacao.decisao}
        quantidade={modalConfirmacao.numeros.length}
        motivo={modalConfirmacao.motivo}
        onClose={() =>
          setModalConfirmacao({ ...modalConfirmacao, open: false })
        }
        onConfirm={confirmarAvaliacao}
      />
    </Box>
  );
}
