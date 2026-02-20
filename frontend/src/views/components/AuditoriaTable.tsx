// ============================================================================
// ARQUIVO: AuditoriaTable.tsx (Tabela com Modal de Confirmação Animado)
// ============================================================================
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
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
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useRifasController } from "../../controllers/useRifasController";
import { Bilhete } from "../../types/models";

// NOVA PROP: Avisa o "Pai" (Dashboard) que algo mudou no banco
interface AuditoriaTableProps {
  onAtualizacao?: () => void;
}

export function AuditoriaTable({ onAtualizacao }: AuditoriaTableProps) {
  const { buscarPendentes, avaliarComprovante } = useRifasController();

  const [pendentes, setPendentes] = useState<Bilhete[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [comprovanteAtivo, setComprovanteAtivo] = useState<string | null>(null);

  // ESTADO DO NOVO MODAL DE CONFIRMAÇÃO
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

  const transacoesAgrupadas = pendentes.reduce(
    (acc, bilhete) => {
      const chave = bilhete.comprovante_url || bilhete.numero;
      if (!acc[chave]) {
        acc[chave] = {
          comprovante_url: bilhete.comprovante_url,
          vendedor_cpf: bilhete.vendedor_cpf,
          data_reserva: bilhete.data_reserva,
          bilhetes: [bilhete.numero],
        };
      } else {
        acc[chave].bilhetes.push(bilhete.numero);
      }
      return acc;
    },
    {} as Record<
      string,
      {
        comprovante_url: string | null;
        vendedor_cpf: string;
        data_reserva: string | null;
        bilhetes: string[];
      }
    >,
  );

  const listaTransacoes = Object.values(transacoesAgrupadas);

  // 1. ABRE O MODAL BONITO (Em vez do window.confirm)
  const solicitarAvaliacao = (
    chaveUnica: string | null,
    numeros: string[],
    decisao: "aprovar" | "rejeitar",
  ) => {
    setModalConfirmacao({ open: true, chaveUnica, numeros, decisao });
  };

  // 2. EXECUTA A AÇÃO QUANDO O USUÁRIO CLICAR EM "SIM" NO MODAL
  const confirmarAvaliacao = async () => {
    const { chaveUnica, numeros, decisao } = modalConfirmacao;
    if (!numeros.length || !decisao) return;

    setModalConfirmacao({ ...modalConfirmacao, open: false }); // Fecha o modal
    setProcessandoId(chaveUnica || numeros[0]);

    const promessas = numeros.map((num) => avaliarComprovante(num, decisao));
    await Promise.all(promessas);

    setProcessandoId(null);
    carregarLista(); // Limpa a tabela da tesouraria

    // 🔥 O SEGREDO DO "NÃO PRECISA DE F5"
    if (onAtualizacao) {
      onAtualizacao();
    }
  };

  if (carregando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (listaTransacoes.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: "success.light", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Tudo limpo!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Não há comprovantes pendentes de auditoria.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell>
                <strong>Rifas do Pedido</strong>
              </TableCell>
              <TableCell>
                <strong>Valor Esperado</strong>
              </TableCell>
              <TableCell>
                <strong>Data</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Comprovante</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Ações (Lote)</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listaTransacoes.map((transacao) => {
              const dataFormatada = transacao.data_reserva
                ? new Date(transacao.data_reserva).toLocaleDateString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A";

              const valorTotal = (transacao.bilhetes.length * 10)
                .toFixed(2)
                .replace(".", ",");
              const isProcessando =
                processandoId ===
                (transacao.comprovante_url || transacao.bilhetes[0]);

              return (
                <TableRow
                  key={transacao.comprovante_url || transacao.bilhetes[0]}
                  hover
                >
                  <TableCell>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {transacao.bilhetes.map((num) => (
                        <Chip
                          key={num}
                          label={num}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      fontWeight="bold"
                      color="success.main"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <AttachMoneyIcon fontSize="small" /> {valorTotal}
                    </Typography>
                  </TableCell>
                  <TableCell>{dataFormatada}</TableCell>
                  <TableCell align="center">
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
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* MODAL 1: FOTO DO PIX */}
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
              alt="Comprovante de Pagamento"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          )}
        </Box>
      </Dialog>

      {/* MODAL 2: CONFIRMAÇÃO DE AÇÃO (O Novo "Window.Confirm") */}
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
            pagamento de {modalConfirmacao.numeros.length} rifa(s):
            <br />
            <br />
            <strong>Bilhetes:</strong> {modalConfirmacao.numeros.join(", ")}
            <br />
            <br />
            {modalConfirmacao.decisao === "aprovar"
              ? "Esta ação confirmará a venda e atualizará a meta do aderido. Deseja continuar?"
              : "Esta ação devolverá as rifas para o mercado e apagará o comprovante. Deseja continuar?"}
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
    </Box>
  );
}
