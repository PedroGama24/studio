# Primeiros passos

Este guia cuida só da instalação. Leva uns 20 minutos, a maior parte esperando. Se você usa o app do Claude, o prompt do [README](../README.md) já faz tudo isto sozinho.

---

## 1. O que você precisa

| Item | Para quê | Obrigatório? |
|---|---|---|
| **Claude** com acesso ao Claude Code (plano Pro ou Max) | é o seu diretor de vídeo | sim |
| **Node.js** 22.18 ou mais novo (o ideal é a 24) | roda o Remotion | sim |
| **Python** 3.10 ou mais novo | transcrição e skill `watch` | sim |
| **FFmpeg** | lê e converte vídeo | sim |
| **Git** | baixar e atualizar este repositório | sim |

Você pode usar o Claude de três jeitos. Todos funcionam com este repositório:

- **Claude Desktop, aba Code** (mais simples, sem terminal);
- **Claude Code no VS Code** (extensão);
- **Claude Code no terminal** (comando `claude`).

> A skill `watch` **não funciona no Cowork nem no chat comum** do Claude. Use sempre uma sessão **Code**.

## 2. Instalar os programas

### Windows

Abra o **PowerShell** e rode, um por vez:

```powershell
winget install --id OpenJS.NodeJS.LTS --exact
winget install --id Python.Python.3.12 --exact
winget install --id Gyan.FFmpeg --exact
winget install --id yt-dlp.yt-dlp --exact
winget install --id Git.Git --exact
```

Feche e abra o PowerShell de novo e confira:

```powershell
node --version
python --version
ffmpeg -version
```

### macOS

Instale o [Homebrew](https://brew.sh) e rode:

```bash
brew install node python ffmpeg yt-dlp git
```

## 3. Baixar o Studio e instalar tudo

### Jeito fácil: peça ao Claude

Abra uma sessão **Code** no Claude e cole o prompt do [COMECE.md](../COMECE.md). Ele clona, instala as dependências e as duas skills gratuitas (**remotion-best-practices** e **watch**). Quando terminar, **abra uma sessão nova** do Claude dentro da pasta `studio`: skills novas só aparecem numa sessão nova.

### Jeito manual

Escolha uma pasta **fora** do OneDrive, iCloud ou Dropbox (a sincronização atrapalha o render). Por exemplo, `C:\dev` no Windows ou `~/dev` no Mac.

```bash
cd C:\dev
git clone https://github.com/PedroGama24/studio.git
cd studio
npm run instalar
```

O `npm run instalar` faz tudo de uma vez: dependências do Remotion, transcrição local (`faster-whisper`), skill `remotion-best-practices` (dentro do projeto) e skill `watch`. No fim ele mostra um resumo do que deu certo e do que falhou.

Teste o Remotion:

```bash
npm run studio
```

Abre uma página no navegador com os exemplos da galeria. Se você vê as composições em `Estilos` e consegue dar play, está tudo certo. Feche com `Ctrl+C` no terminal.

## 4. Sobre as skills gratuitas

Skills são pacotes de conhecimento que o Claude carrega quando precisa. O `npm run instalar` já instala as duas:

- **`watch`**: assiste vídeos, extrai quadros e transcreve ([bradautomates/claude-video](https://github.com/bradautomates/claude-video));
- **`remotion-best-practices`**: boas práticas do Remotion ([remotion-dev/skills](https://github.com/remotion-dev/skills)).

Usa só o Claude Desktop, sem o comando `claude` no terminal? A `watch` está declarada no projeto (`.claude/settings.json`), então o Claude oferece instalá-la ao abrir a pasta: aceite. Se não aparecer, instale à mão em **Personalizar → Plugins → Adicionar → Adicionar marketplace → Adicionar de um repositório**, cole `https://github.com/bradautomates/claude-video`, clique em **Sincronizar** e instale **Watch**.

## 5. (Opcional) Chave gratuita da Groq

A `watch` pode usar a Groq para transcrever rápido. É grátis dentro de um limite generoso.

1. Crie a chave em [console.groq.com/keys](https://console.groq.com/keys).
2. Salve como variável de ambiente:
   - Windows: `[Environment]::SetEnvironmentVariable("GROQ_API_KEY", "sua-chave", "User")`
   - Mac: adicione `export GROQ_API_KEY="sua-chave"` ao `~/.zshrc`.
3. Reabra o Claude.

Sem essa chave tudo funciona igual: o `tools/transcrever.py` transcreve localmente, de graça.

---

## 6. Primeira conversa

Depois de instalar, abra uma sessão **Code** na pasta `studio` e peça "quero conversar sobre a minha marca". Quando a análise terminar, abra uma conversa nova na mesma pasta e diga "quero editar um vídeo". O vídeo pronto sai em `edicoes/`.
