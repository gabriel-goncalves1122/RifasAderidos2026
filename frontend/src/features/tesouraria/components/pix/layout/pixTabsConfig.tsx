import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { AbaPix } from "../../../types/pixTabs";

export const ABAS_PIX: Array<{
  label: string;
  value: AbaPix;
  icon: React.ReactElement;
}> = [
  {
    label: "Visão geral",
    value: "visao-geral",
    icon: <AssessmentOutlinedIcon />,
  },
  {
    label: "Transações Pix",
    value: "transacoes",
    icon: <ReceiptLongOutlinedIcon />,
  },
  {
    label: "Conciliação",
    value: "conciliacao",
    icon: <LinkOutlinedIcon />,
  },
  {
    label: "Aderidos",
    value: "aderidos",
    icon: <GroupOutlinedIcon />,
  },
];
