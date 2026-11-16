# Começar

Abra o app do Claude para computador, vá na aba **Code**, cole o texto abaixo inteiro e envie. Você não precisa entender o texto: o Claude executa.

```text
Claude, instale o estúdio de vídeo curto e, ao terminar, comece a conversa sobre a minha marca nesta mesma conversa.

Como falar comigo: português simples, frases curtas. Antes de cada passo, diga em uma frase o que vai acontecer. Avise que o Windows e o app vão pedir permissão (clique em Sim ou Permitir) e que a instalação leva vários minutos.

Repositório: https://github.com/PedroGama24/studio.git
Pasta: C:\dev\studio no Windows, ou ~/dev/studio no Mac. Fora do OneDrive, iCloud e Dropbox.

Faça nesta ordem:
1. Confira git, node, python e ffmpeg com --version (no Windows, o "python" da Microsoft Store não conta: trate como faltando). Instale o que faltar: winget no Windows (Git.Git, OpenJS.NodeJS.LTS, Python.Python.3.12, Gyan.FFmpeg) ou brew no Mac (instale o Homebrew antes, se faltar; o git pode abrir uma janela de ferramentas do Mac). Depois de instalar, atualize o PATH da sessão ou chame pelo caminho completo. Se ainda não achar, peça para eu fechar e abrir o app e colar este texto de novo (pode repetir sem medo).
2. Clone o repositório nessa pasta. Se ela já existir, rode git pull. Se o pull falhar ou a pasta não for o repositório, não apague nada: renomeie a pasta para studio-antigo e clone de novo.
3. Dentro da pasta, rode npm run instalar. Se terminar com "Falhou:", leia a lista e tente de novo o que der para consertar (veja guias/1-primeiros-passos.md). Se só a watch ou algo opcional falhou, siga em frente.
4. Daqui em diante, rode todos os comandos dentro da pasta e salve os dados da marca lá. Leia <pasta>/.claude/skills/minha-marca/SKILL.md e siga agora, nesta conversa. Não crie outro projeto de vídeo: o estúdio já está neste repositório.
```

Depois da análise do seu Instagram, abra uma conversa nova na aba **Code**, escolha a pasta `studio` e diga "quero editar um vídeo".
