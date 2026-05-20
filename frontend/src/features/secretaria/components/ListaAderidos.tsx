// ============================================================================
// ARQUIVO: frontend/src/views/components/secretaria/ListaAderidos.tsx
// ============================================================================
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Divider,
  ButtonBase,
} from "@mui/material";

import { CargoChip } from "./CargoChip";
import { StatusChip } from "./StatusChip";
import { ModalidadeChip } from "./ModalidadeChip";
import { AderidoSecretaria } from "../../../shared/types/secretaria";

interface ListaAderidosProps {
  aderidos: AderidoSecretaria[];
  onSelecionarAderido?: (aderido: AderidoSecretaria) => void;
}

export function ListaAderidos({
  aderidos,
  onSelecionarAderido,
}: ListaAderidosProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (aderidos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="body1" color="text.secondary" fontWeight="bold">
          Nenhum resultado encontrado.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Tente alterar os termos da pesquisa ou limpar os filtros.
        </Typography>
      </Box>
    );
  }

  const renderUsuario = (aderido: AderidoSecretaria, avatarSize = 32) => (
    <ButtonBase
      onClick={() => onSelecionarAderido?.(aderido)}
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        borderRadius: 1,
        textAlign: "left",
        p: 0.5,
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: avatarSize,
            height: avatarSize,
            bgcolor:
              aderido.status_cadastro === "ativo" ? "primary.main" : "grey.400",
          }}
        >
          {aderido.nome ? aderido.nome.charAt(0).toUpperCase() : "?"}
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            fontWeight={aderido.status_cadastro === "ativo" ? "bold" : "normal"}
            color={aderido.nome ? "text.primary" : "text.disabled"}
          >
            {aderido.nome || "Não definido"}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ wordBreak: "break-all" }}
          >
            Clique para ver detalhes
          </Typography>
        </Box>
      </Stack>
    </ButtonBase>
  );

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {aderidos.map((aderido) => (
          <Card key={aderido.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              {renderUsuario(aderido, 40)}

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1, wordBreak: "break-all" }}
              >
                {aderido.email}
              </Typography>

              <Divider sx={{ my: 1.5 }} />

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Modalidade
                  </Typography>
                  <ModalidadeChip modalidade={aderido.modalidade_adesao} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Cargo
                  </Typography>
                  <CargoChip cargo={aderido.cargo} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <StatusChip status={aderido.status_cadastro} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>
              <strong>Usuário</strong>
            </TableCell>
            <TableCell>
              <strong>E-mail Autorizado</strong>
            </TableCell>
            <TableCell>
              <strong>Modalidade</strong>
            </TableCell>
            <TableCell>
              <strong>Titularidade</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Status do Cadastro</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {aderidos.map((aderido) => (
            <TableRow key={aderido.id} hover>
              <TableCell>{renderUsuario(aderido)}</TableCell>

              <TableCell>
                <Typography variant="body2">{aderido.email}</Typography>
              </TableCell>

              <TableCell>
                <ModalidadeChip modalidade={aderido.modalidade_adesao} />
              </TableCell>

              <TableCell>
                <CargoChip cargo={aderido.cargo} />
              </TableCell>

              <TableCell align="center">
                <StatusChip status={aderido.status_cadastro} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
