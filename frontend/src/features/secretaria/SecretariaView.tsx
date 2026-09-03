import { DocumentosSecretariaView } from "./documentos/DocumentosSecretariaView";
import { MembrosSecretariaView } from "./membros/MembrosSecretariaView";

interface SecretariaViewProps {
  abaAtual: number;
}

export function SecretariaView({ abaAtual }: SecretariaViewProps) {
  return abaAtual === 1 ? (
    <DocumentosSecretariaView />
  ) : (
    <MembrosSecretariaView />
  );
}
