// ============================================================================

// ARQUIVO: backend/src/services/compacService.ts

// ============================================================================

import * as fs from "fs";

import * as path from "path";

import archiver from "archiver";

// Interface para o que o serviço espera receber

export interface DadosCompactacao {
  nomePacote: string;

  ficheirosRef: string[]; // Pode ser caminhos locais, URLs, ou IDs do banco

  // Adicione outros metadados necessários para a sua "conteinerização"
}

export class CompacService {
  /**

* Processa os ficheiros, prepara a estrutura conteinerizada e gera um ZIP.

* @param dados Dados enviados pelo Controller

* @returns O caminho (ou URL) do ficheiro compactado gerado

*/

  async gerarContainerCompactado(dados: DadosCompactacao): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        console.log(
          `[Service] Iniciando compactação do pacote: ${dados.nomePacote}`,
        );

        // 1. Define onde o ficheiro final vai ser guardado (ex: pasta /tmp ou /dist)

        const outputDir = path.join(__dirname, "../../tmp");

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFilePath = path.join(outputDir, `${dados.nomePacote}.zip`);

        const output = fs.createWriteStream(outputFilePath);

        // 2. Inicializa o Archiver (o motor de compressão)

        const archive = archiver("zip", {
          zlib: { level: 9 }, // Nível máximo de compressão
        });

        // Ouve eventos de conclusão ou erro

        output.on("close", () => {
          console.log(
            `[Service] Ficheiro gerado com ${archive.pointer()} bytes.`,
          );

          resolve(outputFilePath); // Retorna o caminho do ficheiro gerado
        });

        archive.on("error", (err: Error) => {
          console.error("[Service] Erro no Archiver:", err);

          reject(err);
        });

        // Liga o Archiver ao stream de saída (o ficheiro)

        archive.pipe(output);

        // 3. A LÓGICA DE CONTEINERIZAÇÃO

        // Aqui você adiciona os ficheiros reais que o utilizador pediu

        for (const ref of dados.ficheirosRef) {
          // Exemplo 1: Adicionar ficheiros que estão no disco

          // archive.file(caminhoAbsoluto, { name: nomeNoZip });

          // Exemplo 2: Criar ficheiros dinamicamente (ex: um Dockerfile ou JSON de config)

          if (ref === "config.json") {
            const configObj = {
              appName: dados.nomePacote,

              timestamp: new Date().toISOString(),
            };

            archive.append(JSON.stringify(configObj, null, 2), {
              name: "configuracao_container.json",
            });
          }
        }

        // Exemplo: Criando uma pasta obrigatória na raiz do zip

        archive.append("Este é um ficheiro gerado automaticamente.", {
          name: "logs/README.txt",
        });

        // 4. Finaliza a compressão

        archive.finalize();
      } catch (error) {
        console.error("[Service] Falha crítica na geração:", error);

        reject(error);
      }
    });
  }
}

// Exportamos uma instância pronta a usar

export const compacService = new CompacService();
