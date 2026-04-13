// ============================================================================
// ARQUIVO: backend/functions/src/modules/admin/compacController.ts
// ============================================================================
import { Request, Response } from "express";
import { compacService, DadosCompactacao } from "./compacService";
import * as fs from "fs";

export const compacController = {
  /**
   * Recebe o pedido HTTP, aciona o Service para gerar o ZIP e envia o ficheiro ao cliente.
   */
  async compactarArquivos(req: Request, res: Response): Promise<any> {
    try {
      // Recebe os dados do Frontend (nomePacote e a lista de ficheiros)
      const { nomePacote, ficheiros } = req.body;

      // 1. Validação de Segurança Básica
      if (!nomePacote || !ficheiros || !Array.isArray(ficheiros)) {
        return res.status(400).json({
          error:
            "Dados inválidos. O payload deve conter 'nomePacote' e um array 'ficheiros'.",
        });
      }

      // 2. Montar o objeto para o Service
      const dadosParaProcessar: DadosCompactacao = {
        nomePacote: nomePacote,
        ficheirosRef: ficheiros,
      };

      // 3. O Operário trabalha (Chama o Service que cria o ZIP no disco)
      const caminhoFicheiroGerado =
        await compacService.gerarContainerCompactado(dadosParaProcessar);

      // 4. Enviar o ficheiro para o navegador do utilizador
      return res.download(
        caminhoFicheiroGerado,
        `${nomePacote}.zip`,
        (err: any) => {
          if (err) {
            console.error(
              "[Controller] Erro ao enviar ficheiro ao cliente:",
              err,
            );
            if (!res.headersSent) {
              res
                .status(500)
                .json({ error: "Falha na transferência do ficheiro gerado." });
            }
            // Garante que sai da função caso dê erro na resposta
            return;
          }

          // 5. Limpeza do Servidor: Apaga o ficheiro ZIP logo após o download terminar
          fs.unlink(caminhoFicheiroGerado, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                "[Controller] Erro ao limpar o ficheiro temporário:",
                unlinkErr,
              );
            } else {
              console.log(
                `[Controller] Ficheiro temporário removido: ${caminhoFicheiroGerado}`,
              );
            }
          });

          // Retorno explícito para satisfazer o TypeScript no caminho de sucesso do callback
          return;
        },
      );
    } catch (error) {
      console.error("[Controller] Falha ao processar compactação:", error);
      if (!res.headersSent) {
        return res.status(500).json({
          error: "Ocorreu um erro interno no servidor durante a compactação.",
        });
      }
    }
  },
};
