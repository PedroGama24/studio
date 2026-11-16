# Vídeo curto

A pessoa coloca um vídeo, ou vários clipes, numa pasta. Você devolve um MP4 vertical (Reels, TikTok, Shorts) que prende pela edição e segue o jeito que o perfil dela já tem. O conteúdo é dela. O que se vende é a edição.

Você não sabe como são os vídeos dela até abrir a pasta. Pode chegar uma pessoa falando para a câmera ou vários clipes sem fala (processo, antes e depois, resultado). O guia cobre os dois: **com fala** e **montagem**.

## O estúdio já está aqui

Não crie outro projeto, não copie o Remotion para outra pasta e não reescreva o que já existe. Use este repositório:

- `CLAUDE.md` conduz a conversa.
- `minha-marca/ANALISE.md` e `minha-marca/tema.json` são o padrão da marca, feitos pela skill `minha-marca`.
- `src/estilos/VerticalLegendas.tsx`, `VerticalPrint.tsx` e `VerticalDados.tsx` são os visuais prontos para vídeo com fala. `src/estilos/VerticalMontagem.tsx` é o visual para clipes sem fala. Parta deles.
- `src/_shared/synchronized-split.tsx` é obrigatório em tela dividida.
- `tools/transcrever.py` gera o tempo de cada palavra; `tools/tem-fala.mjs` diz se há fala.
- `src/Root.tsx` é onde o vídeo da pessoa entra.
- `projetos/` vem vazio de propósito. Não procure um exemplo. Crie `001. video` na hora.

O único código novo é o vídeo dela, em `src/videos/<slug>/`.

Leia este guia por inteiro antes de organizar, transcrever ou programar. Não ofereça overlay em MOV, outro formato além do vertical nem outros estilos além destes. Se ela pedir, explique que o estúdio entrega só o MP4 vertical.

## O que assumir

Diga o que assumiu, numa frase, dentro das 4 linhas. Não pergunte.

- Entregável: um MP4 completo, 1080×1920.
- Área livre: ~250 px no topo e ~420 px embaixo (a interface do app come essa faixa). Legenda grande abaixo do queixo, acima dessa faixa.
- Intensidade: dominante. A tela muda com a fala ou com o clipe.
- Prints: se a pasta `prints/` estiver vazia, edite mesmo assim. Se houver print, use com zoom e marca-texto na frase citada.
- Visual: o da marca (`minha-marca/tema.json`) em todo estilo. Sem análise, o visual padrão do estúdio.
- Música: o vídeo sai sem música de terceiros. Ela põe a música no app do Instagram, na hora de postar (passos no fim).

## Conversa

Uma pergunta por vez.

### Antes de tudo: a análise da marca

Em silêncio, veja se existe `minha-marca/ANALISE.md`.

- **Existe:** leia o arquivo inteiro e o `minha-marca/tema.json`. Rode `node tools/tema.mjs "minha-marca/tema.json"`; se não der `ok`, corrija o que ele apontar. Siga em frente sem comentar.
- **Não existe:** pergunte só isto:

> Antes de editar, quer que eu dê uma olhada no seu Instagram para o vídeo sair com a sua cara? Leva uns 10 minutos.

  Se ela disser que sim, use a skill `minha-marca` (guia `guias/minha-marca.md`) e volte aqui quando terminar. Se disser que não, siga com o visual padrão do estúdio e não pergunte de novo nesta conversa.

### Não há vídeo em `projetos/`

Crie a próxima pasta `projetos/NNN. video/video/` (três dígitos, maior número + 1; a primeira é `001. video`). Diga só isto, com o caminho real:

> Coloca o seu vídeo nesta pasta: `projetos/NNN. video/video/`. Pode ser um vídeo só ou vários clipes, do jeito que saíram do celular (MP4 ou MOV). Quando estiver tudo aí, me avisa.

### Há vídeo e ela ainda não disse que pode

1. Pergunte o nome do vídeo. Se ela disser que tanto faz, use o nome do primeiro arquivo.
2. Renomeie a pasta para `NNN. esse-nome` e mova os arquivos para `video/` se estiverem soltos.
3. Para cada arquivo em `video/`: `ffprobe` (duração, fps, tamanho), transcrição e `tem-fala` (comandos abaixo).
4. Escolha o caminho por esta regra:
   - **Algum arquivo deu `fala`** → caminho **com fala**, com esse arquivo. Se mais de um deu `fala`, cada um é uma edição separada: comece pelo primeiro em ordem de nome e diga que os outros vêm depois. Clipes sem fala do mesmo projeto ficam de fora deste vídeo; diga isso na linha 4.
   - **Todos deram `sem-fala`** (ou a transcrição não achou nenhuma palavra) → caminho **montagem**, com todos os clipes.
5. Olhe quadros (skill `watch`) para as 4 linhas citarem coisas reais: frases ditas e o lugar do rosto (com fala), ou o melhor trecho de cada clipe (montagem).
6. Mostre exatamente estas 4 linhas e pare. Não programe antes de um "pode", "sim", "manda" ou equivalente.

