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
});
