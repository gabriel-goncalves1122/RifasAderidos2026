// ============================================================================
// ARQUIVO: frontend/src/views/components/AuditoriaTable.tsx
// ============================================================================
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Dialog,
  IconButton,
  Chip,
  Stack,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useRifasController } from "../../controllers/useRifasController";
import { Bilhete } from "../../types/models";

// ==========================================================================
// CONTRATO DE AGRUPAMENTO (Corrigido para aceitar string ou undefined)
// ==========================================================================
interface TransacaoAgrupada {
  comprovante_url: string | null;
  vendedor_cpf: string;
  vendedor_nome: string;
  comprador_nome: string;
  data_reserva: string | null;
  log_automacao: string | undefined; // <- Erro 1 e 2 corrigidos aqui
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

  const [modalConfirmacao, setModalConfirmacao] = useState<{
    open: boolean;
    chaveUnica: string | null;
    numeros: string[];
    decisao: "aprovar" | "rejeitar" | null;
  }>({ open: false, chaveUnica: null, numeros: [], decisao: null });

  const carregarLista = async () => {
    setCarregando(true);
    const dados = await buscarPendentes();
    setPendentes(dados || []);
    setCarregando(false);
  };

  useEffect(() => {
    carregarLista();
  }, []);

  // ==========================================================================
  // AGRUPAMENTO TIPADO
  // ==========================================================================
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
        // Passamos undefined em vez de null caso não exista o log
        log_automacao: bilhete.log_automacao || undefined,
        data_reserva: bilhete.data_reserva,
        bilhetes: [bilhete.numero],
      };
    } else {
      acc[chave].bilhetes.push(bilhete.numero);
    }
    return acc;
  }, {});

  const listaTransacoes: TransacaoAgrupada[] =
    Object.values(transacoesAgrupadas);

  const solicitarAvaliacao = (
    chaveUnica: string | null,
    numeros: string[],
    decisao: "aprovar" | "rejeitar",
  ) => {
    setModalConfirmacao({ open: true, chaveUnica, numeros, decisao });
  };

  const confirmarAvaliacao = async () => {
    const { chaveUnica, numeros, decisao } = modalConfirmacao;
    if (!numeros.length || !decisao) return;

    setModalConfirmacao({ ...modalConfirmacao, open: false });
    setProcessandoId(chaveUnica || numeros[0]);

    await avaliarComprovante(numeros, decisao);

    setProcessandoId(null);
    await carregarLista();
  };

  const executarTriagemIA = async () => {
    setCarregandoIA(true);
    setMensagemIA(null);
    try {
      const resposta = await auditarEmLoteComIA();
      setMensagemIA(resposta.mensagem);
      await carregarLista(); // Recarrega a lista com os selos da IA
      setModalResumoIA(true); // ABRE O MODAL DE RESUMO IMEDIATAMENTE!
    } catch (error) {
      setMensagemIA(
        "Erro ao executar a IA. Verifique se o motor Python está rodando.",
      );
    } finally {
      setCarregandoIA(false);
    }
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO
  // ==========================================================================
  return (
    <Box>
      {/* PAINEL SUPERIOR DA IA */}
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
            Auditoria Inteligente
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cruze os comprovantes anexados com o banco de dados da tesouraria
            usando OCR.
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
          sx={{ minWidth: 200, py: 1.5 }}
        >
          {carregandoIA ? "Analisando..." : "Rodar Triagem IA"}
        </Button>
      </Box>

      {/* LISTA VAZIA */}
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
            Tudo limpo!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Não há comprovantes pendentes de auditoria.
          </Typography>
        </Box>
      ) : (
        /* LISTA DE COMPROVANTES */
        <Stack spacing={3}>
          {listaTransacoes.map((transacao) => {
            const dataFormatada = transacao.data_reserva
              ? new Date(transacao.data_reserva).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Data não registrada";

            const valorTotal = (transacao.bilhetes.length * 10)
              .toFixed(2)
              .replace(".", ",");
            const isProcessando =
              processandoId ===
              (transacao.comprovante_url || transacao.bilhetes[0]);

            return (
              <Card
                key={transacao.comprovante_url || transacao.bilhetes[0]}
                elevation={3}
                sx={{
                  borderRadius: 2,
                  borderLeft: "6px solid",
                  borderColor: "warning.main",
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  {/* CABEÇALHO DO CARD */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarTodayIcon fontSize="small" /> {dataFormatada}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="success.main"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AttachMoneyIcon /> {valorTotal}
                    </Typography>
                  </Box>

                  {/* TAG DA IA (Se houver) */}
                  {transacao.log_automacao && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        bgcolor: transacao.log_automacao.includes("✅")
                          ? "#e8f5e9"
                          : "#fff3e0",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: transacao.log_automacao.includes("✅")
                          ? "#c8e6c9"
                          : "#ffe0b2",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          transacao.log_automacao.includes("✅")
                            ? "success.dark"
                            : "warning.dark"
                        }
                      >
                        {transacao.log_automacao}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ mb: 2 }} />

                  {/* METADADOS DA VENDA */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Vendido por (Aderido):
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <BadgeIcon fontSize="small" color="primary" />{" "}
                        {transacao.vendedor_nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        CPF: {transacao.vendedor_cpf}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Comprado por:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <PersonIcon fontSize="small" color="secondary" />{" "}
                        {transacao.comprador_nome}
                      </Typography>
                    </Box>
                  </Box>

                  {/* RIFAS AGRUPADAS */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={1}
                  >
                    Rifas do Pedido ({transacao.bilhetes.length}):
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {transacao.bilhetes.map((num: string) => (
                      <Chip
                        key={num}
                        label={num}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: "bold" }}
                      />
                    ))}
                  </Box>
                </CardContent>

                {/* ÁREA DE AÇÕES */}
                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    pt: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 1,
                    bgcolor: "#f9f9f9",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityIcon />}
                    disabled={!transacao.comprovante_url}
                    onClick={() =>
                      setComprovanteAtivo(transacao.comprovante_url)
                    }
                  >
                    Ver Pix
                  </Button>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      startIcon={
                        isProcessando ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      disabled={isProcessando}
                      onClick={() =>
                        solicitarAvaliacao(
                          transacao.comprovante_url,
                          transacao.bilhetes,
                          "aprovar",
                        )
                      }
                    >
                      Aprovar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      startIcon={<CancelIcon />}
                      disabled={isProcessando}
                      onClick={() =>
                        solicitarAvaliacao(
                          transacao.comprovante_url,
                          transacao.bilhetes,
                          "rejeitar",
                        )
                      }
                    >
                      Rejeitar
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* MODAL DO PIX */}
      <Dialog
        open={!!comprovanteAtivo}
        onClose={() => setComprovanteAtivo(null)}
        maxWidth="md"
        fullWidth
      >
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#000",
            minHeight: "300px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton
            onClick={() => setComprovanteAtivo(null)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <CloseIcon />
          </IconButton>
          {comprovanteAtivo && (
            <img
              src={comprovanteAtivo}
              alt="Comprovante Pix"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>

      {/* MODAL DE CONFIRMAÇÃO */}
      <Dialog
        open={modalConfirmacao.open}
        onClose={() =>
          setModalConfirmacao({ ...modalConfirmacao, open: false })
        }
        PaperProps={{ sx: { borderRadius: 2, padding: 1 } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color:
              modalConfirmacao.decisao === "aprovar"
                ? "success.main"
                : "error.main",
          }}
        >
          {modalConfirmacao.decisao === "aprovar" ? (
            <CheckCircleIcon />
          ) : (
            <WarningAmberIcon />
          )}
          Confirmar{" "}
          {modalConfirmacao.decisao === "aprovar" ? "Aprovação" : "Rejeição"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você está prestes a <strong>{modalConfirmacao.decisao}</strong> o
            pagamento de {modalConfirmacao.numeros.length} rifa(s).
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, pr: 2 }}>
          <Button
            onClick={() =>
              setModalConfirmacao({ ...modalConfirmacao, open: false })
            }
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmarAvaliacao}
            variant="contained"
            color={modalConfirmacao.decisao === "aprovar" ? "success" : "error"}
          >
            Sim, {modalConfirmacao.decisao}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================== */}
      {/* MODAL DE RESUMO DA INTELIGÊNCIA ARTIFICIAL                                 */}
      {/* ========================================================================== */}
      <Dialog
        open={modalResumoIA}
        onClose={() => setModalResumoIA(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FactCheckIcon />
          Relatório da Triagem Inteligente
        </DialogTitle>
        <DialogContent sx={{ mt: 2, p: 3, bgcolor: "#f5f5f5" }}>
          <DialogContentText sx={{ mb: 3, fontWeight: "bold" }}>
            A Inteligência Artificial analisou todos os comprovantes. Revise os
            resultados abaixo antes de aprovar o dinheiro.
          </DialogContentText>

          {/* SESSÃO 1: PRÉ-APROVADOS */}
          <Accordion
            defaultExpanded
            sx={{ borderLeft: "4px solid #4caf50", mb: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <CheckCircleIcon color="success" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="success.dark">
                Pré-Aprovados pela IA (
                {
                  listaTransacoes.filter((t) => t.log_automacao?.includes("✅"))
                    .length
                }
                )
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "white" }}>
              <List disablePadding>
                {listaTransacoes
                  .filter((t) => t.log_automacao?.includes("✅"))
                  .map((t, idx) => (
                    <Box key={idx}>
                      <ListItem>
                        <ListItemText
                          primary={`Comprador: ${t.comprador_nome} | Valor: R$ ${(t.bilhetes.length * 10).toFixed(2).replace(".", ",")}`}
                          secondary={t.log_automacao}
                          secondaryTypographyProps={{
                            color: "success.main",
                            fontWeight: "bold",
                          }}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                {listaTransacoes.filter((t) => t.log_automacao?.includes("✅"))
                  .length === 0 && (
                  <Typography variant="body2" color="text.secondary" p={2}>
                    Nenhum comprovante validado com sucesso.
                  </Typography>
                )}
              </List>
            </AccordionDetails>
          </Accordion>

          {/* SESSÃO 2: DIVERGENTES (Fraudes, erros ou atrasos) */}
          <Accordion defaultExpanded sx={{ borderLeft: "4px solid #ff9800" }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <WarningAmberIcon color="warning" sx={{ mr: 1 }} />
              <Typography fontWeight="bold" color="warning.dark">
                Divergências Encontradas (
                {
                  listaTransacoes.filter(
                    (t) => t.log_automacao && !t.log_automacao.includes("✅"),
                  ).length
                }
                )
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "white" }}>
              <List disablePadding>
                {listaTransacoes
                  .filter(
                    (t) => t.log_automacao && !t.log_automacao.includes("✅"),
                  )
                  .map((t, idx) => (
                    <Box key={idx}>
                      <ListItem>
                        <ListItemText
                          primary={`Comprador: ${t.comprador_nome} | Rifas: ${t.bilhetes.join(", ")}`}
                          secondary={t.log_automacao}
                          secondaryTypographyProps={{
                            color: "error.main",
                            fontWeight: "bold",
                          }}
                        />
                      </ListItem>
                      <Divider />
                    </Box>
                  ))}
                {listaTransacoes.filter(
                  (t) => t.log_automacao && !t.log_automacao.includes("✅"),
                ).length === 0 && (
                  <Typography variant="body2" color="text.secondary" p={2}>
                    Nenhuma divergência encontrada!
                  </Typography>
                )}
              </List>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Button
            onClick={() => setModalResumoIA(false)}
            variant="contained"
            color="primary"
          >
            Entendido, Vou Analisar os Cards
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
