import net from "node:net";

// Inclui portas auxiliares para detectar restos de uma execucao interrompida,
// nao apenas as APIs diretamente consumidas pelo aplicativo.
const PORTAS_EMULADORES = [
  { porta: 4000, servico: "UI" },
  { porta: 4400, servico: "Hub" },
  { porta: 4500, servico: "Logging" },
  { porta: 5001, servico: "Functions" },
  { porta: 8080, servico: "Firestore" },
  { porta: 9099, servico: "Auth" },
  { porta: 9150, servico: "Firestore WebSocket" },
  { porta: 9199, servico: "Storage" },
];

function portaEstaOcupada(porta) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: "127.0.0.1", port: porta });

    socket.setTimeout(500);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const resultados = await Promise.all(
  PORTAS_EMULADORES.map(async (item) => ({
    ...item,
    ocupada: await portaEstaOcupada(item.porta),
  })),
);
const ocupadas = resultados.filter((item) => item.ocupada);

if (ocupadas.length > 0) {
  console.error("[Emuladores] Nao foi possivel iniciar: portas ocupadas.");
  for (const item of ocupadas) {
    console.error(`- ${item.servico}: ${item.porta}`);
  }
  console.error(
    "Use `lsof -nP -iTCP:<porta> -sTCP:LISTEN` para identificar o processo.",
  );
  console.error(
    "Encerre a instancia anterior pelo terminal onde ela foi iniciada; nao mate processos desconhecidos.",
  );
  process.exitCode = 1;
} else {
  console.log("[Emuladores] Portas locais disponiveis.");
}
