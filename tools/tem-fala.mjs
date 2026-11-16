// Diz se um vídeo tem fala, a partir das palavras que tools/transcrever.py achou.
// Uso: node tools/tem-fala.mjs "palavras.json" <duracao-em-segundos>  ->  imprime "fala" ou "sem-fala".
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const MIN_PALAVRAS = 8;
const MIN_POR_SEGUNDO = 0.3;

export function temFala(palavras, duracaoSeg) {
  if (!Array.isArray(palavras) || !(duracaoSeg > 0)) return false;
  return palavras.length >= MIN_PALAVRAS && palavras.length / duracaoSeg >= MIN_POR_SEGUNDO;
}

function principal() {
  const [arquivo, duracaoTexto] = process.argv.slice(2);
  const duracao = Number(duracaoTexto);
  if (!arquivo || !(duracao > 0)) {
    console.log('Diga o arquivo e a duração em segundos, por exemplo: node tools/tem-fala.mjs "palavras.json" 30');
    process.exit(1);
  }
  let palavras;
  try {
    palavras = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  } catch (e) {
    console.log(`Não consegui ler "${arquivo}": ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(palavras)) {
    console.log(`O arquivo "${arquivo}" não tem uma lista de palavras.`);
    process.exit(1);
  }
  console.log(temFala(palavras, duracao) ? 'fala' : 'sem-fala');
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) {
  principal();
}
