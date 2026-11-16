import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {temFala} from '../tools/tem-fala.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const palavras = (n, duracao) => Array.from({length: n}, (_, i) => ({w: 'oi', s: (i * duracao) / n, e: (i * duracao) / n + 0.2}));

test('sem palavras: sem fala', () => {
  assert.equal(temFala([], 20), false);
});

test('poucas palavras (5 em 20 s): sem fala', () => {
  assert.equal(temFala(palavras(5, 20), 20), false);
});

test('30 palavras em 30 s: fala', () => {
  assert.equal(temFala(palavras(30, 30), 30), true);
});

test('8 palavras em 40 s (0,2 por segundo): sem fala', () => {
  assert.equal(temFala(palavras(8, 40), 40), false);
});

test('limite: 8 palavras em 20 s (0,4 por segundo): fala', () => {
  assert.equal(temFala(palavras(8, 20), 20), true);
});

test('limite exato: 9 palavras em 30 s (0,3 por segundo): fala', () => {
  assert.equal(temFala(palavras(9, 30), 30), true);
});

test('linha de comando imprime fala ou sem-fala', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tem-fala-'));
  try {
    const arq = path.join(dir, 'palavras.json');
    fs.writeFileSync(arq, JSON.stringify(palavras(30, 30)));
    assert.equal(execFileSync('node', ['tools/tem-fala.mjs', arq, '30'], {encoding: 'utf8', cwd: raiz}).trim(), 'fala');
    fs.writeFileSync(arq, '[]');
    assert.equal(execFileSync('node', ['tools/tem-fala.mjs', arq, '30'], {encoding: 'utf8', cwd: raiz}).trim(), 'sem-fala');
  } finally {
    fs.rmSync(dir, {recursive: true, force: true});
  }
});

test('arquivo que não existe: mensagem amigável e saída 1', () => {
  const r = spawnSync('node', ['tools/tem-fala.mjs', 'nao-existe.json', '30'], {encoding: 'utf8', cwd: raiz});
  assert.equal(r.status, 1);
  assert.match(r.stdout, /Não consegui ler/);
});

test('sem argumentos: explica o uso e sai com 1', () => {
  const r = spawnSync('node', ['tools/tem-fala.mjs'], {encoding: 'utf8', cwd: raiz});
  assert.equal(r.status, 1);
  assert.match(r.stdout, /node tools\/tem-fala\.mjs/);
});
