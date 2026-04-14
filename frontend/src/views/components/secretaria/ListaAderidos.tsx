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
} from "@mui/material";
import { CargoChip } from "./CargoChip";
import { StatusChip } from "./StatusChip";
import { Aderido } from "../../pages/SecretariaPage";

interface ListaAderidosProps {
  aderidos: Aderido[];
}

export function ListaAderidos({ aderidos }: ListaAderidosProps) {
  const theme = useTheme();
  // Se a tela for menor que 'md' (900px), ativamos o modo Mobile
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

  // ==========================================================================
  // RENDERIZAÇÃO MOBILE (CARDS)
  // ==========================================================================
  if (isMobile) {
    return (
      <Stack spacing={2}>
        {aderidos.map((aderido) => (
          <Card key={aderido.id} variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              {/* Topo do Card: Avatar, Nome e Status */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor:
                        aderido.status_cadastro === "ativo"
                          ? "primary.main"
                          : "grey.400",
                    }}
                  >
                    {aderido.nome ? aderido.nome.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={
                        aderido.status_cadastro === "ativo" ? "bold" : "normal"
                      }
                      color={aderido.nome ? "text.primary" : "text.disabled"}
                    >
                      {aderido.nome || "Não definido"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {aderido.email}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Fundo do Card: Cargo e Status */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <CargoChip cargo={aderido.cargo} />
                </Box>
                <StatusChip status={aderido.status_cadastro} />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO DESKTOP (TABELA)
  // ==========================================================================
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
              <strong>Titularidade (Comissão)</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Status do Cadastro</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {aderidos.map((aderido) => (
            <TableRow key={aderido.id} hover>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor:
                        aderido.status_cadastro === "ativo"
                          ? "primary.main"
                          : "grey.400",
                    }}
                  >
                    {aderido.nome ? aderido.nome.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                  <Typography
                    variant="body2"
                    fontWeight={
                      aderido.status_cadastro === "ativo" ? "bold" : "normal"
                    }
                    color={aderido.nome ? "text.primary" : "text.disabled"}
                  >
                    {aderido.nome || "Não definido"}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{aderido.email}</Typography>
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
