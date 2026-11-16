// Tema da marca: as cores e a fonte que os estilos verticais usam.
// O arquivo minha-marca/tema.json tem exatamente estas chaves.
export type Tema = {destaque: string; texto: string; fundo: string; fonte: string};

// Visual de hoje do estilo VerticalLegendas.
export const TEMA_PADRAO: Tema = {
  destaque: '#FFE14D',
  texto: '#FFFFFF',
  fundo: '#111111',
  fonte: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
};
