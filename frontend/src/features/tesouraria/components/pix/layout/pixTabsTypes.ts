import { AbaPix } from "../../../types/pixTabs";

export interface PixTabsProps {
  abaAtual: AbaPix;
  onChangeAba: (aba: AbaPix) => void;
}
