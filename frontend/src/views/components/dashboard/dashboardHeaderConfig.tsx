// ============================================================================
// ARQUIVO: frontend/src/views/components/dashboard/dashboardHeaderConfig.tsx
// ============================================================================
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";

import { Contexto } from "@/views/pages/DashboardPage";

export interface DashboardTabConfig {
  label: string;
  icon: React.ReactElement;
}

export interface DashboardHeaderContextConfig {
  eyebrow: string;
  titulo: string;
  subtitulo: string;
  tabs: DashboardTabConfig[];
}

export const DASHBOARD_HEADER_CONFIG: Record<
  Contexto,
  DashboardHeaderContextConfig
> = {
  aderido: {
    eyebrow: "Portal do aderido",
    titulo: "Minhas rifas e prêmios",
    subtitulo: "Acompanhe suas vendas, pendências e informações do sorteio.",
    tabs: [
      {
        label: "Minhas Rifas",
        icon: <ConfirmationNumberOutlinedIcon />,
      },
      {
        label: "Prêmios",
        icon: <EmojiEventsOutlinedIcon />,
      },
    ],
  },

  tesouraria: {
    eyebrow: "Gestão financeira",
    titulo: "Gestão financeira da comissão",
    subtitulo:
      "Monitore transações Pix, conciliação com rifas e desempenho financeiro.",
    tabs: [
      {
        label: "Pix",
        icon: <AccountBalanceOutlinedIcon />,
      },
      {
        label: "Desempenho",
        icon: <AssessmentOutlinedIcon />,
      },
      {
        label: "Histórico",
        icon: <ReceiptLongOutlinedIcon />,
      },
    ],
  },

  secretaria: {
    eyebrow: "Secretaria",
    titulo: "Gestão de aderidos",
    subtitulo: "Gerencie cadastros, modalidades de adesão e permissões.",
    tabs: [
      {
        label: "Aderidos",
        icon: <GroupAddOutlinedIcon />,
      },
    ],
  },
};
