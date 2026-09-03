// ============================================================================
// TRATAMENTO DE ERROS DO PIX
//
// Funcoes para normalizar mensagens de erro do fluxo de checkout Pix
// antes de exibir ao usuario.
// ============================================================================

export function obterMensagemErroPix(error: unknown) {
  const mensagem = error instanceof Error ? error.message : "";

  if (/404|not found|não encontrado|nao encontrado/i.test(mensagem)) {
    return "Pagamento via Pix indisponivel no momento. O backend ainda nao respondeu a este contrato.";
  }

  return mensagem || "Nao foi possivel gerar o pagamento via Pix agora.";
}
