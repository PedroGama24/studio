// Render em blocos com cache: a imagem do vídeo é dividida em blocos de ~10 s numa grade fixa
// (quadro 0, 300, 600…). Cada bloco pronto fica guardado em tmp/cache-render/ com uma chave do
// que aparece nele; o próximo render reaproveita os blocos cuja chave não mudou e só desenha os
// outros. Os blocos vão para uma fila e cada Chrome pega o próximo livre (antes cada Chrome tinha
// um pedaço fixo e o que pegava as cenas pesadas atrasava todos). Juntados sem recodificar.
// Também retoma um render interrompido: os blocos já feitos ficam no cache.
// RENDER_CACHE=0 desliga o cache; RENDER_CACHE_GB (padrão 20) limita o tamanho da pasta.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync, spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const CACHE_DIR = path.join(ROOT, 'tmp', 'cache-render');
export const BLOCO = 300;
const VERSAO = 1;

// Placa de vídeo no Chrome (ANGLE sobre Direct3D 11): deixa o render bem mais rápido no Windows, com a imagem igual
// a olho. Fora do Windows fica desligada. Um bloco que falhar com a placa é refeito num Chrome sem ela.
// RENDER_GL=software desliga a placa em qualquer sistema; RENDER_GL=angle (ou vulkan) liga um modo específico.
export const glPadrao = (plataforma, env) => (env.RENDER_GL === 'software' ? null : env.RENDER_GL || (plataforma === 'win32' ? 'angle' : null));
export const GL = glPadrao(process.platform, process.env);
// Os blocos são intermediários: veryfast deu +10% de velocidade e arquivo até menor no mesmo crf.
export const X264_PRESET = process.env.RENDER_X264_PRESET || 'veryfast';
const chromium = gl => (gl ? {gl} : {});
/** Abre um Chrome de render com a placa de vídeo (ou sem, com RENDER_GL=software). */
export const abrirChrome = (openBrowser, gl = GL) => openBrowser('chrome', {logLevel: 'error', chromiumOptions: chromium(gl)});

export const hash = valor => createHash('sha256').update(typeof valor === 'string' ? valor : JSON.stringify(valor)).digest('hex');

/** Hash do conteúdo de arquivos e pastas (recursivo), relativo à raiz do Studio. */
export function hashFontes(caminhos, raiz = ROOT) {
  const h = createHash('sha256');
  const visita = rel => {
    const abs = path.join(raiz, rel);
    if (!fs.existsSync(abs)) return;
    if (fs.statSync(abs).isDirectory()) for (const nome of fs.readdirSync(abs).sort()) visita(path.posix.join(rel, nome));
    else h.update(rel).update(fs.readFileSync(abs));
  };
  caminhos.forEach(visita);
  return h.digest('hex');
}

// Cache do OffthreadVideo e da mídia, por Chrome (o padrão do Remotion é metade da RAM livre PARA CADA UM e esgotou
// 40 GB com 6 Chromes lendo 4K60). Usa ~25% da RAM, dividida entre os Chromes: 60% para o OffthreadVideo (até 1,5 GB)
// e 40% para a mídia (até 1 GB), com piso. Não muda a imagem. `RENDER_CACHE_OT_MB` sobrepõe o do OffthreadVideo.
const MB = 1024 ** 2;
export function memoriaPorChrome(totalmem, chromes, env = process.env) {
  const parte = (totalmem * 0.25) / Math.max(1, chromes);
  const ot = env.RENDER_CACHE_OT_MB ? Number(env.RENDER_CACHE_OT_MB) * MB : Math.max(128 * MB, Math.min(1536 * MB, Math.floor(parte * 0.6)));
  const media = Math.max(64 * MB, Math.min(1024 * MB, Math.floor(parte * 0.4)));
  return {ot, media};
}

/** Blocos da grade fixa em [de, ate) com o arquivo de cache de cada um e se já existe. */
export function planejarBlocos({de, ate, bloco = BLOCO, global, chave}) {
  const blocos = [];
  for (let a = de; a < ate; a = (Math.floor(a / bloco) + 1) * bloco) {
    const b = Math.min(ate, (Math.floor(a / bloco) + 1) * bloco) - 1;
    const id = hash({VERSAO, global, motor: {gl: GL, x264: X264_PRESET}, a, b, conteudo: chave(a, b)});
    const arq = path.join(CACHE_DIR, `${id}.mp4`);
    blocos.push({a, b, arq, pronto: fs.existsSync(arq)});
  }
  return blocos;
}

