// ============================================================================
// ARQUIVO: frontend/src/views/pages/SecretariaView.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

// Ícones
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

// Componentes Modularizados
import { SecretariaHeader } from "../components/secretaria/SecretariaHeader";
import { ImportacaoCard } from "../components/secretaria/ImportacaoCard";
import { CargoChip } from "../components/secretaria/CargoChip";
import { StatusChip } from "../components/secretaria/StatusChip";

// Controllers
import { useSecretaria } from "../../controllers/useSecretaria";

// ============================================================================
// TIPAGEM
// ============================================================================
export interface Aderido {
  id: string;
  email: string;
  nome?: string;
  cargo?: string | null;
  status_cadastro: "ativo" | "pendente";
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export function SecretariaView() {
  const { buscarAderidos } = useSecretaria();
  const [aderidos, setAderidos] = useState<Aderido[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos"); // 'todos', 'ativo', 'pendente'
  const [filtroCategoria, setFiltroCategoria] = useState("todos"); // 'todos', 'comissao'

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      try {
        const dados = await buscarAderidos();
        setAderidos(dados);
      } catch (error) {
        alert("Erro ao carregar lista de aderidos.");
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  const handleInjetarAderidos = () => {
    alert("A injeção do CSV será conectada ao useSecretaria na próxima fase!");
  };

  // ==========================================================================
  // MOTOR DE BUSCA E FILTRAGEM
  // ==========================================================================
  const aderidosFiltrados = aderidos.filter((a) => {
    // 1. Filtro de Busca (Nome ou Email)
    const termo = busca.toLowerCase();
    const matchBusca =
      a.nome?.toLowerCase().includes(termo) ||
      a.email.toLowerCase().includes(termo);

    // 2. Filtro de Status
    const matchStatus =
      filtroStatus === "todos" ? true : a.status_cadastro === filtroStatus;

    // 3. Filtro de Categoria (Todos vs Apenas Comissão)
    const isComissao = [
      "admin",
      "presidencia",
      "tesouraria",
      "secretaria",
    ].includes(a.cargo || "");
    const matchCategoria = filtroCategoria === "todos" ? true : isComissao;

    return matchBusca && matchStatus && matchCategoria;
  });

  return (
    <Box sx={{ pb: 5 }}>
      <SecretariaHeader />

      <ImportacaoCard onImportar={handleInjetarAderidos} />

      {/* ÁREA DA LISTA E FILTROS */}
      <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #e0e0e0" }}>
        {/* BARRA DE PESQUISA E FILTROS */}
        {/* BARRA DE PESQUISA E FILTROS (Refatorado para Box em vez de Grid) */}
        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Campo de Pesquisa */}
          <Box sx={{ flex: "1 1 300px" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Pesquisar por nome ou e-mail..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Filtro de Categoria */}
          <Box sx={{ flex: "1 1 200px" }}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filtroCategoria}
                label="Categoria"
                onChange={(e) => setFiltroCategoria(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <GroupIcon
                      sx={{ ml: 1, mr: -1 }}
                      color="action"
                      fontSize="small"
                    />
                  </InputAdornment>
                }
              >
                <MenuItem value="todos">Todos (Aderidos e Comissão)</MenuItem>
                <MenuItem value="comissao">Apenas Comissão</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Filtro de Status */}
          <Box sx={{ flex: "1 1 200px" }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filtroStatus}
                label="Status"
                onChange={(e) => setFiltroStatus(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon
                      sx={{ ml: 1, mr: -1 }}
                      color="action"
                      fontSize="small"
                    />
                  </InputAdornment>
                }
              >
                <MenuItem value="todos">Qualquer Status</MenuItem>
                <MenuItem value="ativo">Contas Ativas</MenuItem>
                <MenuItem value="pendente">Pendentes (Só E-mail)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* TÍTULO DA TABELA DINÂMICO */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <GroupIcon color="action" />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Resultados Encontrados ({aderidosFiltrados.length})
          </Typography>
        </Box>

        {/* TABELA DE DADOS */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                {aderidosFiltrados.map((aderido) => (
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
                          {aderido.nome
                            ? aderido.nome.charAt(0).toUpperCase()
                            : "-"}
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={
                            aderido.status_cadastro === "ativo"
                              ? "bold"
                              : "normal"
                          }
                          color={
                            aderido.nome ? "text.primary" : "text.disabled"
                          }
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

                {/* MENSAGEM VAZIA */}
                {aderidosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Nenhum resultado encontrado.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tente alterar os termos da pesquisa ou limpar os
                        filtros.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
