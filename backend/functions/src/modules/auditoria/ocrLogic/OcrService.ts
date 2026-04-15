// ============================================================================
// ARQUIVO: backend/functions/src/modules/auditoria/ocrService.ts
// ============================================================================
import * as Papa from "papaparse";
import { ExtratorTextoService } from "./extratorTextoService";
import { RegrasBancosService } from "./regrasBancoService";

export class OcrService {
  /**
   * Orquestra a extração, regras de banco e cruzamento de dados com a InfinitePay.
   * REGRA ESTRITA: Apenas o Match perfeito do ID aprova a transação.
   */
  static async processarComprovante(
    urlArquivo: string,
    textoCsv: string,
  ): Promise<{ status: "APROVADO" | "DIVERGENTE" | "ERRO"; mensagem: string }> {
    try {
      // 1. Extração de Texto (Delega para o Extrator que sabe lidar com PDF e Imagens)
      const textoBruto = await ExtratorTextoService.extrair(urlArquivo);
      const textoImagemUpper = textoBruto.toUpperCase();

      // 2. Parsing do CSV da Tesouraria
      const extrato = Papa.parse(textoCsv, {
        header: true,
        skipEmptyLines: true,
      }).data as any[];
      if (!extrato || extrato.length === 0) {
        return {
          status: "ERRO",
          mensagem: "O ficheiro CSV está vazio ou inválido.",
        };
      }

      // 3. Aplicação das Regras Bancárias
      const bancoLido = RegrasBancosService.identificarBanco(textoImagemUpper);
      const idPixExtraido = RegrasBancosService.extrairIdPix(textoImagemUpper);
      const idPixLimpo = idPixExtraido
        ? RegrasBancosService.normalizarId(idPixExtraido)
        : null;

      // ======================================================================
      // TRAVA DE SEGURANÇA MÁXIMA: Recusa imediata se o ID não for lido
      // ======================================================================
      if (!idPixLimpo) {
        return {
          status: "DIVERGENTE",
          mensagem: `Banco [${bancoLido}] - ID ILEGÍVEL | lido Titular: DESCONHECIDO - Recusado: ID da transação ilegível ou ausente na imagem.`,
        };
      }

      // 4. Motor de Cruzamento de Dados (Matching Estrito)
      for (const linhaCsv of extrato) {
        const idCsvBruto = (
          linhaCsv["Identificador"] ||
          linhaCsv["ID_Transacao"] ||
          ""
        ).toString();
        const idCsvLimpo = RegrasBancosService.normalizarId(idCsvBruto);
        const nomeCsv = (linhaCsv["Origem - Nome"] || linhaCsv["NOME"] || "")
          .toString()
          .toUpperCase()
          .trim();

        // MATCH PERFEITO: O ID da imagem tem de ser EXATAMENTE igual ao ID do CSV
        if (idCsvLimpo && idPixLimpo === idCsvLimpo) {
          return {
            status: "APROVADO",
            mensagem: `Banco [${bancoLido}] - ID ${idPixLimpo} | lido Titular: ${nomeCsv} - Validado com sucesso pelo ID de transação.`,
          };
        }
      }

      // 5. Veredicto Final: O ID foi lido com nitidez, mas NÃO existe no CSV
      return {
        status: "DIVERGENTE",
        mensagem: `Banco [${bancoLido}] - ID ${idPixLimpo} | lido Titular: DESCONHECIDO - O ID lido não consta no extrato CSV carregado.`,
      };
    } catch (error: any) {
      console.error("[OcrService] Falha na orquestração:", error);
      return {
        status: "ERRO",
        mensagem: "Falha ao processar arquivo (Pode estar corrompido).",
      };
    }
  }
}
