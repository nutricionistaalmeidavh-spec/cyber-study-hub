import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'src/App.tsx',
  'src/types.ts',
  'src/components/Lessons.tsx',
  'src/components/Games.tsx',
  'src/components/Dashboard.tsx',
  'src/data/lessons.ts',
  'src/data/lessonDetails.ts',
  'src/lib/storage.ts',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'wrangler.toml'
];

const missing = requiredFiles.filter(file => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error('Baseline check FAILED');
  for (const file of missing) console.error(`- arquivo obrigatório ausente: ${file}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredRuntime = ['react', 'react-dom'];
const requiredDev = ['typescript', 'vite', 'wrangler'];

const errors = [];
for (const dep of requiredRuntime) {
  if (!pkg.dependencies?.[dep]) errors.push(`dependência runtime ausente: ${dep}`);
}
for (const dep of requiredDev) {
  if (!pkg.devDependencies?.[dep]) errors.push(`dependência dev ausente: ${dep}`);
}

if (errors.length) {
  console.error('Baseline check FAILED');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Baseline check OK — ${requiredFiles.length} superfícies obrigatórias encontradas; stack React/TypeScript/Vite/Wrangler preservado.`);
