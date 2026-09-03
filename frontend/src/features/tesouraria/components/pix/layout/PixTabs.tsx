import { useTesourariaLayout } from "../../../hooks/useTesourariaLayout";

import { PixTabsDesktop } from "./PixTabsDesktop";
import { PixTabsMobile } from "./PixTabsMobile";
import { PixTabsProps } from "./pixTabsTypes";

export function PixTabs(props: PixTabsProps) {
  const { isMobile } = useTesourariaLayout();

  return isMobile ? (
    <PixTabsMobile {...props} />
  ) : (
    <PixTabsDesktop {...props} />
  );
}
