# Studio

Edição de vídeo curto para quem não é editor: você grava, o Claude edita no seu computador e entrega um MP4 vertical (1080×1920) no padrão do seu Instagram.

## Como começar

Abra o app do Claude para computador, vá na aba **Code**, cole o texto abaixo inteiro e envie. Você não precisa entender o texto: o Claude executa.

```text
Claude, instale o estúdio de vídeo curto no meu computador e depois comece a conversa sobre a minha marca. Fale comigo em português simples, um passo por vez.
1. Se faltar o git, instale (Windows: winget install Git.Git; Mac: xcode-select --install).
2. Baixe https://github.com/PedroGama24/studio.git numa pasta chamada "Edição de Vídeo", dentro de Documentos. Se Documentos estiver no OneDrive ou no iCloud, crie a pasta na pasta do usuário. Se ela já existir, não apague nada.
3. Abra o arquivo INSTALAR.md dessa pasta e siga tudo o que ele diz.
```

## O que acontece depois

1. **Análise do Instagram.** O Claude conversa com você, uma pergunta por vez, olha seu perfil no navegador do app e anota o padrão do seu conteúdo. Você entra no Instagram você mesmo: ele nunca pede senha.
2. **Conversa nova na pasta do estúdio.** No fim da análise, o Claude pede para você abrir uma conversa nova dentro da pasta **Edição de Vídeo** (na aba **Code**, escolha a pasta **Edição de Vídeo**). É nela que as ferramentas de edição aparecem.
3. **"Quero editar um vídeo".** Diga isso, ponha o vídeo na pasta que o Claude indicar e aprove as 4 linhas do visual. O vídeo pronto sai em `edicoes/`.

## O que você precisa

- App do Claude para computador, com o plano Pro.
- Windows ou Mac.

## Créditos

Este projeto parte do estúdio de Macks Wendhell (licença MIT, arquivo [LICENSE](LICENSE)). A edição roda no seu computador, com [Remotion](https://www.remotion.dev).
