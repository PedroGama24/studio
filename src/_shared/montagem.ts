// Contas de tempo da montagem, em quadros. Fica separado para o componente e os testes usarem o mesmo cálculo.
export const quadrosDoClipe = (clipe: {de: number; ate: number}, fps: number) => ({
  inicio: Math.round(clipe.de * fps),
  duracao: Math.max(1, Math.round((clipe.ate - clipe.de) * fps)),
});

// Total de quadros da montagem: a soma dos clipes (mínimo 1). Use em durationInFrames da composição.
export const duracaoMontagem = (clipes: {de: number; ate: number}[], fps: number): number =>
  Math.max(1, clipes.reduce((soma, c) => soma + quadrosDoClipe(c, fps).duracao, 0));
