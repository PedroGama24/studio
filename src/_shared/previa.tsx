import React from 'react';
import {Audio, Video} from '@remotion/media';
import {getInputProps, getRemotionEnvironment, Html5Audio, Html5Video, OffthreadVideo} from 'remotion';

/**
 * Verdadeiro no Studio e no Player; falso no render. Use para trocar, só na prévia, o que é leve no
 * render (Chrome sem GPU) mas pesado no navegador tocando ao vivo, e vice-versa. O MP4 final não muda.
 */
export const emPrevia = () => !getRemotionEnvironment().isRendering;

// Caminho relativo a projetos/ de um src do staticFile ("/public/006.%20x/pack/luz-02.mp4" → "006. x/pack/luz-02.mp4").
const relativo = (src: string) => decodeURIComponent(new URL(src, 'http://local').pathname).replace(/^\/(public\/)?/, '');
let rapidos: Set<string> | null = null;
/** Arquivo acima de 30 fps (lista `videosRapidos` que o render passa nas input props; tools/render-blocos.mjs). */
const ehRapido = (src: string) => (rapidos ??= new Set(((getInputProps() as {videosRapidos?: string[]}).videosRapidos ?? []))).has(relativo(src));

/**
 * Vídeo no render: <Video> do @remotion/media, exceto arquivos acima de 30 fps, que vão pelo <OffthreadVideo>.
 * Com a placa de vídeo ligada no Chrome (render ~3× mais rápido), o @remotion/media trava no 1º quadro
 * desses arquivos; o OffthreadVideo extrai com ffmpeg fora do Chrome (mais lento, por isso só neles).
 */
export const VideoRender: React.FC<React.ComponentProps<typeof Video>> = (props) => {
  if (!ehRapido(props.src)) return <Video {...props} />;
  const {src, trimBefore, trimAfter, playbackRate, muted, volume, style, objectFit} = props;
  return <OffthreadVideo src={src} trimBefore={trimBefore} trimAfter={trimAfter} playbackRate={playbackRate} muted={muted} volume={typeof volume === 'number' ? volume : undefined} style={{objectFit: objectFit ?? 'contain', ...style}} />;
};

/**
 * <Video> do @remotion/media no render (quadro exato); na prévia, o <video> do navegador, que usa o
 * decodificador de hardware da placa e não segura a reprodução esperando cada quadro (no Studio o
 * @remotion/media decodifica por software e a prévia caía para ~10 fps com o som picotando).
 */
export const VideoLeve: React.FC<React.ComponentProps<typeof Video>> = (props) => {
  if (!emPrevia()) return <VideoRender {...props} />;
  const {src, trimBefore, trimAfter, playbackRate, muted, volume, loop, style, objectFit} = props;
  return (
    <Html5Video
      src={src}
      trimBefore={trimBefore}
      trimAfter={trimAfter}
      playbackRate={playbackRate}
      muted={muted}
      volume={typeof volume === 'number' ? volume : undefined}
      loop={loop}
      style={{objectFit: objectFit ?? 'contain', ...style}}
    />
  );
};

/** Mesmo princípio para o som: no render o <Audio> do @remotion/media; na prévia, o áudio do navegador. */
export const AudioLeve: React.FC<React.ComponentProps<typeof Audio>> = (props) => {
  if (!emPrevia()) return <Audio {...props} />;
  const {src, trimBefore, trimAfter, playbackRate, volume, loop} = props;
  return <Html5Audio src={src} trimBefore={trimBefore} trimAfter={trimAfter} playbackRate={playbackRate} volume={volume} loop={loop} />;
};
