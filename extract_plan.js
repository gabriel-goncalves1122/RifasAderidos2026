const fs = require('fs');
const lines = fs.readFileSync('/home/gabriel/.gemini/antigravity/brain/ffd3c887-d416-418a-a16c-89cbd3c177b7/.system_generated/logs/transcript_full.jsonl', 'utf8').split('\n');
for (let i = lines.length - 1; i >= 0; i--) {
  if (!lines[i]) continue;
  try {
    const step = JSON.parse(lines[i]);
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === 'write_to_file' && call.args.TargetFile.includes('implementation_plan.md')) {
          if (call.args.CodeContent.includes('Fase 1') && call.args.CodeContent.includes('Fase 2')) {
            fs.writeFileSync('/home/gabriel/.gemini/antigravity/brain/ffd3c887-d416-418a-a16c-89cbd3c177b7/scratch/recovered_plan.md', call.args.CodeContent);
            console.log('Found it!');
            process.exit(0);
          }
        }
      }
    }
  } catch(e) {}
}
