# Instalar o estúdio (instruções para o Claude)

Quem colou o prompt do README pode entender pouco de computador. Este arquivo é para você, Claude, seguir agora, na mesma conversa.

## Como falar com a pessoa

- Português simples, frases curtas, sem jargão.
- Antes de cada passo, diga em uma frase o que vai acontecer.
- Avise logo no começo: "A instalação leva uns 20 minutos. O Windows e o app vão pedir permissão algumas vezes: é só clicar em Sim ou Permitir."
- Se algo falhar, explique em uma frase o que foi e tente consertar sozinho antes de pedir ajuda.

## A pasta

O estúdio fica numa pasta chamada **Edição de Vídeo**. Daqui em diante, `<pasta>` é o caminho completo dela. Use sempre aspas: tem espaço e acento.

- **Windows:** veja onde fica Documentos com `[Environment]::GetFolderPath('MyDocuments')`. Se o caminho tiver `OneDrive`, use `$env:USERPROFILE\Edição de Vídeo`. Se não tiver, use `Documentos\Edição de Vídeo`.
- **Mac:** se existir `~/Library/Mobile Documents/com~apple~CloudDocs/Documents` (Documentos no iCloud), use `~/Edição de Vídeo`. Se não existir, use `~/Documents/Edição de Vídeo`.

Motivo: o OneDrive e o iCloud tentam sincronizar milhares de arquivos do estúdio e os vídeos, lotam o espaço grátis e deixam o render lento.

Se o prompt já baixou o estúdio em Documentos e Documentos está no OneDrive ou no iCloud, mova a pasta inteira para o lugar certo antes do passo 3 (ainda não há nada pesado nela).

## Passos

1. **Programas.** Confira `git`, `node`, `python` e `ffmpeg` com `--version`. No Windows, o `python` da Microsoft Store não conta: trate como faltando. Instale o que faltar:
   - Windows, com winget: `Git.Git`, `OpenJS.NodeJS.LTS`, `Python.Python.3.12`, `Gyan.FFmpeg`.
   - Mac, com brew: `brew install node python ffmpeg git`. Se faltar o Homebrew, instale antes.

   Depois de instalar, atualize o PATH da sessão ou chame pelo caminho completo. Se ainda não achar, peça para a pessoa fechar e abrir o app e colar o prompt de novo: pode repetir sem medo.

2. **Estúdio em dia.** Se `<pasta>` já é o estúdio (tem este arquivo e uma pasta `.git`), rode `git pull` dentro dela. Se o pull falhar, não apague nada: renomeie para `Edição de Vídeo (antiga)` e baixe de novo com `git clone https://github.com/PedroGama24/studio.git "<pasta>"`.

3. **Dependências.** Dentro de `<pasta>`, rode `npm run instalar`. Leva vários minutos. Se terminar com `Falhou:`, leia a lista e tente consertar o que der (veja `guias/1-primeiros-passos.md`). Se só a `watch` ou algo opcional falhou, siga em frente.

4. **Fácil de achar.** No Windows, fixe a pasta no Acesso rápido do Explorador de Arquivos:

   ```powershell
   (New-Object -ComObject Shell.Application).Namespace("<pasta>").Self.InvokeVerb('pintohome')
   ```

   No Mac, abra a pasta com `open "<pasta>"` e peça para a pessoa arrastar a pasta para a barra lateral do Finder.

   Diga à pessoa, em uma frase, onde a pasta ficou.

5. **Minha marca.** Daqui em diante, rode todos os comandos dentro de `<pasta>` e grave os dados da marca lá. Leia `<pasta>/.claude/skills/minha-marca/SKILL.md` e siga agora, nesta conversa. Não crie outro projeto de vídeo: o estúdio já está nesta pasta.
