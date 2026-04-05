import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";

import { useRifasController } from "../../controllers/useRifasController";
import { Bilhete } from "../../types/models";
import { AuditoriaCard } from "./AuditoriaCard";
import { ModalRelatorioIA } from "./ModalRelatorioIA";
import { ModalImagemPix } from "./ModalImagemPix";
import { ModalConfirmacaoAuditoria } from "./ModalConfirmacaoAuditoria";

export interface TransacaoAgrupada {
  comprovante_url: string | null;
  vendedor_cpf: string;
  vendedor_nome: string;
  comprador_nome: string;
  data_reserva: string | null;
  log_automacao: string | undefined;
  bilhetes: string[];
}

export function AuditoriaTable() {
  const { buscarPendentes, avaliarComprovante, auditarEmLoteComIA } =
    useRifasController();

  const [pendentes, setPendentes] = useState<Bilhete[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const [comprovanteAtivo, setComprovanteAtivo] = useState<string | null>(null);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mensagemIA, setMensagemIA] = useState<string | null>(null);
  const [modalResumoIA, setModalResumoIA] = useState(false);

  // Agora guardamos também o motivo da recusa na confirmação
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

  const transacoesAgrupadas = pendentes.reduce<
    Record<string, TransacaoAgrupada>
  >((acc, bilhete) => {
    const chave = bilhete.comprovante_url || bilhete.numero;
    if (!acc[chave]) {
      acc[chave] = {
        comprovante_url: bilhete.comprovante_url,
        vendedor_cpf: bilhete.vendedor_cpf,
        vendedor_nome: bilhete.vendedor_nome || "Nome não informado",
        comprador_nome: bilhete.comprador_nome || "Nome não informado",
        log_automacao: bilhete.log_automacao || undefined,
        data_reserva: bilhete.data_reserva,
        bilhetes: [bilhete.numero],
      };
    } else {
      acc[chave].bilhetes.push(bilhete.numero);
    }
    return acc;
  }, {});

  const listaTransacoes = Object.values(transacoesAgrupadas);

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

  // Função nova: Passa por todos do lote aprovado e chama a API
  const aprovarEmLoteIA = async (transacoes: TransacaoAgrupada[]) => {
    setModalResumoIA(false); // Fecha o modal primeiro para ver os loadings
    for (const t of transacoes) {
      setProcessandoId(t.comprovante_url || t.bilhetes[0]);
      // ATENÇÃO: Seu hook precisa aceitar o 'motivo' opcional: avaliarComprovante(num, status, motivo?)
      await avaliarComprovante(
        t.bilhetes,
        "aprovar" /* aqui pode passar o motivo "" se o seu controller exigir */,
      );
    }
    setProcessandoId(null);
    await carregarLista();
  };

  const confirmarAvaliacao = async () => {
    const { chaveUnica, numeros, decisao, motivo } = modalConfirmacao;
    if (!numeros.length || !decisao) return;

    setModalConfirmacao({ ...modalConfirmacao, open: false });
    setProcessandoId(chaveUnica || numeros[0]);

    // Opcionalmente, feche o modal da IA se ele estiver aberto
    setModalResumoIA(false);

    // Agora passamos o motivo de verdade (sem comentários)
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
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: "white",
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          boxShadow: 1,
        }}
      >
        <Box>
          <Typography variant="h6" color="text.primary" fontWeight="bold">
            Auditoria Inteligente (OCR)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Processamento automatizado de comprovantes via leitura de Pix.
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
        <Box sx={{ display: "flex", gap: 1 }}>
          {listaTransacoes.some((t) => t.log_automacao) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setModalResumoIA(true)}
            >
              Ver Relatório
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
            {carregandoIA ? "Analisando..." : "Rodar Triagem IA"}
          </Button>
        </Box>
      </Box>

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

      {/* COMPONENTES MODAIS */}
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