> 1. Vertical, para Reels, TikTok e Shorts: {com a sua fala | montagem dos seus N clipes}.
> 2. Visual: **{estilo}**. Segui as cores e o jeito das suas legendas: {uma coisa real da análise}.
> 3. Entra: {dois ou três recursos, cada um ligado a uma palavra real e ao tempo, ou a um clipe e ao trecho}.
> 4. Fica de fora: {com fala: cortar o seu vídeo | montagem: acelerar ou deformar os clipes}, música (você escolhe no Instagram) e imagem gerada.
>
> Pode ser assim?

Sem análise, a linha 2 diz: "Visual: **{estilo}**, no padrão do estúdio, porque ainda não olhei o seu Instagram."

Estilo, escolha você:

- Montagem → **Montagem** (`src/estilos/VerticalMontagem.tsx`).
- Com fala e ela citou tela, notícia ou dado e existe print → **Print com marca-texto** (`src/estilos/VerticalPrint.tsx`).
- Com fala e números ou comparação → **Dados leves** (`src/estilos/VerticalDados.tsx`).
- Com fala, no resto → **Legenda dinâmica** (`src/estilos/VerticalLegendas.tsx`).

Com fala, a legenda palavra por palavra entra nos três. O estilo é o sotaque, não a única camada.

Use a análise para decidir: em "O que mais engaja" e "Formatos", o que abrir primeiro e quanto tempo o vídeo dura; em "Tom das legendas", o jeito de escrever os textos; em "Como os vídeos vão seguir este padrão", o que ela já aprovou. Melhore o que já existe, não invente um visual novo.

### Depois do pode

Escreva `plano.md` com a tabela de cenas (é o seu roteiro, não um documento para ela ler). Programe, confira os quadros, renderize. Entregue o caminho do MP4, ensine a música (fim deste guia) e feche com:

> Quer que eu altere alguma coisa?

Mudança pedida: ajuste e renderize de novo. Não reabra o cardápio.

## Caminho com fala

O vídeo gravado é intocável: não se corta, não se acelera, não se regrava. A edição é tudo o que vai por cima.

Cada inserção nasce de uma palavra do `palavras.json`, no instante em que ela é dita. Nada aparece antes.

| O que ela diz | O que entra na tela |
|---|---|
| Frase comum | Legenda grande, palavra falada em destaque |
| Frase-chave ou pergunta | Essa frase em tipo enorme; a câmera abre espaço e não cobre olho nem boca |
| Número | O número conta até o valor falado |
| Etapas | Uma etapa por vez, na ordem da fala |
| Print citado | Print íntegro, zoom lento, marca-texto só na frase citada; câmera embaixo |

Troque o layout quando o assunto vira. Câmera limpa só no gancho e quando a frase pede o rosto. A duração final é a do master, ±1 quadro, com o áudio original uma vez só.

## Caminho montagem

Para clipes sem fala (processo, antes e depois, resultado). Você **pode** escolher o trecho de cada clipe e a ordem deles. **Nunca** acelere, desacelere, deforme nem regrave um clipe.

- **Trecho:** pelos quadros, pegue de cada clipe o pedaço com mais movimento ou o momento do resultado, em geral de 1,5 a 4 s. `de` e `ate` são segundos do próprio clipe e `ate` não passa da duração dele.
- **Ordem:** abra com o que mais prende (pela análise; sem ela, o resultado pronto por 1 a 2 s) e depois conte a história na ordem em que aconteceu.
- **Duração:** a que a análise mostra nos Reels dela; sem isso, de 15 a 30 s. Se a soma dos melhores trechos não chegar, o vídeo fica mais curto (ou alongue o trecho dentro do próprio clipe); nunca repita um clipe.
- **Clipe deitado:** ele preenche a tela cortando as laterais, sem deformar. Confira nos quadros se o principal continua visível; se não, use outro trecho.
- **Textos:** frases curtas (2 a 6 palavras), no tom de "Tom das legendas" da análise, uma por clipe ou a cada 2 a 3 s. Sem emoji se ela não usa emoji. Não escreva o que não aconteceu no vídeo.
- **Som:** o som ambiente dos clipes fica (`somOriginal` padrão). Se ela pedir silêncio, `somOriginal: false`.

## Comandos

Organizar: `ffprobe` em cada arquivo (duração, fps, tamanho).

Palavras, uma vez por arquivo:

```bash
python tools/transcrever.py "projetos/<NNN. nome>/video/<arquivo>" "projetos/<NNN. nome>/transcricao/<arquivo-sem-extensão>"
```

No Windows, `python`. Nome próprio errado: corrija o texto, não o tempo. Em clipe sem voz a transcrição pode sair vazia ou dar erro: trate esse clipe como `sem-fala`.

Fala ou não, com a duração do `ffprobe` em segundos:

```bash
node tools/tem-fala.mjs "projetos/<NNN. nome>/transcricao/<arquivo-sem-extensão>/palavras.json" <duracao>
```

