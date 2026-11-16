import {test} from 'node:test';
import assert from 'node:assert/strict';
import {duracaoMontagem, quadrosDoClipe} from '../src/_shared/montagem.ts';

test('soma dos clipes com o mesmo arredondamento do componente', () => {
  // 0,37–2,11 s a 30 fps: 1,74 s = 52,2 -> 52 quadros; 0–1 s = 30 quadros
  assert.equal(duracaoMontagem([{de: 0.37, ate: 2.11}, {de: 0, ate: 1}], 30), 82);
});

test('sem clipes: no mínimo 1 quadro', () => {
  assert.equal(duracaoMontagem([], 30), 1);
});

test('janela do corte tem o mesmo tamanho da Sequence e ate <= de não zera', () => {
  const {inicio, duracao} = quadrosDoClipe({de: 0.37, ate: 2.11}, 30);
  assert.equal(inicio, 11);
  assert.equal(duracao, 52);
  assert.equal(quadrosDoClipe({de: 5, ate: 5}, 30).duracao, 1);
  assert.equal(quadrosDoClipe({de: 5, ate: 4}, 30).duracao, 1);
});
