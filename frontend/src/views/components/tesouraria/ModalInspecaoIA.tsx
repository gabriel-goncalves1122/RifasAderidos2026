// ============================================================================
// ARQUIVO: frontend/src/views/components/tesouraria/ModalInspecaoIA.tsx
// ============================================================================
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CloseIcon from "@mui/icons-material/Close";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { TransacaoAgrupada } from "./AuditoriaTable";

interface Props {
  transacao: TransacaoAgrupada | null;
  dadosOcr: any;
  onClose: () => void;
}

export function ModalInspecaoIA({ transacao, dadosOcr, onClose }: Props) {
  if (!transacao) return null;

  return (
    <Dialog
      open={!!transacao}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#111",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CompareArrowsIcon /> Inspetor de Comprovativo
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#eee",
        }}
      >
        {/* LADO ESQUERDO - IMAGEM */}
        <Box
          sx={{
            flex: { md: 7 },
            bgcolor: "#222",
            minHeight: { xs: "30vh", md: "50vh" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 2,
          }}
        >
          {transacao.comprovante_url && (
            <img
              src={transacao.comprovante_url}
              alt="Comprovante Pix"
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          )}
        </Box>

        {/* LADO DIREITO - DADOS */}
        <Box
          sx={{
            flex: { md: 5 },
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="primary.main"
            sx={{
              borderBottom: "2px solid",
              borderColor: "primary.main",
              pb: 1,
            }}
          >
            Dados Extraídos (OCR)
          </Typography>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="flex"
              alignItems="center"
              gap={0.5}
            >
              <ReceiptLongIcon fontSize="small" /> ID da Transação Pix:
            </Typography>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#f8f9fa",
                borderRadius: 1,
                border: "1px solid #ddd",
                mt: 0.5,
              }}
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                sx={{
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                  color: dadosOcr?.idTransacao ? "text.primary" : "error.main",
                }}
              >
                {dadosOcr?.idTransacao || "ILEGÍVEL OU NÃO LOCALIZADO"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <PersonSearchIcon fontSize="small" /> Titular (Lido):
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                mt={0.5}
                color={
                  dadosOcr?.titularLido !== "DESCONHECIDO"
                    ? "text.primary"
                    : "text.secondary"
                }
              >
                {dadosOcr?.titularLido || "Desconhecido"}
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <AccountBalanceIcon fontSize="small" /> Banco (Lido):
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                mt={0.5}
                color={
                  dadosOcr?.banco !== "DESCONHECIDO"
                    ? "text.primary"
                    : "text.secondary"
                }
              >
                {dadosOcr?.banco || "Desconhecido"}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: "auto",
              p: 2,
              bgcolor: "#fffdf5",
              borderRadius: 2,
              border: "1px dashed #ffc107",
            }}
          >
            <Typography
              variant="caption"
              color="warning.dark"
              fontWeight="bold"
              display="block"
              mb={1}
            >
              EXPECTATIVA DO SISTEMA:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              O aderente informou que o titular da conta pagadora seria:
            </Typography>
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              color="text.primary"
            >
              {transacao.comprador_nome}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
