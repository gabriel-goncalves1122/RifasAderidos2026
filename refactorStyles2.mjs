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

  const importTypographyRegex = /import\s*\{\s*typography\s*\}\s*from\s*['"]([^'"]*styles\/typography)['"]/g;
  if (importTypographyRegex.test(content)) {
    content = content.replace(importTypographyRegex, 'import { typographyScale as typography } from "@/shared/tokens/typography"');
    changed = true;
  }
  
  // also fix if the tests had the same issue for colors, components or surfaces
  const importColorsRegex = /import\s*\{\s*(secretariaColors|colors|aderidosColors)\s*\}\s*from\s*['"]([^'"]*styles\/colors)['"]/g;
  if (importColorsRegex.test(content)) {
    content = content.replace(importColorsRegex, 'import { colors } from "@/shared/tokens/colors"');
    changed = true;
  }
  const importComponentsRegex = /import\s*\{\s*(secretariaComponents|components|painelAderidoComponentStyles)\s*\}\s*from\s*['"]([^'"]*styles\/components)['"]/g;
  if (importComponentsRegex.test(content)) {
    content = content.replace(importComponentsRegex, 'import { components } from "@/shared/tokens/components"');
    changed = true;
  }
  const importSurfacesRegex = /import\s*\{\s*(secretariaSurfaces|surfaces|painelAderidoSurfaceStyles|aderidosSurfaces)\s*\}\s*from\s*['"]([^'"]*styles\/surfaces)['"]/g;
  if (importSurfacesRegex.test(content)) {
    content = content.replace(importSurfacesRegex, 'import { surfaces } from "@/shared/tokens/surfaces"');
    changed = true;
  }

  // E corrigir usages
  const replaceRefs = [
    { from: /secretariaColors\./g, to: 'colors.' },
    { from: /aderidosColors\.greenDark/g, to: 'colors.verdeEscuro' },
    { from: /aderidosColors\.greenBlack/g, to: 'colors.pretoEsverdeado' },
    { from: /aderidosColors\.greenAccent/g, to: 'colors.verdeAccent' },
    { from: /aderidosColors\.greenBright/g, to: 'colors.verdeForte' },
    { from: /aderidosColors\.textMuted/g, to: 'colors.cinzaTexto' },
    { from: /aderidosColors\.background/g, to: 'colors.fundoSuave' },
    { from: /aderidosColors\.greenSoft/g, to: 'colors.verdeClaro' },
    { from: /aderidosColors\.white/g, to: 'colors.branco' },
    { from: /aderidosColors\.warningSoft/g, to: 'colors.alertaFundo' },
    { from: /aderidosColors\.warningStrong/g, to: 'colors.alertaTextoForte' },
    { from: /aderidosColors\.errorSoft/g, to: 'colors.erroFundo' },
    { from: /aderidosColors\.errorStrong/g, to: 'colors.erroForte' },
    { from: /aderidosColors\.errorBorder/g, to: 'colors.erroBorda' },
    { from: /aderidosColors\./g, to: 'colors.' },
    { from: /secretariaComponents\./g, to: 'components.' },
    { from: /painelAderidoComponentStyles\./g, to: 'components.' },
    { from: /secretariaSurfaces\./g, to: 'surfaces.' },
    { from: /painelAderidoSurfaceStyles\./g, to: 'surfaces.' },
  ];

  for (const ref of replaceRefs) {
    if (ref.from.test(content)) {
      content = content.replace(ref.from, ref.to);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    updatedCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`\nSuccessfully updated ${updatedCount} files.`);
