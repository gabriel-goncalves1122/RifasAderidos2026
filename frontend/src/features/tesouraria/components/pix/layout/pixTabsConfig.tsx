import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { AbaPix } from "../../../types/pixTabs";

export const ABAS_PIX: Array<{
  label: string;
  value: AbaPix;
  icon: React.ReactElement;
  descricao: string;
}> = [
  {
    label: "Visão geral",
    value: "visao-geral",
    icon: <AssessmentOutlinedIcon />,
    descricao: "Indicadores consolidados dos recebimentos Pix.",
  },
  {
    label: "Validar transações",
    value: "transacoes",
    icon: <ReceiptLongOutlinedIcon />,
    descricao: "Revise e valide cada Pix recebido.",
  },
  {
    label: "Vincular pagamentos",
    value: "conciliacao",
    icon: <LinkOutlinedIcon />,
    descricao: "Associe Pix a aderidos e rifas.",
  },
  {
    label: "Aderidos",
    value: "aderidos",
    icon: <GroupOutlinedIcon />,
    descricao: "Resumo de arrecadação por aderido.",
  },
];
