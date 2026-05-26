// ============================================================================
// ARQUIVO: frontend/src/features/aderidos/hooks/usePainelAderido.ts
// ============================================================================
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useNotificacoes } from "@/shared/hooks/useNotificacoes";
import { useAuthController } from "@/features/auth/hooks/useAuthController";
import { useRifas } from "@/features/rifas/hooks/useRifas";

import {
  FiltroRifasAderido,
  NotificacaoAderido,
  RifaAderido,
  VisaoPainelAderido,
} from "../types/painelAderido";

import { agruparRifasRecusadas } from "../utils/agruparRifasRecusadas";
import {
  calcularValorArrecadado,
  contarNotificacoesNaoLidas,
  filtrarRifasPorStatus,
} from "../utils/calcularResumoRifas";
import { obterPrimeiroNomeAderido } from "../utils/obterPrimeiroNomeAderido";

interface DadosCorrecaoRecusa {
  nome: string;
  email: string;
  telefone: string;
}

export function usePainelAderido() {
  const { buscarMinhasRifas, corrigirRifasRecusadas } = useRifas();
  const { buscarNotificacoes, marcarNotificacoesLidas } = useNotificacoes();
  const { usuarioAtual, loading: authCarregando } = useAuthController();

  const [minhasRifas, setMinhasRifas] = useState<RifaAderido[]>([]);
  const [notificacoes, setNotificacoes] = useState<NotificacaoAderido[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [visaoAtual, setVisaoAtual] = useState<VisaoPainelAderido>("geral");
  const [filtro, setFiltro] = useState<FiltroRifasAderido>("todas");
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const [modalCheckoutAberto, setModalCheckoutAberto] = useState(false);
  const [drawerNotificacoesAberto, setDrawerNotificacoesAberto] =
    useState(false);
  const [modalCorrecaoAberto, setModalCorrecaoAberto] = useState(false);

  const [grupoParaCorrigir, setGrupoParaCorrigir] = useState<any>(null);
  const [rifaParaDetalhes, setRifaParaDetalhes] = useState<RifaAderido | null>(
    null,
  );

  // Mantém as funções externas sempre atualizadas sem fazer o useEffect
  // de carga depender diretamente delas.
  const buscarMinhasRifasRef = useRef(buscarMinhasRifas);
  const buscarNotificacoesRef = useRef(buscarNotificacoes);

  useEffect(() => {
    buscarMinhasRifasRef.current = buscarMinhasRifas;
  }, [buscarMinhasRifas]);

  useEffect(() => {
    buscarNotificacoesRef.current = buscarNotificacoes;
  }, [buscarNotificacoes]);

  // Evita chamadas paralelas e recargas automáticas repetidas para o mesmo usuário.
  const carregandoRef = useRef(false);
  const ultimoUsuarioCarregadoRef = useRef<string | null>(null);

  const carregarDadosIniciais = useCallback(async () => {
    if (carregandoRef.current) return;

    carregandoRef.current = true;
    setCarregando(true);

    try {
      const [dadosRifas, dadosNotificacoes] = await Promise.all([
        buscarMinhasRifasRef.current(),
        buscarNotificacoesRef.current(),
      ]);

      setMinhasRifas((dadosRifas || []) as RifaAderido[]);
      setNotificacoes((dadosNotificacoes || []) as NotificacaoAderido[]);
    } catch (erro) {
      console.error("[PainelAderido] Erro ao carregar dados iniciais:", erro);

      // Mantém a tela renderizável mesmo se a API/emulator estiver indisponível.
      setMinhasRifas([]);
      setNotificacoes([]);
    } finally {
      carregandoRef.current = false;
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    if (authCarregando) return;

    if (!usuarioAtual?.uid) {
      ultimoUsuarioCarregadoRef.current = null;
      setCarregando(false);
      setMinhasRifas([]);
      setNotificacoes([]);
      setSelecionadas([]);
      return;
    }

    // Carrega automaticamente uma única vez para cada usuário autenticado.
    if (ultimoUsuarioCarregadoRef.current === usuarioAtual.uid) return;

    ultimoUsuarioCarregadoRef.current = usuarioAtual.uid;
    carregarDadosIniciais();
  }, [authCarregando, usuarioAtual?.uid, carregarDadosIniciais]);

  const rifasFiltradas = useMemo(
    () => filtrarRifasPorStatus(minhasRifas, filtro),
    [minhasRifas, filtro],
  );

  const gruposRecusados = useMemo(
    () => agruparRifasRecusadas(minhasRifas),
    [minhasRifas],
  );

  const valorArrecadado = useMemo(
    () => calcularValorArrecadado(minhasRifas),
    [minhasRifas],
  );

  const notificacoesNaoLidas = useMemo(
    () => contarNotificacoesNaoLidas(notificacoes),
    [notificacoes],
  );

  const primeiroNome = useMemo(() => {
    const usuarioComNome = usuarioAtual as
      | {
          nome?: string | null;
          displayName?: string | null;
          email?: string | null;
        }
      | null
      | undefined;

    const primeiraRifaComVendedor = minhasRifas.find((rifa) =>
      Boolean(rifa.vendedor_nome?.trim()),
    );

    return obterPrimeiroNomeAderido({
      nome: usuarioComNome?.nome || primeiraRifaComVendedor?.vendedor_nome,
      displayName: usuarioComNome?.displayName,
      email: usuarioComNome?.email || primeiraRifaComVendedor?.vendedor_email,
    });
  }, [usuarioAtual, minhasRifas]);

  const abrirSidebarNotificacoes = async () => {
    setDrawerNotificacoesAberto(true);

    const naoLidas = notificacoes
      .filter((notificacao) => !notificacao.lida)
      .map((notificacao) => notificacao.id);

    if (naoLidas.length === 0) return;

    await marcarNotificacoesLidas(naoLidas);

    setNotificacoes((notificacoesAtuais) =>
      notificacoesAtuais.map((notificacao) => ({
        ...notificacao,
        lida: true,
      })),
    );
  };

  const alternarSelecaoRifa = (numero: string, status: string) => {
    if (status !== "disponivel") return;

    setSelecionadas((rifasAtuais) =>
      rifasAtuais.includes(numero)
        ? rifasAtuais.filter((rifa) => rifa !== numero)
        : [...rifasAtuais, numero],
    );
  };

  const finalizarVendaComSucesso = async () => {
    setModalCheckoutAberto(false);
    setSelecionadas([]);

    // Recarga intencional após alteração dos dados.
    await carregarDadosIniciais();
  };

  const reenviarComprovanteRecusado = async (
    numeros: string[],
    novoComprovante: File,
    dadosAtualizados: DadosCorrecaoRecusa,
  ) => {
    const sucesso = await corrigirRifasRecusadas(
      numeros,
      novoComprovante,
      dadosAtualizados,
    );

    if (!sucesso) return;

    await carregarDadosIniciais();

    setVisaoAtual("geral");
    setModalCorrecaoAberto(false);
    setGrupoParaCorrigir(null);
  };

  return {
    carregando,
    visaoAtual,
    filtro,
    selecionadas,

    minhasRifas,
    rifasFiltradas,
    gruposRecusados,
    notificacoes,

    primeiroNome,
    valorArrecadado,
    notificacoesNaoLidas,

    modalCheckoutAberto,
    drawerNotificacoesAberto,
    modalCorrecaoAberto,
    grupoParaCorrigir,
    rifaParaDetalhes,

    setFiltro,
    setVisaoAtual,
    setModalCheckoutAberto,
    setDrawerNotificacoesAberto,
    setModalCorrecaoAberto,
    setGrupoParaCorrigir,
    setRifaParaDetalhes,

    abrirSidebarNotificacoes,
    alternarSelecaoRifa,
    finalizarVendaComSucesso,
    reenviarComprovanteRecusado,
  };
}