Imprime `fala` ou `sem-fala`.

Quadros: a skill `watch`, como ela mesma manda, com saída em `projetos/<NNN. nome>/frames`. Sem transcrição da watch, use `--no-whisper`.

### Programar as cenas

- Código em `src/videos/<slug>/`, registrado em `src/Root.tsx` dentro de um `<Folder>`. Arquivos do projeto entram com `staticFile('<NNN. nome>/...')` (a pasta `projetos` é a pasta pública do Remotion).
- **Tema:** copie as 4 chaves de `minha-marca/tema.json` para `src/videos/<slug>/tema.ts` (`export const TEMA: Tema = {...}`, tipo `Tema` de `src/_shared/tema.ts`) e passe `tema={TEMA}` em todo estilo. Sem análise, use `TEMA_PADRAO`.
- **Vídeo dentro da composição:** sempre `VideoRender` ou `VideoLeve` de `src/_shared/previa.tsx`, nunca `<Video>` direto. `VideoLeve` deixa a prévia fluida; o MP4 final sai igual.
- **Com fala:** uma instância contínua do vídeo; a câmera muda de tamanho e lugar animando o contêiner, nunca reiniciando o vídeo. Dimensões 1080×1920, fps do master. Tela dividida só com `src/_shared/synchronized-split.tsx` (conteúdo em cima, câmera embaixo); o `npm run typecheck` bloqueia split feito à mão. Evite `TransitionSeries.Transition` sobre o master: a sobreposição encurta o vídeo.
- **Montagem:** use `VerticalMontagem` com `clipes` (`{src, de, ate}`, `src` = `staticFile('<NNN. nome>/video/<arquivo>')`), `textos` (`{texto, s, e}`, segundos do vídeo final) e `tema`. O `durationInFrames` da composição vem de `duracaoMontagem(clipes, fps)` (`src/_shared/montagem.ts`), nunca escrito à mão. fps 30.
- Tempos em segundos (do `palavras.json` ou do plano), convertidos pelo fps. `<Sequence premountFor={fps}>` em toda cena com tempo. Animação só com `useCurrentFrame()`, nada de transição ou animação CSS.

**Movimento (com fala).** Câmera: push-in suave de 1,00 a 1,04 ao longo de um trecho; ênfase até ~1,12 em 2 a 3 s. O deslocamento não passa de `largura × (escala − 1) / 2`, senão aparece borda preta. Troca de layout em 0,9 a 1,2 s com `Easing.inOut(Easing.cubic)`, câmera e painel juntos, mesma curva e mesma janela. Pode começar uns quadros antes da palavra, mas o conteúdo nunca aparece antes de ser dito. Misture corte seco (mudança de assunto, ritmo de lista), fade curto de 10 a 14 quadros (mesma atmosfera) e transformação animada (só quando a mudança tem significado). Nunca tela vazia ou preta entre cenas. Painéis sobem com mola suave; texto entra palavra por palavra.

**Cuidados fixos**, em qualquer estilo. Na montagem, os textos seguem o clipe:

1. Com fala, tempo por palavra: todo gatilho usa o início exato da palavra no `palavras.json`.
2. Rosto livre: nada cobre olhos, boca ou contorno do rosto, medidos nos quadros reais.
3. Legível na tela de um celular.
4. Sem texto dentro de imagem gerada por IA: todo texto entra na montagem.
5. Números como foram falados, sem "correção" na tela.
6. Prints íntegros, e marca-texto exatamente sobre a frase citada.

### Conferir

`npm run typecheck`, depois um quadro no início, no meio e no fim de cada troca de layout ou de clipe:

```bash
npx remotion still src/index.ts <Composicao> "edicoes/<NNN. nome>/stills/q0450.png" --frame=450
```

Olhe: rosto coberto, texto cortado, faixa do app, print cortado, marca-texto fora da frase, clipe com o principal fora da tela. Mostre esses quadros e siga para o render se estiverem limpos. Ela pediu o vídeo, não uma segunda aprovação.

### Render

```bash
npm run render -- <Composicao> "edicoes/<NNN. nome>/<nome>-final.mp4"
```

Confira com `ffprobe`: 1080×1920 e uma trilha de áudio. Com fala, fps e duração do master (±1 quadro). Na montagem, a duração da soma dos trechos. Apague só intermediário que você criou; nunca apague `tmp/` de forma recursiva com o PowerShell (veja `CLAUDE.md`).

## Música no Instagram

O vídeo sai sem música de terceiros: música de fora pode derrubar o som ou o post. Depois de entregar o MP4, ensine:

> Para pôr música, faça no próprio Instagram, na hora de postar:
> 1. Toque em **+**, escolha **Reel** e selecione este vídeo.
> 2. Toque no ícone de música (a notinha), procure uma música e arraste para escolher o trecho.
> 3. Em volume, deixe o som do vídeo mais baixo se quiser ouvir só a música, e siga para postar.
>
> Se a sua conta for comercial, aparecem só as músicas liberadas para empresas. O nome dos botões pode mudar um pouco.
