import React from 'react';
import {Composition, Folder} from 'remotion';
import {VerticalDados} from './estilos/VerticalDados';
import {VerticalLegendas} from './estilos/VerticalLegendas';
import {VerticalMontagem} from './estilos/VerticalMontagem';
import {VerticalPrint} from './estilos/VerticalPrint';

const FPS = 30;
const SEIS_SEGUNDOS = 6 * FPS;

export const RemotionRoot: React.FC = () => (
  <>
    {/* Exemplos que rodam sem nenhum vídeo. Servem de referência de estilo, não de padrão fixo. */}
    <Folder name="Estilos">
      <Composition id="VerticalLegendas" component={VerticalLegendas} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="VerticalPrint" component={VerticalPrint} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition id="VerticalDados" component={VerticalDados} width={1080} height={1920} fps={FPS} durationInFrames={SEIS_SEGUNDOS} />
      <Composition
        id="VerticalMontagem"
        component={VerticalMontagem}
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={SEIS_SEGUNDOS}
        defaultProps={{
          clipes: [],
          textos: [
            {texto: 'Começando o desenho', s: 0.5, e: 2.3},
            {texto: 'Traço por traço', s: 2.5, e: 4.3},
            {texto: 'Pronto!', s: 4.5, e: 5.8},
          ],
        }}
      />
    </Folder>

    {/* Seus vídeos entram aqui: um <Folder name="001-slug"> por projeto, com o código em src/videos/<slug>/. */}
  </>
);
