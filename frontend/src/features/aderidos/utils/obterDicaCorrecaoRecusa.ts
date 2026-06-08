export function obterDicaCorrecaoRecusa(motivo?: string | null) {
  const motivoNormalizado = (motivo || "").toLowerCase();

  if (/e-?mail|email/.test(motivoNormalizado)) {
    return "Use um e-mail completo, como seu@email.com.";
  }

  if (/telefone|whats|celular/.test(motivoNormalizado)) {
    return "Confira DDD e número do WhatsApp antes de reenviar.";
  }

  if (/nome|comprador/.test(motivoNormalizado)) {
    return "Use o nome completo do comprador, sem abreviações.";
  }

  if (/documento|cpf/.test(motivoNormalizado)) {
    return "Confira se os dados informados batem com o comprador.";
  }

  return "Revise os dados preenchidos e reenvie somente quando estiverem corretos.";
}
