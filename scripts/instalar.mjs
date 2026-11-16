// Instala tudo de que o Studio precisa: dependências, transcrição local e as skills gratuitas.
// Uso: npm run instalar   (ou: node scripts/instalar.mjs)
// Cada passo é independente: se um falhar, os outros continuam e o resumo final diz o que resolver.
import {spawnSync} from 'node:child_process';

const python = process.platform === 'win32' ? 'python' : 'python3';

// Antes de tudo: git e Node precisam existir e estar na versão certa.
const faltando = [];
if (spawnSync('git --version', {stdio: 'ignore', shell: true}).status !== 0) faltando.push('git');
const [maior, menor] = process.versions.node.split('.').map(Number);
// Os testes importam .ts direto no Node (a partir da 22.18); o projeto usa o Node 24.
if (maior < 22 || (maior === 22 && menor < 18)) {
  faltando.push(`Node 22.18 ou mais novo (você tem a ${process.versions.node}; o ideal é a 24)`);
}
if (faltando.length > 0) {
  console.log('Antes de instalar, falta resolver:');
  for (const f of faltando) console.log(`  - ${f}`);
  console.log('Instale ou atualize com winget (Windows): winget install Git.Git / winget upgrade OpenJS.NodeJS.LTS');
  console.log('ou com brew (Mac): brew install git / brew upgrade node.');
  console.log('Depois feche e abra o terminal (ou o app do Claude) e rode de novo.');
  process.exit(1);
}

const passos = [
  ['Dependências do Remotion', 'npm install --no-audit --no-fund'],
  ['Transcrição local (faster-whisper)', `${python} -m pip install faster-whisper`],
  ['Skill remotion-best-practices', 'npx -y skills add remotion-dev/skills -s remotion-best-practices -a claude-code -y'],
  // ponytail: falha aqui costuma ser "marketplace já cadastrado".
  ['Marketplace da skill watch', 'claude plugin marketplace add bradautomates/claude-video', true],
  // ponytail: opcional; sem o comando "claude" (só Claude Desktop) a watch é oferecida ao abrir a pasta.
  ['Skill watch', 'claude plugin install watch@claude-video', true],
];

const falhas = [];
const avisos = [];
for (const [nome, comando, opcional] of passos) {
  console.log(`\n==> ${nome}\n    ${comando}`);
  const r = spawnSync(comando, {stdio: 'inherit', shell: true});
  if (r.status !== 0) {
    if (!opcional) falhas.push(nome);
    else if (nome === 'Skill watch') avisos.push('Skill watch não instalou por aqui. Sem problema: ela é oferecida ao abrir a pasta no app (aceite), ou instale por Personalizar > Plugins.');
  }
}

for (const programa of ['ffmpeg -version', 'ffprobe -version']) {
  if (spawnSync(programa, {stdio: 'ignore', shell: true}).status !== 0) falhas.push(`${programa.split(' ')[0]} (instale pelo guia)`);
}

console.log('\n' + '='.repeat(60));
for (const a of avisos) console.log(`Aviso: ${a}`);
if (falhas.length === 0) {
  console.log('Tudo instalado. Abra uma sessão NOVA do Claude nesta pasta para as skills aparecerem.');
} else {
  console.log('Falhou:');
  for (const f of falhas) console.log(`  - ${f}`);
  console.log('Veja guias/1-primeiros-passos.md.');
}
process.exit(falhas.length === 0 ? 0 : 1);
