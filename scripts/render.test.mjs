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

test('memoriaPorChrome cabe na RAM da máquina', async () => {
  const {memoriaPorChrome} = await import('../tools/render-blocos.mjs');
  const GB = 1024 ** 3, MB = 1024 ** 2;
  const m40 = memoriaPorChrome(40 * GB, 4, {}), m16 = memoriaPorChrome(16 * GB, 4, {}), m8 = memoriaPorChrome(8 * GB, 2, {});
  assert.deepEqual(m40, {ot: 1536 * MB, media: 1024 * MB});
  for (const [m, ram, n] of [[m40, 40, 4], [m16, 16, 4], [m8, 8, 2]]) assert.ok((m.ot + m.media) * n <= ram * GB * 0.25 + 1, `${ram} GB`);
  assert.ok(m16.ot < m40.ot && m8.ot < m16.ot + 1);
  assert.ok(memoriaPorChrome(1 * GB, 4, {}).ot >= 128 * MB);
  assert.equal(memoriaPorChrome(8 * GB, 2, {RENDER_CACHE_OT_MB: '700'}).ot, 700 * MB);
});

test('chromesPadrao diminui com pouca RAM', async () => {
  const {chromesPadrao} = await import('../tools/render.mjs');
  const GB = 1024 ** 3;
  assert.equal(chromesPadrao(12, 40 * GB), 4);
  assert.equal(chromesPadrao(12, 16 * GB), 4);
  assert.equal(chromesPadrao(12, 8 * GB), 2);
  assert.equal(chromesPadrao(2, 4 * GB), 1);
});

test('limparRendersAntigos solta o link e preserva projetos/', async () => {
  const {limparRendersAntigos} = await import('../tools/render.mjs');
  const fs = await import('node:fs'), os = await import('node:os'), path = await import('node:path');
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'render-test-'));
  try {
    const projetos = path.join(base, 'projetos'), tmp = path.join(base, 'tmp');
    fs.mkdirSync(projetos); fs.writeFileSync(path.join(projetos, 'video.mp4'), 'x');
    const antigo = path.join(tmp, 'render-123', 'bundle');
    fs.mkdirSync(antigo, {recursive: true});
    fs.symlinkSync(projetos, path.join(antigo, 'public'), process.platform === 'win32' ? 'junction' : 'dir');
    fs.mkdirSync(path.join(tmp, 'outra-coisa'));
    limparRendersAntigos(tmp);
    assert.equal(fs.existsSync(path.join(tmp, 'render-123')), false);
    assert.equal(fs.existsSync(path.join(tmp, 'outra-coisa')), true);
    assert.equal(fs.readFileSync(path.join(projetos, 'video.mp4'), 'utf8'), 'x');
  } finally { fs.rmSync(base, {recursive: true, force: true}); }
});

test('limparRendersAntigos não mexe em render que ainda está rodando', async () => {
  const {limparRendersAntigos} = await import('../tools/render.mjs');
  const fs = await import('node:fs'), os = await import('node:os'), path = await import('node:path');
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'render-test-'));
  try {
    const projetos = path.join(base, 'projetos'), tmp = path.join(base, 'tmp');
    fs.mkdirSync(projetos); fs.writeFileSync(path.join(projetos, 'video.mp4'), 'x');
    const liga = pid => {
      const bundle = path.join(tmp, `render-${pid}`, 'bundle');
      fs.mkdirSync(bundle, {recursive: true});
      fs.symlinkSync(projetos, path.join(bundle, 'public'), process.platform === 'win32' ? 'junction' : 'dir');
    };
    const morto = 2 ** 22 + 12345; // acima do limite de PIDs em uso comum
    liga(process.pid); liga(morto);
    limparRendersAntigos(tmp);
    assert.equal(fs.existsSync(path.join(tmp, `render-${process.pid}`, 'bundle', 'public', 'video.mp4')), true, 'render vivo preservado');
    assert.equal(fs.existsSync(path.join(tmp, `render-${morto}`)), false, 'render morto apagado');
    assert.equal(fs.readFileSync(path.join(projetos, 'video.mp4'), 'utf8'), 'x');
  } finally {
    try { fs.unlinkSync(path.join(base, 'tmp', `render-${process.pid}`, 'bundle', 'public')); } catch {}
    fs.rmSync(base, {recursive: true, force: true});
  }
});
