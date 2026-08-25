import fs from 'fs';
import path from 'path';

function getFiles(dir) {
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  const files = dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  });
  return Array.prototype.concat(...files);
}

const allFiles = [...getFiles('frontend/src/features'), ...getFiles('frontend/tests')];
const tsFiles = allFiles.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

let updatedCount = 0;

for (const file of tsFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  const importLayoutRegex = /import\s*\{\s*layout\s*\}\s*from\s*['"]([^'"]*styles\/layout)['"]/g;
  if (importLayoutRegex.test(content)) {
    content = content.replace(importLayoutRegex, 'import { layout } from "@/shared/tokens/layout"');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated layout in ${file}`);
  }
}

console.log(`\nSuccessfully updated ${updatedCount} files.`);
