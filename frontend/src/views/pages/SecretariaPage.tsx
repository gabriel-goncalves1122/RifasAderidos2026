// ============================================================================
// ARQUIVO: frontend/src/views/pages/SecretariaPage.tsx
// ============================================================================
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

// Ícones
import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

// Componentes Modularizados
import { SecretariaHeader } from "../components/secretaria/SecretariaHeader";
import { ModalAdicionarAderido } from "../components/secretaria/ModalAdicionarAderido";
import { ListaAderidos } from "../components/secretaria/ListaAderidos";

// Controllers
import { useSecretaria } from "../../controllers/useSecretaria";

export interface Aderido {
  id: string;
  email: string;
  nome?: string;
  cargo?: string | null;
  status_cadastro: "ativo" | "pendente";
}

export function SecretariaView() {
  const { buscarAderidos, adicionarAderidoIndividual } = useSecretaria();
  const [aderidos, setAderidos] = useState<Aderido[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");

  const carregarLista = async () => {
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

  useEffect(() => {
    carregarLista();
  }, []);

  const handleConfirmarNovoAderido = async (dados: any) => {
    try {
      await adicionarAderidoIndividual(dados);
      alert("Aderido autorizado e bilhetes gerados com sucesso!");
      await carregarLista();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const aderidosFiltrados = aderidos.filter((a) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      a.nome?.toLowerCase().includes(termo) ||
      a.email.toLowerCase().includes(termo);
    const matchStatus =
      filtroStatus === "todos" ? true : a.status_cadastro === filtroStatus;

    const isComissao = !!a.cargo && a.cargo.toLowerCase() !== "aderido";
    const matchCategoria = filtroCategoria === "todos" ? true : isComissao;

    return matchBusca && matchStatus && matchCategoria;
  });

  return (
    <Box sx={{ pb: 5 }}>
      <SecretariaHeader />

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddIcon />}
          onClick={() => setModalAberto(true)}
          sx={{
            borderRadius: 2,
            px: { xs: 2, sm: 4 },
            py: 1.2,
            fontWeight: "bold",
          }}
        >
          Novo Membro
        </Button>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: "1px solid #e0e0e0",
        }}
      >
        {/* FILTROS RESPONSIVOS */}
        <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 100%" }}>
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

          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
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
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="comissao">Só Comissão</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 calc(50% - 8px)" }}>
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
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="ativo">Ativos</MenuItem>
                <MenuItem value="pendente">Pendentes</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <GroupIcon color="action" />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Resultados ({aderidosFiltrados.length})
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          /* COMPONENTE DE LISTA INTELIGENTE (Tabela no PC, Cards no Telemóvel) */
          <ListaAderidos aderidos={aderidosFiltrados} />
        )}
      </Paper>

      <ModalAdicionarAderido
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleConfirmarNovoAderido}
      />
    </Box>
  );
}
