import { useState } from "react";
import { Box, Card, CardActions, CardContent, Typography } from "@mui/material";

import { auditoriaCardStyles } from "../auditoriaCardStyles";
import { TransacaoAgrupada } from "../auditoriaTypes";
import {
  formatarDataAuditoria,
  obterEstadoAuditoriaIA,
} from "../auditoriaUtils";

import { AuditoriaCardActions } from "./card/AuditoriaCardActions";
import { AuditoriaIaAlert } from "./card/AuditoriaIaAlert";
import { AuditoriaIaStatus } from "./card/AuditoriaIaStatus";
import { AuditoriaInfoVenda } from "./card/AuditoriaInfoVenda";
import { AuditoriaRecusaForm } from "./card/AuditoriaRecusaForm";
import { AuditoriaResumoPix } from "./card/AuditoriaResumoPix";

interface AuditoriaCardProps {
  transacao: TransacaoAgrupada;
  isProcessando: boolean;
  onVerPix: (url: string) => void;
  onAprovar: (url: string | null, bilhetes: string[]) => void;
  onRejeitar: (url: string | null, bilhetes: string[], motivo: string) => void;
}

export function AuditoriaCard({
  transacao,
  isProcessando,
  onVerPix,
  onAprovar,
  onRejeitar,
}: AuditoriaCardProps) {
  const [recusaAberta, setRecusaAberta] = useState(false);
  const [motivo, setMotivo] = useState("");

  const estadoIA = obterEstadoAuditoriaIA(transacao);

  const handleRejeitar = () => {
    if (!recusaAberta) {
      setRecusaAberta(true);
      return;
    }

    onRejeitar(transacao.comprovante_url, transacao.bilhetes, motivo);
    setRecusaAberta(false);
    setMotivo("");
  };

  const handleCancelarRecusa = () => {
    setRecusaAberta(false);
    setMotivo("");
  };

  return (
    <Card
      elevation={0}
      sx={{
        ...auditoriaCardStyles.card,
        ...(estadoIA.aprovada ? auditoriaCardStyles.cardAprovado : {}),
        ...(estadoIA.divergente ? auditoriaCardStyles.cardDivergente : {}),
      }}
    >
      <Box sx={auditoriaCardStyles.topo}>
        <Box>
          <Typography sx={auditoriaCardStyles.dataReserva}>
            Reserva: {formatarDataAuditoria(transacao.data_reserva)}
          </Typography>

          <Typography
            sx={{
              color: "#021B16",
              fontWeight: 900,
              fontSize: "1.05rem",
              mt: 0.25,
            }}
          >
            {transacao.comprador_nome || "Comprador não informado"}
          </Typography>
        </Box>

        <AuditoriaIaStatus estadoIA={estadoIA} />
      </Box>

      <CardContent sx={auditoriaCardStyles.conteudo}>
        <AuditoriaIaAlert estadoIA={estadoIA} />

        <Box sx={auditoriaCardStyles.gridInformacoes}>
          <AuditoriaResumoPix
            compradorNome={transacao.comprador_nome}
            valorTotal={transacao.valor_total}
          />

          <AuditoriaInfoVenda
            vendedorNome={transacao.vendedor_nome}
            bilhetes={transacao.bilhetes}
          />
        </Box>
      </CardContent>

      <CardActions sx={auditoriaCardStyles.actions}>
        <Box sx={{ width: "100%" }}>
          <AuditoriaCardActions
            possuiComprovante={Boolean(transacao.comprovante_url)}
            isProcessando={isProcessando}
            recusaAberta={recusaAberta}
            onVerPix={() => {
              if (transacao.comprovante_url) {
                onVerPix(transacao.comprovante_url);
              }
            }}
            onAprovar={() =>
              onAprovar(transacao.comprovante_url, transacao.bilhetes)
            }
            onRejeitar={handleRejeitar}
          />

          <AuditoriaRecusaForm
            aberto={recusaAberta}
            motivo={motivo}
            onChangeMotivo={setMotivo}
            onCancelar={handleCancelarRecusa}
          />
        </Box>
      </CardActions>
    </Card>
  );
}
