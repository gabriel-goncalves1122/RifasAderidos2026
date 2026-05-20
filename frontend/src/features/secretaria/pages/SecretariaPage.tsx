// ============================================================================
// ARQUIVO: frontend/src/features/secretaria/pages/SecretariaPage.tsx
// ============================================================================
import { useEffect, useState } from "react";
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

import GroupIcon from "@mui/icons-material/Group";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { SecretariaHeader } from "../components/SecretariaHeader";
import { ModalAdicionarAderido } from "../components/ModalAdicionarAderido";
import { ListaAderidos } from "../components/ListaAderidos";
import { ResumoSecretariaCards } from "../components/ResumoSecretariaCards";
import { ModalDetalhesAderido } from "../components/ModalDetalhesAderido";

import { filtrarAderidos } from "../utils/filtrarAderidos";
import { calcularResumoSecretaria } from "../utils/calcularResumoSecretaria";

import { useSecretaria } from "../hooks/useSecretaria";
import {
  AderidoSecretaria,
  FiltroTipoUsuario,
  FormNovoAderido,
  ModalidadeAdesao,
  StatusCadastro,
} from "../../../shared/types/secretaria";

export function SecretariaView() {
  const { aderidos, loading, carregarAderidos, adicionarAderidoIndividual } =
    useSecretaria();

  const [modalAberto, setModalAberto] = useState(false);
  const [aderidoSelecionado, setAderidoSelecionado] =
    useState<AderidoSecretaria | null>(null);

  const [busca, setBusca] = useState("");

  const [filtroModalidade, setFiltroModalidade] = useState<
    "todos" | ModalidadeAdesao
  >("todos");

  const [filtroStatus, setFiltroStatus] = useState<"todos" | StatusCadastro>(
    "todos",
  );

  const [filtroTipoUsuario, setFiltroTipoUsuario] =
    useState<FiltroTipoUsuario>("todos");

  useEffect(() => {
    carregarAderidos().catch(() => {
      alert("Erro ao carregar lista de aderidos.");
    });
  }, [carregarAderidos]);

  const handleConfirmarNovoAderido = async (dados: FormNovoAderido) => {
    try {
      await adicionarAderidoIndividual(dados);

      alert(
        dados.modalidade_adesao === "meio"
          ? "Meio-aderido autorizado com sucesso!"
          : "Aderido autorizado com sucesso!",
      );
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    }
  };

  const resumo = calcularResumoSecretaria(aderidos);

  const aderidosFiltrados = filtrarAderidos(aderidos, {
    busca,
    modalidade: filtroModalidade,
    status: filtroStatus,
    tipoUsuario: filtroTipoUsuario,
  });

  return (
    <Box sx={{ pb: 5 }}>
      <SecretariaHeader />

      <ResumoSecretariaCards resumo={resumo} />

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
          Nova Adesão
        </Button>
      </Box>

      <Paper
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 2,
          border: "1px solid #e0e0e0",
        }}
      >
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

          <Box sx={{ flex: "1 1 220px" }}>
            <FormControl fullWidth>
              <InputLabel>Modalidade</InputLabel>
              <Select
                value={filtroModalidade}
                label="Modalidade"
                onChange={(e) =>
                  setFiltroModalidade(
                    e.target.value as "todos" | ModalidadeAdesao,
                  )
                }
                startAdornment={
                  <InputAdornment position="start">
                    <AssignmentIndIcon
                      sx={{ ml: 1, mr: -1 }}
                      color="action"
                      fontSize="small"
                    />
                  </InputAdornment>
                }
              >
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="completo">Aderido</MenuItem>
                <MenuItem value="meio">Meio-aderido</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 220px" }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filtroStatus}
                label="Status"
                onChange={(e) =>
                  setFiltroStatus(e.target.value as "todos" | StatusCadastro)
                }
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
                <MenuItem value="inativo">Inativos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: "1 1 220px" }}>
            <FormControl fullWidth>
              <InputLabel>Tipo de usuário</InputLabel>
              <Select
                value={filtroTipoUsuario}
                label="Tipo de usuário"
                onChange={(e) =>
                  setFiltroTipoUsuario(e.target.value as FiltroTipoUsuario)
                }
                startAdornment={
                  <InputAdornment position="start">
                    <ManageAccountsIcon
                      sx={{ ml: 1, mr: -1 }}
                      color="action"
                      fontSize="small"
                    />
                  </InputAdornment>
                }
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="aderidos">Aderidos</MenuItem>
                <MenuItem value="comissao">Comissão</MenuItem>
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
          <ListaAderidos
            aderidos={aderidosFiltrados}
            onSelecionarAderido={setAderidoSelecionado}
          />
        )}
      </Paper>

      <ModalAdicionarAderido
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={handleConfirmarNovoAderido}
      />

      <ModalDetalhesAderido
        open={!!aderidoSelecionado}
        aderido={aderidoSelecionado}
        onClose={() => setAderidoSelecionado(null)}
        onAtualizado={async () => {
          // O modal só precisa disparar a atualização; a lista retornada fica sob controle do hook.
          await carregarAderidos();
        }}
      />
    </Box>
  );
}
