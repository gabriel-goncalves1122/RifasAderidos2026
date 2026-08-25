const fs = require('fs');
// Let's check firebase-debug.log for webhook calls
const lines = fs.readFileSync('/home/gabriel/Documentos/UNIFEI/COMISSÃO/sistema-rifas/firebase-debug.log', 'utf8').split('\n').slice(-500);
const webhookLogs = lines.filter(l => l.includes('webhook') || l.includes('aprovarOuRejeitarPixNoFirestore'));
console.log(webhookLogs.join('\n'));
