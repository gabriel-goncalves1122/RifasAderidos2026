import { useTesourariaLayout } from "../../hooks/useTesourariaLayout";
import { TesourariaDesktop } from "./TesourariaDesktop";
import { TesourariaMobile } from "./TesourariaMobile";

export function TesourariaShell() {
  const { isMobile } = useTesourariaLayout();

  return isMobile ? <TesourariaMobile /> : <TesourariaDesktop />;
}
