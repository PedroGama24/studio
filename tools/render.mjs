// npm run render -- <Composicao> "<saida.mp4>"
// Render rápido em blocos (tools/render-blocos.mjs): vários Chromes, blocos de ~10 s com cache,
// placa de vídeo no Windows. O som sai em WAV e é juntado ao final com ffmpeg (AAC 256k, 48 kHz).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {BLOCO, abrirChrome, hash, hashFontes, listarVideos, renderEmBlocos, videosRapidos} from './render-blocos.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJETOS = path.join(RAIZ, 'projetos');
const USO = 'Uso: npm run render -- <Composicao> "<saida.mp4>"';

export function lerArgs(argv) {
  const [composicao, saida] = argv;
  if (!composicao || !saida) throw new Error(USO);
  return {composicao, saida};
}

const quantosChromes = () => Number(process.env.RENDER_CHROMES) || Math.max(1, Math.min(4, Math.floor(os.cpus().length / 2)));

// Nome, tamanho e data de tudo que há em projetos/: trocar um vídeo ou print refaz só o que depende dele.
function assinaturaProjetos() {
  const lista = [];
  const visita = pasta => {
    for (const e of fs.readdirSync(pasta, {withFileTypes: true})) {
      const p = path.join(pasta, e.name);
      if (e.isDirectory()) visita(p);
      else { const st = fs.statSync(p); lista.push(`${path.relative(PROJETOS, p)}|${st.size}|${st.mtimeMs}`); }
    }
  };
  if (fs.existsSync(PROJETOS)) visita(PROJETOS);
  return lista.sort();
}

// O bundle sai com public/ vazio e ganha um link para projetos/: nada de copiar os vídeos da pessoa.
// No Windows o link é uma junction (não exige administrador). Apagar o link não apaga projetos/.
function ligarProjetos(bundleDir) {
  const link = path.join(bundleDir, 'public');
  fs.rmSync(link, {recursive: true, force: true});
  fs.symlinkSync(PROJETOS, link, process.platform === 'win32' ? 'junction' : 'dir');
}

export async function renderizar({composicao: id, saida}) {
  const {bundle} = await import('@remotion/bundler');
  const {openBrowser, selectComposition, renderMedia} = await import('@remotion/renderer');
  const destino = path.resolve(saida);
  fs.mkdirSync(path.dirname(destino), {recursive: true});
  const temp = path.join(RAIZ, 'tmp', `render-${process.pid}`);
  fs.rmSync(temp, {recursive: true, force: true});
  fs.mkdirSync(path.join(temp, 'public-vazio'), {recursive: true});
  const navegadores = [];
  try {
    console.log('Preparando o vídeo...');
    const serveUrl = await bundle({entryPoint: path.join(RAIZ, 'src', 'index.ts'), outDir: path.join(temp, 'bundle'), publicDir: path.join(temp, 'public-vazio'), enableCaching: false});
    ligarProjetos(path.join(temp, 'bundle'));
    const inputProps = {videosRapidos: videosRapidos(listarVideos(PROJETOS), PROJETOS)};
    navegadores.push(await abrirChrome(openBrowser));
    const composition = await selectComposition({serveUrl, id, inputProps, puppeteerInstance: navegadores[0], logLevel: 'error'});
    const chromes = Math.max(1, Math.min(quantosChromes(), Math.ceil(composition.durationInFrames / BLOCO)));
    for (let i = 1; i < chromes; i++) navegadores.push(await abrirChrome(openBrowser));
    const global = {id, largura: composition.width, altura: composition.height, fps: composition.fps, codigo: hashFontes(['src', 'package-lock.json']), projetos: hash(assinaturaProjetos()), rapidos: inputProps.videosRapidos};
    const imagem = path.join(temp, 'imagem.mp4'), som = path.join(temp, 'audio.wav');
    console.log(`Desenhando ${composition.durationInFrames} quadros com ${chromes} Chrome(s)...`);
    let ultimo = -1;
    const r = await renderEmBlocos({renderMedia, openBrowser, serveUrl, composition, inputProps, navegadores, chave: () => global.codigo + global.projetos, global, opcoes: {crf: 17, jpegQuality: 95}, saida: imagem, som, onProgress: p => {
      const pct = Math.floor(p.feitos / p.total * 10) * 10;
      if (pct !== ultimo) { ultimo = pct; console.log(`  ${pct}%${p.reaproveitados ? ` (${p.reaproveitados}/${p.blocos} blocos já prontos)` : ''}`); }
    }});
    // O AAC do Remotion sai atrasado ~43 ms; codificar o WAV uma vez com o ffmpeg corrige, e a imagem é copiada sem recodificar.
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', imagem, '-i', som, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', destino]);
    console.log(`Pronto em ${Math.round(r.segundos)} s: ${saida}`);
  } finally {
    await Promise.all(navegadores.map(n => n.close({silent: true}).catch(() => {})));
    // Só o que este render criou: a pasta temporária (o link para projetos/ some junto, o conteúdo não).
    const link = path.join(temp, 'bundle', 'public');
    try { fs.unlinkSync(link); } catch { /* sem link */ }
    fs.rmSync(temp, {recursive: true, force: true});
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    await renderizar(lerArgs(process.argv.slice(2)));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