/**
 * Vídeos acima de 30 fps, relativos a projetos/. Com a placa de vídeo ligada, o <Video> do @remotion/media
 * trava no 1º quadro desses arquivos (flashes de 60 fps do pack: 30 e 25 fps passam); a composição troca
 * só eles pelo <OffthreadVideo> (src/_shared/previa.tsx), que extrai com ffmpeg fora do Chrome.
 * O fps de cada arquivo fica em cache (caminho + tamanho + data).
 */
export function videosRapidos(arquivos, pastaProjetos = path.join(ROOT, 'projetos')) {
  const arqCache = path.join(CACHE_DIR, 'fps.json');
  const cache = fs.existsSync(arqCache) ? JSON.parse(fs.readFileSync(arqCache, 'utf8')) : {};
  const rapidos = [];
  for (const abs of [...new Set(arquivos)].sort()) {
    const st = fs.statSync(abs, {throwIfNoEntry: false});
    if (!st) continue;
    const chave = `${abs}|${st.size}|${st.mtimeMs}`;
    if (!(chave in cache)) {
      const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=avg_frame_rate,r_frame_rate', '-of', 'csv=p=0', abs], {encoding: 'utf8'}).stdout.trim().split(/[,\r\n]+/);
      cache[chave] = Math.max(0, ...r.map(f => { const [n, d] = f.split('/').map(Number); return d ? n / d : 0; }));
    }
    if (cache[chave] > 30.5) rapidos.push(path.relative(pastaProjetos, abs).split(path.sep).join('/'));
  }
  fs.mkdirSync(CACHE_DIR, {recursive: true});
  fs.writeFileSync(arqCache, JSON.stringify(cache));
  return rapidos;
}

/** Todos os vídeos de uma pasta (recursivo). */
export function listarVideos(pasta) {
  const lista = [];
  const visita = d => { for (const e of fs.readdirSync(d, {withFileTypes: true})) { const p = path.join(d, e.name); if (e.isDirectory()) visita(p); else if (/\.(mp4|mov|webm|mkv|m4v)$/i.test(e.name)) lista.push(p); } };
  if (fs.existsSync(pasta)) visita(pasta);
  return lista;
}

