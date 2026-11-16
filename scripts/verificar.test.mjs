import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ignorado = (arquivo) =>
  spawnSync('git', ['check-ignore', '-q', arquivo], {cwd: raiz}).status;

test('faxina', () => {
  for (const f of [
    'guias/4-nivel-2-higgsfield.md',
    'tools/hf_api.py',
    'estilos',
    'src/estilos/MinimalSuico.tsx',
    'src/estilos/TerminalTecnico.tsx',
  ]) {
    assert.equal(fs.existsSync(path.join(raiz, f)), false, `${f} deveria ter sido apagado`);
  }
  const claude = fs.readFileSync(path.join(raiz, 'CLAUDE.md'), 'utf8');
  assert.doesNotMatch(claude, /higgsfield/i);
});

test('dados do cliente fora do git', () => {
  for (const f of ['minha-marca/ANALISE.md', 'projetos/001. teste/video/a.mp4', 'edicoes/001. teste/a.mp4', 'tmp/x']) {
    assert.equal(ignorado(f), 0, `${f} deveria estar no .gitignore`);
  }
  for (const f of ['.claude/skills/minha-marca/SKILL.md', '.claude/skills/video-curto/SKILL.md']) {
    assert.equal(ignorado(f), 1, `${f} não pode estar no .gitignore`);
  }
});

test('skill minha-marca', () => {
  const ler = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
  const skill = ler('.claude/skills/minha-marca/SKILL.md');
  const frente = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(frente, 'SKILL.md precisa de frontmatter');
  assert.match(frente[1], /^name: minha-marca$/m);
  const descricao = frente[1].slice(frente[1].indexOf('description:'));
  assert.ok(frente[1].includes('description:') && /Instagram/.test(descricao), 'description deve citar Instagram');

  const modelo = ler('guias/modelo-analise.md');
  const secoes = ['## Quem é', '## Links', '## Tom das legendas', '## O que mais engaja', '## Formatos', '## Visual', '## Frequência', '## Como os vídeos vão seguir este padrão'];
  let ultimo = -1;
  for (const s of secoes) {
    const i = modelo.indexOf(s);
    assert.ok(i > ultimo, `modelo-analise.md: "${s}" falta ou está fora de ordem`);
    ultimo = i;
  }

  const guia = ler('guias/minha-marca.md');
  for (const frase of ['nunca peça a senha', '12 posts', 'prints', 'quer seguir dessa maneira?']) {
    assert.ok(guia.includes(frase), `guias/minha-marca.md deve conter "${frase}"`);
  }
  assert.match(guia, /^## 0\. Achar a pasta do estúdio/m, 'guia deve começar achando o caminho completo da pasta do estúdio');
  assert.match(guia, /cd "<studio>" && node tools\/tema\.mjs "minha-marca\/tema\.json"/);
  assert.ok(guia.includes('<studio>/minha-marca/tema.json'), 'tema.json deve ser gravado pelo caminho completo');
  assert.ok(!guia.includes('fundo claro'), 'fundo é sempre escuro: o texto claro fica por cima dele');
});

test('video-curto', () => {
  const ler = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
  const guia = ler('guias/0-video-curto.md');
  for (const trecho of ['minha-marca/ANALISE.md', 'minha-marca/tema.json', 'tools/tem-fala.mjs', 'VerticalMontagem', 'duracaoMontagem', 'npm run render', 'música']) {
    assert.ok(guia.includes(trecho), `guias/0-video-curto.md deve conter "${trecho}"`);
  }
  const apagados = ['guias/2-nivel-1-remotion.md', 'guias/3-manual-remotion.md', 'guias/5-direcao-editorial.md'];
  for (const f of apagados) {
    assert.equal(fs.existsSync(path.join(raiz, f)), false, `${f} deveria ter sido apagado`);
  }
  for (const f of ['guias/0-video-curto.md', '.claude/skills/video-curto/SKILL.md', 'CLAUDE.md']) {
    const texto = ler(f);
    assert.doesNotMatch(texto, /2-nivel-1-remotion|3-manual|5-direcao/, `${f} não pode apontar para guia apagado`);
    assert.doesNotMatch(texto, /higgsfield|nível|horizontal/i, `${f} não pode citar Higgsfield, nível nem horizontal`);
  }
});

test('readme', () => {
  const ler = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
  const bloco = (f) => {
    const m = ler(f).match(/```text\r?\n([\s\S]*?)\r?\n```/);
    assert.ok(m, `${f} precisa de um bloco text com o prompt`);
    return m[1].replace(/\r\n/g, '\n');
  };
  const prompt = bloco('README.md');
  assert.equal(bloco('COMECE.md'), prompt, 'README.md e COMECE.md devem ter o mesmo prompt');
  for (const trecho of ['https://github.com/PedroGama24/studio.git', 'Edição de Vídeo', 'Documentos', 'OneDrive', 'INSTALAR.md', 'winget install Git.Git']) {
    assert.ok(prompt.includes(trecho), `o prompt deve conter "${trecho}"`);
  }
  assert.ok(prompt.split('\n').length <= 6, 'o prompt deve ser curto (no máximo 6 linhas)');
  assert.doesNotMatch(prompt, /C:\\dev|~\/dev/, 'o prompt não usa mais C:\\dev');
  const instalar = ler('INSTALAR.md');
  for (const trecho of ['--version', 'Python.Python.3.12', 'Gyan.FFmpeg', 'OpenJS.NodeJS.LTS', 'brew', 'git pull', 'npm run instalar', 'pintohome', '.claude/skills/minha-marca/SKILL.md', 'Edição de Vídeo']) {
    assert.ok(instalar.includes(trecho), `INSTALAR.md deve conter "${trecho}"`);
  }
  for (const f of ['README.md', 'COMECE.md', 'INSTALAR.md', 'guias/1-primeiros-passos.md', 'guias/minha-marca.md']) {
    assert.doesNotMatch(ler(f), /C:\\dev|~\/dev|pasta `?studio`?\b/, `${f} não pode mandar a pessoa para C:\\dev nem para a "pasta studio"`);
  }
  for (const f of ['README.md', 'COMECE.md']) assert.doesNotMatch(ler(f), /higgsfield|nível|hf\/|edit\.jsx/i, `${f} não pode citar Higgsfield, nível, hf/ nem edit.jsx`);
  const readme = ler('README.md');
  assert.ok(readme.includes('Macks Wendhell') && readme.includes('LICENSE'), 'README deve creditar Macks Wendhell e citar LICENSE');
  assert.doesNotMatch(ler('guias/1-primeiros-passos.md'), /higgsfield|nível/i, 'guia de instalação não pode citar Higgsfield nem nível');
});
