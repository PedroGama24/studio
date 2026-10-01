# Vídeo curto

A pessoa cola um vídeo já cortado. Você devolve um MP4 vertical (Reels, TikTok, Shorts) que prende pela edição: legenda grande, frase em tipo enorme, número que conta, print com zoom se ela tiver deixado um. O conteúdo é dela. O que se vende é a edição.

## O estúdio já está aqui

Não crie outro projeto, não copie o Remotion para outra pasta e não reescreva o que já existe. Use este repositório:

- `CLAUDE.md` conduz a conversa.
- `src/estilos/VerticalLegendas.tsx`, `VerticalPrint.tsx` e `VerticalDados.tsx` são os três visuais prontos. Parta deles.
- `src/_shared/synchronized-split.tsx` é obrigatório em tela dividida.
- `tools/transcrever.py` gera o tempo de cada palavra.
- `src/Root.tsx` é onde o vídeo da pessoa entra.
- `projetos/` vem vazio de propósito. Não procure um exemplo. Crie `001. video` na hora.

O único código novo é o vídeo dela, em `src/videos/<slug>/`.

Leia este guia por inteiro antes de organizar, transcrever ou programar. Não ofereça Nível 2, Higgsfield, vídeo horizontal, overlay em MOV nem a galeria. Isso só entra se ela pedir com todas as letras; aí leia o guia correspondente.

## O que assumir

Diga o que assumiu, numa frase, dentro das 4 linhas. Não pergunte.

- Entregável: um MP4 completo.
- Formato: 1080×1920. Deixe livres ~250 px no topo e ~420 px embaixo (a interface do app come essa faixa). Legenda grande abaixo do queixo, acima dessa faixa.
- Intensidade: dominante. A tela muda com a fala. Câmera limpa só no gancho e quando a frase pede o rosto.
- Prints: se a pasta `prints/` estiver vazia, edite mesmo assim. Se houver print, use com zoom e marca-texto na frase citada.
- O vídeo gravado não se corta, não se acelera e não se regrava.

## Conversa

Uma pergunta por vez.

### Não há vídeo em `projetos/`

Crie a próxima pasta `projetos/NNN. video/video/` (três dígitos, maior número + 1; a primeira é `001. video`). Diga só isto, com o caminho real:

> Coloca o seu vídeo nesta pasta: `projetos/NNN. video/video/`. MP4 ou MOV, já cortado. Quando o arquivo estiver aí, me avisa.

### Há vídeo e ela ainda não disse que pode

1. Pergunte o nome do vídeo. Se ela disser que tanto faz, use o nome do arquivo.
2. Renomeie a pasta para `NNN. esse-nome` e mova o arquivo para `video/` se ele estiver solto.
3. Transcreva e olhe quadros (comandos abaixo) para as 4 linhas citarem frases reais e o lugar do rosto.
4. Mostre exatamente estas 4 linhas e pare. Não programe antes de um "pode", "sim", "manda" ou equivalente.

> 1. Vertical, para Reels, TikTok e Shorts.
> 2. Visual: **{estilo}**. {uma frase: por que este, nesta fala}.
> 3. Entra: {dois ou três recursos, cada um ligado a uma palavra real e ao tempo}.
> 4. Fica de fora: cortar o seu vídeo, e imagem gerada.
>
> Pode ser assim?

Estilo, escolha você:

- Ela citou tela, notícia ou dado e existe print → **Print com marca-texto** (`src/estilos/VerticalPrint.tsx`).
- A fala tem números ou comparação → **Dados leves** (`src/estilos/VerticalDados.tsx`).
- No resto → **Legenda dinâmica** (`src/estilos/VerticalLegendas.tsx`).

A legenda palavra por palavra entra nos três. O estilo é o sotaque, não a única camada.

### Depois do pode

Escreva `plano.md` com a tabela de cenas (é o seu roteiro, não um documento para ela ler). Programe, confira os quadros, renderize. Entregue o caminho do MP4 e feche com:

> Quer que eu altere alguma coisa?

Mudança pedida: ajuste e renderize de novo. Não reabra o cardápio.

## Como prender

Cada inserção nasce de uma palavra do `palavras.json`, no instante em que ela é dita. Nada aparece antes.

| O que ela diz | O que entra na tela |
|---|---|
| Frase comum | Legenda grande, palavra falada em destaque |
| Frase-chave ou pergunta | Essa frase em tipo enorme; a câmera abre espaço e não cobre olho nem boca |
| Número | O número conta até o valor falado |
| Etapas | Uma etapa por vez, na ordem da fala |
| Print citado | Print íntegro, zoom lento, marca-texto só na frase citada; câmera embaixo |

Troque o layout quando o assunto vira. Movimento de 0,9–1,2 s, curva suave, câmera e painel juntos. Sem tela preta no meio. Rosto livre: olhos, boca e contorno, medidos nos quadros reais.

## Comandos

Organizar: `ffprobe` no master (duração, fps, tamanho). A duração final é a do master, ±1 quadro. Áudio original uma vez só.

Quadros: a skill `watch`, como ela mesma manda, com saída em `projetos/<NNN. nome>/frames`. Sem transcrição da watch, use `--no-whisper`.

Palavras:

```bash
python tools/transcrever.py "<vídeo>" "projetos/<NNN. nome>/transcricao"
```

No Windows, `python`. Nome próprio errado: corrija o texto, não o tempo.

Código em `src/videos/<slug>/`, registrado em `src/Root.tsx`. Arquivos do projeto entram com `staticFile('<NNN. nome>/...')`. Uma instância contínua de `<Video>`; a câmera muda de tamanho no contêiner, o vídeo não reinicia. Tela dividida só com `src/_shared/synchronized-split.tsx` (no vertical, conteúdo em cima e câmera embaixo). Tempo em segundos do `palavras.json`, convertido pelo fps. `<Sequence premountFor={fps}>` em cena com tempo. Animação só com `useCurrentFrame()`.

Ao programar, leia também [guias/2-nivel-1-remotion.md](2-nivel-1-remotion.md) a partir de "Programar as cenas" e [guias/5-direcao-editorial.md](5-direcao-editorial.md) seções 4 e 9. Não leia o restante para a pessoa.

Conferir: `npm run typecheck`, depois um quadro no início, no meio e no fim de cada troca de layout:

```bash
npx remotion still src/index.ts <Composicao> "edicoes/<NNN. nome>/stills/q0450.png" --frame=450
```

Olhe: rosto coberto, texto cortado, faixa do app, print cortado, marca-texto fora da frase. Mostre esses quadros e siga para o render se estiverem limpos. Ela pediu o vídeo, não uma segunda aprovação.

Render:

```bash
npx remotion render src/index.ts <Composicao> "edicoes/<NNN. nome>/<nome>-final.mp4" --codec=h264 --crf=17
```

Confira com `ffprobe`: 1080×1920, fps e duração do master, uma trilha de áudio. Apague só intermediário que você criou.
