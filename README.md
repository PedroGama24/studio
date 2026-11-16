# Studio

Edição de vídeo curto para quem não é editor: você grava, o Claude edita no seu computador e entrega um MP4 vertical (1080×1920) no padrão do seu Instagram.

## Como começar

Abra o app do Claude para computador, vá na aba **Code**, cole o texto abaixo inteiro e envie. Você não precisa entender o texto: o Claude executa.

```text
Claude, instale o estúdio de vídeo curto e comece a conversa sobre a minha marca agora, nesta mesma conversa.

Repositório: https://github.com/PedroGama24/studio.git
Pasta: C:\dev\studio no Windows, ou ~/dev/studio no Mac. Fora do OneDrive, iCloud e Dropbox.

Faça nesta ordem:
1. Se faltar git, node, python ou ffmpeg, instale (winget no Windows, brew no Mac).
2. Clone o repositório nessa pasta. Se a pasta já existir, entre nela e rode git pull.
3. Dentro da pasta, rode npm run instalar.
4. Leia <pasta>/.claude/skills/minha-marca/SKILL.md e siga agora, nesta conversa. Não crie outro projeto de vídeo: o estúdio já está neste repositório.
```

## O que acontece depois

1. **Análise do Instagram.** O Claude conversa com você, uma pergunta por vez, olha seu perfil no navegador do app e anota o padrão do seu conteúdo. Você entra no Instagram você mesmo: ele nunca pede senha.
2. **Conversa nova na pasta do estúdio.** No fim da análise, o Claude pede para você abrir uma conversa nova dentro da pasta `studio`. É nela que as ferramentas de edição aparecem.
3. **"Quero editar um vídeo".** Diga isso, ponha o vídeo na pasta que o Claude indicar e aprove as 4 linhas do visual. O vídeo pronto sai em `edicoes/`.

## O que você precisa

- App do Claude para computador, com o plano Pro.
- Windows ou Mac.

## Créditos

Este projeto parte do estúdio de Macks Wendhell (licença MIT, arquivo [LICENSE](LICENSE)). A edição roda no seu computador, com [Remotion](https://www.remotion.dev).
