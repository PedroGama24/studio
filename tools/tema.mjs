// Confere se o tema da marca (minha-marca/tema.json) está certo.
// Uso: node tools/tema.mjs "minha-marca/tema.json"  ->  imprime "ok" ou o que corrigir.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const CORES = ['destaque', 'texto', 'fundo'];

export function validarTema(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return {ok: false, erros: ['O tema precisa ser um objeto com destaque, texto, fundo e fonte.']};
  }
  const erros = [];
  for (const campo of CORES) {
    if (typeof obj[campo] !== 'string' || !/^#[0-9a-fA-F]{6}$/.test(obj[campo])) {
      erros.push(`A cor "${campo}" precisa estar no formato #RRGGBB (por exemplo #FFE14D).`);
    }
  }
  if (typeof obj.fonte !== 'string' || obj.fonte.trim() === '') {
    erros.push('A "fonte" precisa ser um texto com o nome da fonte.');
  }
  return {ok: erros.length === 0, erros};
}

function principal() {
  const arquivo = process.argv[2];
  if (!arquivo) {
    console.log('Diga qual arquivo conferir, por exemplo: node tools/tema.mjs "minha-marca/tema.json"');
    process.exit(1);
  }
  let obj;
  try {
    obj = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  } catch (e) {
    console.log(`Não consegui ler "${arquivo}": ${e.message}`);
    process.exit(1);
  }
  const {ok, erros} = validarTema(obj);
  console.log(ok ? 'ok' : erros.join('\n'));
  process.exit(ok ? 0 : 1);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  principal();
}
