import type { ReactNode } from "react";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

import { secretariaColors } from "../../../styles/colors";
import { StatusChip } from "../shared/StatusChip";
import { ModalidadeChip } from "../shared/ModalidadeChip";
import { CargoChip } from "../shared/CargoChip";
import {
  formatarCpf,
  formatarNomeMembro,
  formatarTelefone,
} from "../../utils/formatadoresSecretaria";
import type { AderidoSecretaria } from "@/shared/types/secretaria";

interface InformacoesAderidoCardProps {
  aderido: AderidoSecretaria;
}

interface LinhaInformacaoProps {
  label: string;
  valor?: string | null;
}

function LinhaInformacao({ label, valor }: LinhaInformacaoProps) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={800}
        sx={{ display: "block", mb: 0.35 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        color={valor ? secretariaColors.pretoEsverdeado : "text.disabled"}
        fontWeight={valor ? 750 : 600}
        sx={{ overflowWrap: "anywhere", lineHeight: 1.35 }}
      >
        {valor || "Não informado"}
      </Typography>
    </Box>
  );
}

function SecaoInformacao({
  titulo,
  children,
}: {
  titulo: string;
  children: ReactNode;
}) {
  return (
    <Stack spacing={1.25}>
      <Typography
        variant="overline"
        color="primary.dark"
        fontWeight={900}
        sx={{ letterSpacing: "0.08em", lineHeight: 1 }}
      >
        {titulo}
      </Typography>
      {children}
    </Stack>
  );
}

export function InformacoesAderidoCard({ aderido }: InformacoesAderidoCardProps) {
  const cargo = aderido.cargo || "aderido";
  const cargoTexto = cargo === "aderido" ? "Aderido" : cargo;
  const dataNascimento = aderido.data_nascimento || aderido.dataNascimento;

  return (
    <Paper
      elevation={0}
      data-testid="informacoes-aderido-card"
      sx={{
        p: { xs: 2, sm: 2.25 },
        borderRadius: 2,
        border: `1px solid ${secretariaColors.borda}`,
        bgcolor: secretariaColors.branco,
        boxShadow: `0 12px 28px ${secretariaColors.sombra}`,
      }}
    >
      <Stack spacing={2.25} divider={<Divider flexItem />}>
        <SecaoInformacao titulo="Contato">
          <Stack spacing={1.5}>
            <LinhaInformacao label="Nome" valor={formatarNomeMembro(aderido.nome)} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 1.5,
              }}
            >
              <LinhaInformacao label="CPF" valor={formatarCpf(aderido.cpf)} />
              <LinhaInformacao label="Telefone" valor={formatarTelefone(aderido.telefone)} />
            </Box>
          </Stack>
        </SecaoInformacao>

        <SecaoInformacao titulo="Dados pessoais">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            <LinhaInformacao label="Curso" valor={aderido.curso} />
            <LinhaInformacao label="Gênero" valor={aderido.genero} />
            <LinhaInformacao label="Data de nascimento" valor={dataNascimento} />
          </Box>
        </SecaoInformacao>

        <SecaoInformacao titulo="Vínculo">
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <StatusChip status={aderido.status_cadastro} />
            <ModalidadeChip modalidade={aderido.modalidade_adesao} />
            <CargoChip cargo={cargo} />
          </Stack>
          {cargo === "aderido" && <LinhaInformacao label="Cargo" valor={cargoTexto} />}
        </SecaoInformacao>
      </Stack>
    </Paper>
  );
}
