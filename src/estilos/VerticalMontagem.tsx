import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraFalsa, clamp, suave} from './_comum';
import {VideoRender} from '../_shared/previa';
import {quadrosDoClipe} from '../_shared/montagem';
import {TEMA_PADRAO, type Tema} from '../_shared/tema';

// Estilo "montagem" (9:16) para vídeo sem fala: clipes um depois do outro, cada um preenchendo a tela,
// com frases curtas por cima. Tempos em segundos. Sem clipes, mostra a câmera falsa no lugar.
// Num projeto real, `src` de cada clipe é staticFile('<NNN. slug>/video/clipe-01.mp4').
// Área segura: 250 px livres no topo e 420 px embaixo (onde o Instagram põe a interface).

type Clipe = {src: string; de: number; ate: number};
type Texto = {texto: string; s: number; e: number};

const TOPO_LIVRE = 250;
const BASE_LIVRE = 420;

const TextoEmCena: React.FC<{item: Texto; tema: Tema}> = ({item, tema}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entra = interpolate(frame, [item.s * fps, (item.s + 0.4) * fps], [0, 1], {...clamp, easing: suave});
  const sai = interpolate(frame, [(item.e - 0.3) * fps, item.e * fps], [1, 0], clamp);
  const visivel = Math.min(entra, sai);
  if (frame < item.s * fps || frame > item.e * fps) return null;
  return (
    <div
      style={{
        position: 'absolute', left: 70, right: 70, bottom: BASE_LIVRE, display: 'flex', justifyContent: 'center',
        opacity: visivel, transform: `translateY(${(1 - entra) * 40}px)`,
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,.55)', borderBottom: `8px solid ${tema.destaque}`, borderRadius: 24, padding: '24px 40px',
          color: tema.texto, fontFamily: tema.fonte, fontSize: 76, lineHeight: 1.15, textAlign: 'center',
          textShadow: '0 4px 20px rgba(0,0,0,.8)',
        }}
      >
        {item.texto}
      </div>
    </div>
  );
};

export const VerticalMontagem: React.FC<{clipes: Clipe[]; textos: Texto[]; tema?: Tema; somOriginal?: boolean}> = ({
  clipes,
  textos,
  tema,
  somOriginal = true,
}) => {
  const {fps} = useVideoConfig();
  const t = tema ?? TEMA_PADRAO;
  let inicio = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {clipes.length === 0 ? (
        <CameraFalsa preencher />
      ) : (
        clipes.map((c, i) => {
          const {inicio: ini, duracao} = quadrosDoClipe(c, fps);
          const de = inicio;
          inicio += duracao;
          return (
            <Sequence key={`${c.src}-${i}`} from={de} durationInFrames={duracao} layout="none">
              <AbsoluteFill>
                <VideoRender
                  src={c.src}
                  trimBefore={ini}
                  trimAfter={ini + duracao}
                  muted={!somOriginal}
                  objectFit="cover"
                  style={{width: '100%', height: '100%'}}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })
      )}
      <AbsoluteFill style={{background: 'linear-gradient(transparent 60%, rgba(0,0,0,.35))'}} />
      {textos.map((item, i) => (
        <TextoEmCena key={`${item.texto}-${i}`} item={item} tema={t} />
      ))}
    </AbsoluteFill>
  );
};
