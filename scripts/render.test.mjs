import {test} from 'node:test';
import assert from 'node:assert/strict';

const {lerArgs} = await import('../tools/render.mjs');
const {glPadrao} = await import('../tools/render-blocos.mjs');

test('lerArgs devolve composição e saída', () => {
  assert.deepEqual(lerArgs(['VideoX', 'edicoes/001. tatuagem do joão/final.mp4']), {
    composicao: 'VideoX',
    saida: 'edicoes/001. tatuagem do joão/final.mp4',
  });
});

test('lerArgs sem argumentos mostra como usar', () => {
  assert.throws(() => lerArgs([]), /npm run render --/);
  assert.throws(() => lerArgs(['VideoX']), /npm run render --/);
});

test('glPadrao: placa de vídeo só no Windows, RENDER_GL manda', () => {
  assert.equal(glPadrao('win32', {}), 'angle');
  assert.equal(glPadrao('darwin', {}), null);
  assert.equal(glPadrao('darwin', {RENDER_GL: 'angle'}), 'angle');
  assert.equal(glPadrao('win32', {RENDER_GL: 'software'}), null);
});
