import fs from "fs";
import path from "path";

const coverageFile = path.resolve("./coverage/coverage-final.json");

if (!fs.existsSync(coverageFile)) {
  console.log("coverage-final.json not found");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(coverageFile, "utf-8"));
const untestedFunctions = [];

for (const [filePath, fileData] of Object.entries(data)) {
  const fMap = fileData.fnMap;
  const fStats = fileData.f;
  
  if (!fMap || !fStats) continue;

  for (const [fnId, fnStats] of Object.entries(fStats)) {
    if (fnStats === 0) {
      const fnInfo = fMap[fnId];
      untestedFunctions.push({
        file: filePath.replace(process.cwd() + "/", ""),
        name: fnInfo.name || "<anonymous>",
        line: fnInfo.decl.start.line
      });
    }
  }
}

console.log(JSON.stringify(untestedFunctions, null, 2));
