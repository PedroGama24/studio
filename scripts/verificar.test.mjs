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