const escapa = p => p.replace(/\\/g, '/').replace(/'/g, "'\\''");

function podarCache(limiteGB = Number(process.env.RENDER_CACHE_GB) || 20) {
  if (!fs.existsSync(CACHE_DIR)) return;
  const arquivos = fs.readdirSync(CACHE_DIR).filter(n => n.endsWith('.mp4')).map(n => {
    const p = path.join(CACHE_DIR, n), st = fs.statSync(p);
    return {p, tamanho: st.size, data: st.mtimeMs};
  }).sort((a, b) => b.data - a.data);
  let total = 0;
  for (const a of arquivos) { total += a.tamanho; if (total > limiteGB * 1024 ** 3) fs.rmSync(a.p, {force: true}); }
}

/**
 * Renderiza [de, ate) da composição em blocos e grava a imagem (sem áudio) em `saida`.
 * navegadores: Chromes já abertos (um bloco por vez em cada). chave(a, b) → texto que muda quando
 * a imagem de [a, b] muda; null = não usar cache. global: tudo que vale para o vídeo inteiro
 * (hash do código, escala, qualidade).
 * som: caminho de um WAV para gravar também o som do mesmo trecho. Ele entra primeiro na fila, inteiro
 * (concurrency 1: com várias abas o som do 006 levava ~5× mais) e sai enquanto os outros Chromes
 * desenham a imagem. O som não vai para o cache.
 */
export async function renderEmBlocos({renderMedia, openBrowser, serveUrl, composition, inputProps, navegadores, de = 0, ate = composition.durationInFrames, bloco = BLOCO, chave, global, opcoes = {}, saida, som, cancelSignal, onProgress = () => {}}) {
  const usarCache = process.env.RENDER_CACHE !== '0' && typeof chave === 'function';
  const pastaTemp = path.join(path.dirname(path.resolve(saida)), `.blocos-${Date.now()}`);
  fs.mkdirSync(usarCache ? CACHE_DIR : pastaTemp, {recursive: true});
  fs.mkdirSync(pastaTemp, {recursive: true});
  fs.mkdirSync(CACHE_DIR, {recursive: true});
  const blocos = (usarCache ? planejarBlocos({de, ate, bloco, global, chave})
    : planejarBlocos({de, ate, bloco, global, chave: () => ''}).map(x => ({...x, arq: path.join(pastaTemp, `bloco-${x.a}.mp4`), pronto: false})))
    .map(x => ({...x, feitos: 0}));
  const memoria = memoriaPorChrome(os.totalmem(), navegadores.length);
  const pedacosSom = [];
  // Som numa peça só, sem emendas: cortado em pedaços, a 2ª parte do 015 saía 16 amostras deslocada.
  if (som) pedacosSom.push({som: true, a: de, b: ate - 1, arq: path.join(pastaTemp, `som-${de}.wav`)});
  const reaproveitados = blocos.filter(x => x.pronto);
  const agora = new Date();
  reaproveitados.forEach(x => { x.feitos = x.b - x.a + 1; fs.utimesSync(x.arq, agora, agora); });
  const total = ate - de, inicio = performance.now();
  const avisa = () => {
    const feitos = blocos.reduce((s, x) => s + x.feitos, 0);
    onProgress({feitos, total, novos: feitos - reaproveitados.reduce((s, x) => s + x.b - x.a + 1, 0), segundos: (performance.now() - inicio) / 1000, blocos: blocos.length, reaproveitados: reaproveitados.length, somPronto: pedacosSom.filter(x => x.pronto).length + '/' + pedacosSom.length});
  };
  avisa();
  // som primeiro: são os trabalhos mais longos, e assim não sobra um Chrome sozinho no fim
  const fila = [...pedacosSom, ...blocos.filter(x => !x.pronto)];
  // Rede de segurança da placa de vídeo: bloco que falhar com ela é refeito num Chrome sem GPU (um só, aberto na hora).
  let semGpu = null, refeitosSemGpu = 0;
  const desenha = (x, navegador, gl, parcial) => renderMedia({serveUrl, composition, inputProps, puppeteerInstance: navegador, outputLocation: parcial, frameRange: [x.a, x.b], codec: 'h264', pixelFormat: 'yuv420p', imageFormat: 'jpeg', muted: true, concurrency: 1, offthreadVideoCacheSizeInBytes: memoria.ot, mediaCacheSizeInBytes: memoria.media, timeoutInMilliseconds: gl ? 120000 : 180000, logLevel: 'error', x264Preset: X264_PRESET, chromiumOptions: chromium(gl), ...opcoes, overwrite: true, cancelSignal, onProgress: p => { x.feitos = p.renderedFrames; avisa(); }});
  try {
    await Promise.all(navegadores.slice(0, Math.max(1, fila.length)).map(async navegador => {
      for (let x = fila.shift(); x; x = fila.shift()) {
        if (x.som) {
          // soSom: avisa a composição que só o som interessa (quem ignora o aviso também serve)
          await renderMedia({serveUrl, composition, inputProps: {...inputProps, soSom: true}, puppeteerInstance: navegador, outputLocation: x.arq, frameRange: [x.a, x.b], codec: 'wav', concurrency: 1, timeoutInMilliseconds: 180000, logLevel: 'error', overwrite: true, cancelSignal});
          x.pronto = true; avisa();
          continue;
        }
        const parcial = path.join(pastaTemp, `parcial-${x.a}.mp4`);
        fs.rmSync(parcial, {force: true});
        try {
          await desenha(x, navegador, GL, parcial);
        } catch (e) {
          if (!GL || !openBrowser || /cancel/i.test(String(e?.message))) throw e;
          semGpu ??= abrirChrome(openBrowser, null);
          refeitosSemGpu++;
          console.warn(`[render-blocos] bloco ${x.a}-${x.b} falhou com GPU (${GL}), refazendo sem: ${String(e?.message).split('\n')[0].slice(0, 300)}`);
          fs.rmSync(parcial, {force: true});
          await desenha(x, await semGpu, null, parcial);
        }
        fs.renameSync(parcial, x.arq);
        x.feitos = x.b - x.a + 1; avisa();
      }
    }));
    const juntar = (itens, nome, destino) => {
      const lista = path.join(pastaTemp, nome);
      fs.writeFileSync(lista, itens.map(x => `file '${escapa(x.arq)}'`).join('\n'));
      execFileSync('ffmpeg', ['-nostdin', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', destino]);
    };
    juntar(blocos, 'blocos.txt', saida);
    if (som) juntar(pedacosSom, 'som.txt', som);
  } finally {
    fs.rmSync(pastaTemp, {recursive: true, force: true});
    if (semGpu) (await semGpu.catch(() => null))?.close({silent: true});
  }
  if (usarCache) podarCache();
  return {blocos: blocos.length, reaproveitados: reaproveitados.length, renderizados: blocos.length - reaproveitados.length, refeitosSemGpu, segundos: (performance.now() - inicio) / 1000};
}
