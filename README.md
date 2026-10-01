# Vídeo curto

Você grava. O Claude edita.

Abra o Claude na aba **Code**. Cole o texto abaixo inteiro. Você não precisa entender o texto: o Claude executa.

```text
Instala o estúdio de vídeo curto do Pedro Gama.
Repositório: https://github.com/PedroGama24/studio.git
Pasta: C:\dev\studio no Windows, ou ~/dev/studio no Mac e no Linux. Fora do OneDrive, iCloud e Dropbox.

Faça isto, nesta ordem:
1. Clone o repositório nessa pasta. Se a pasta já existir, entre nela e atualize com git pull.
2. Rode npm run instalar.
3. Se faltar node, python ou ffmpeg, instale (winget no Windows, brew no Mac) e rode npm run instalar de novo.
4. A pasta projetos/ vem vazia de propósito. Crie projetos/001. video/video/ se ela ainda não existir.
5. Me diga o caminho completo dessa pasta e pare.

Diga só isto para a pessoa: coloca o seu vídeo nessa pasta (MP4 ou MOV, já cortado) e abre uma sessão nova do Claude dentro da pasta studio. Coisas novas só aparecem numa sessão nova.

Não crie outro projeto de vídeo do zero. O estúdio já está neste repositório: siga o CLAUDE.md e o guias/0-video-curto.md.
```

Na sessão nova, avise que o vídeo está lá. O Claude pergunta o nome, mostra 4 linhas, espera um "pode", edita e pergunta se você quer mudar alguma coisa.

## Créditos

Este projeto parte do estúdio de Macks Wendhell (licença MIT, arquivo [LICENSE](LICENSE)). As imagens em `estilos/imagens/` que vêm do canal dele são só referência. A edição do seu vídeo roda no seu computador, com [Remotion](https://www.remotion.dev).
