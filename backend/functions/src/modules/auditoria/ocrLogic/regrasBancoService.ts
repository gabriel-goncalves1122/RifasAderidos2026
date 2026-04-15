// ============================================================================
// ARQUIVO: backend/functions/src/modules/auditoria/regrasBancosService.ts
// ============================================================================

export class RegrasBancosService {
  /**
   * Identifica a instituição financeira com base no texto do comprovante
   */
  static identificarBanco(textoUpper: string): string {
    if (textoUpper.includes("C6") || textoUpper.includes("C6BANK"))
      return "C6 BANK";
    if (textoUpper.includes("NUBANK") || textoUpper.includes("NU PAGAMENTOS"))
      return "NUBANK";
    if (textoUpper.includes("ITAÚ") || textoUpper.includes("ITAU"))
      return "ITAU";
    if (textoUpper.includes("SICOOB") || textoUpper.includes("BANCOOB"))
      return "SICOOB";
    if (textoUpper.includes("SANTANDER")) return "SANTANDER";
    if (
      textoUpper.includes("MERCADO PAGO") ||
      textoUpper.includes("MERCADOPAGO")
    )
      return "MERCADO PAGO";
    if (textoUpper.includes("PICPAY")) return "PICPAY";
    if (textoUpper.includes("BANCO DO BRASIL") || textoUpper.includes(" BB "))
      return "BANCO DO BRASIL";
    if (textoUpper.includes("CAIXA") || textoUpper.includes("CEF"))
      return "CAIXA";
    if (textoUpper.includes("INTER")) return "INTER";
    if (textoUpper.includes("BRADESCO")) return "BRADESCO";
    if (textoUpper.includes("99PAY")) return "99PAY";
    return "DESCONHECIDO";
  }

  /**
   * Limpeza brutal para garantir o Match perfeito entre o Tesseract e o CSV.
   */
  static normalizarId(idString: string): string {
    if (!idString) return "";
    return idString
      .trim()
      .toUpperCase()
      .replace(/[O]/g, "0")
      .replace(/[I]/g, "1")
      .replace(/[L]/g, "1");
  }

  /**
   * Destrói caracteres invisíveis, mantendo apenas Letras, Números e símbolos comuns
   */
  private static faxinaExtrema(texto: string): string {
    return texto.replace(/[^a-zA-Z0-9£€]/g, "");
  }

  /**
   * Caça o ID usando a Regra de Ouro do Banco Central (A Máquina do Tempo)
   */
  static extrairIdPix(textoBruto: string): string | null {
    const textoLimpo = this.faxinaExtrema(textoBruto);

    // Procura por um E (ou £/€) seguido de 31 caracteres alfanuméricos
    const regex = /[E£€][a-zA-Z0-9]{31}/g;
    const candidatos = textoLimpo.match(regex);

    if (!candidatos) return null;

    for (let candidato of candidatos) {
      candidato = candidato.replace(/^[£€]/, "E");

      // O ID do PIX tem a data a partir da posição 9. Ex: E12345678 2026 ...
      let trechoAno = candidato
        .substring(9, 13)
        .replace(/[Oo]/g, "0")
        .replace(/[Il]/g, "1");

      // Verifica se o ano bate (década de 202X)
      if (trechoAno.startsWith("202")) {
        return candidato;
      }
    }
    return null;
  }
}
