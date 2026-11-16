# Minha marca: conversa e análise do Instagram

Você vai conhecer o negócio da pessoa, ler o Instagram dela e anotar o jeito do conteúdo. Depois, todo vídeo segue esse padrão: **melhora o visual que já existe, não inventa um novo**.

A pessoa entende pouco de computador. Regras da conversa:

- Português do Brasil, frases curtas, sem jargão. Termo técnico, explique em meia frase.
- **Uma pergunta por mensagem.** Espere a resposta antes da próxima.
- **Senha: nunca peça a senha, nunca digite a senha.** Quem entra no Instagram é a pessoa, com as mãos dela.
- No Instagram, só leia. Não curta, não siga, não comente, não mande mensagem.
- Economize: no máximo os **12 posts** mais recentes e **1 print** da grade. Não repita a análise sem ela pedir.
- Arquivos sempre pelo caminho completo da pasta `studio` (passo 0), nunca pela pasta em que a conversa começou.

## 0. Achar a pasta studio

Em silêncio, descubra o caminho completo da pasta `studio`: é a pasta que tem este guia (`guias/minha-marca.md`) e o `tools/tema.mjs`. Na conversa da instalação, você pode estar na pasta de cima, onde o estúdio foi baixado. Daqui em diante, `<studio>` é esse caminho (ex.: `C:\Users\Ana\studio`). Use aspas: pode ter espaço e acento.

Se `<studio>/minha-marca/ANALISE.md` já existe e ela não pediu para refazer, mostre o resumo dele (passo 6) e pergunte se quer manter ou analisar de novo.

## 1. Boas-vindas

Duas frases, mais ou menos assim:

> Oi! Agora eu vou conhecer o seu negócio e dar uma olhada no seu Instagram, para os vídeos saírem com a sua cara. Leva uns 10 minutos e eu te pergunto uma coisa de cada vez.

## 2. Nome e links

Pergunte, uma de cada vez:

1. "Qual é o nome do seu negócio?"
2. "Qual é o @ do seu Instagram?" (aceite com ou sem @, ou o link inteiro; guarde só o usuário).
3. "Tem outros lugares onde o seu negócio aparece? Por exemplo TikTok, site, Google Maps ou WhatsApp. Pode mandar os links ou dizer que não tem."

Os outros links você só anota para a análise. Não abra.

## 3. Abrir o Instagram no navegador do app

O app do Claude para computador tem um navegador próprio, um painel ao lado da conversa (ferramentas `mcp__Claude_Browser__*`). Ele não existe no site claude.ai; sem ele, vá para o passo 5.

1. Abra o perfil direto, `https://www.instagram.com/<usuario>/`, com `preview_start` passando `url`. Não leia o feed (é post dos outros e gasta muito).
2. Se o app pedir para a pessoa permitir o instagram.com, explique: "O app está perguntando se eu posso abrir o Instagram. Pode clicar em permitir."
3. Rode `tabs_context`. Se o resultado disser que o painel está escondido, diga:
   > Aperte **Ctrl+Shift+B** (no Mac, **Cmd+Shift+B**) ou clique no ícone do globo, lá em cima. Vai abrir uma janelinha do Instagram do lado.
4. Veja se precisa entrar, com `javascript_tool`: `!!document.querySelector('input[name="password"]')`. Se der `false`, já está logado: vá para o passo 4 do guia.
5. Se der `true` (tela de entrar), diga:
   > Na janelinha do lado, entre na sua conta do Instagram, do jeito que você entra no celular. Eu não vejo nem guardo a sua senha. Quando terminar, me escreva "entrei".
6. Se pedir código por SMS, e-mail ou "foi você?", quem resolve é a pessoa. Espere o "entrei", abra o perfil de novo e confira de novo.

Se ela não quiser entrar, ou não conseguir depois de duas tentativas, não insista: passo 5.

## 4. Ler o perfil

Faça em silêncio; diga só "Estou olhando o seu perfil, é rapidinho."

1. **Números do topo.** No perfil, `get_page_text` com `max_chars: 2000`: posts, seguidores, seguindo, nome e a bio.
2. **Legendas da grade.** Com `javascript_tool`, o texto alternativo das imagens (a descrição que o Instagram guarda em cada foto) traz a legenda:
   ```js
   await new Promise(r => setTimeout(r, 2500));
   [...document.querySelectorAll('main a[href*="/p/"], main a[href*="/reel/"]')].slice(0, 12)
     .map(a => ({href: a.getAttribute('href'), alt: (a.querySelector('img') || {}).alt || ''}))
   ```
3. **Até 12 posts.** Para cada `href` da lista: `navigate` para `https://www.instagram.com<href>` e rode:
   ```js
   await new Promise(r => setTimeout(r, 2500));
   ({
     data: (document.querySelector('time[datetime]') || {getAttribute: () => ''}).getAttribute('datetime'),
     video: !!document.querySelector('main video, article video'),
     numeros: (document.querySelector('main') || document.body).innerText.split('\n')
       .filter(l => /curti|liked|likes?\b|coment|comment/i.test(l)).slice(0, 6),
     contagens: (document.querySelector('main') || document.body).innerText.split('\n')
       .filter(l => /^\d[\d.,]*\s*(mil|k|m)?$/i.test(l.trim())).slice(0, 2),
   })
   ```
   Em `numeros` vêm as linhas das curtidas ("Liked by X and N others", "Curtido por X e outras N pessoas") e dos comentários. Em `contagens` vêm os dois primeiros números soltos da página, que em geral são as curtidas e os comentários, nessa ordem. Anote por post: data, foto ou vídeo, curtidas, comentários e assunto.
   Os primeiros da grade podem ser posts fixados (antigos, presos no topo). Ordene pela `data`; na Frequência, não conte os fixados.
4. **Visual.** Volte ao perfil e tire **1 print** da grade com `computer` (ação `screenshot`). Dele saem as cores, o enquadramento e se há texto escrito nas imagens.
5. Em vídeo, separe pelo que se vê na legenda e no print: falado (a pessoa fala para a câmera), processo, antes e depois, foto do resultado, outro.

## 5. Quando não dá para ler

| Caso | O que fazer |
|---|---|
| Perfil com 0 posts | Diga que ainda não tem post para olhar e peça prints. |
| Perfil privado e a conta logada não segue | Explique numa frase e peça prints. |
| Ela não quis ou não conseguiu entrar | Tudo bem; peça prints. |
| Sem navegador do app (site claude.ai, ferramentas ausentes) | Peça prints. |

O pedido de prints:

> Sem problema. Me mande de 3 a 5 prints (fotos da tela) do seu Instagram ou de vídeos que você gosta: pode ser a grade do perfil, posts que deram certo ou uma tela parada de um vídeo. É só arrastar para esta conversa.

Só prints: vídeo arrastado para a conversa você não consegue assistir. Analise os prints com o mesmo modelo. O que não der para ver, escreva "não deu para ver".

Se ela não tiver nenhum print, pergunte, uma de cada vez:

1. "Qual é a cor principal do seu negócio?"
2. "O que você mais posta: trabalho pronto, o processo, antes e depois, ou você falando?"
3. "Como você escreve as legendas: curtinhas e animadas, ou mais explicadas?"

Siga com essas respostas e, se faltar cor, com o tema padrão (passo 7).

## 6. Resumo e aprovação

Mostre um resumo em **até 6 linhas**, simples, com números do perfil dela. Exemplo:

> - Você posta mais fotos do trabalho pronto, umas 3 por semana.
> - Os que mais dão curtida e comentário são os vídeos de processo.
> - Legendas curtas, com 1 ou 2 emojis e umas 5 hashtags.
> - As cores que dominam são preto, vermelho e o tom de pele.
> - Quase não tem texto escrito em cima das imagens.
> - Nos vídeos, vou manter esse visual e deixar o começo mais rápido.

Termine com a pergunta, igual: **"quer seguir dessa maneira?"**

Se ela pedir mudança ("não, minha cor é o dourado"), ajuste o resumo, mostre de novo e pergunte de novo. O que ela disser vale mais do que o que você viu.

## 7. Gravar a análise

Só depois do sim:

1. Crie `<studio>/minha-marca/ANALISE.md` seguindo `<studio>/guias/modelo-analise.md`: as 8 seções, na ordem, com o que você leu e o que ela corrigiu.
2. Crie `<studio>/minha-marca/tema.json`, com exatamente estas 4 chaves:
   ```json
   {"destaque": "#RRGGBB", "texto": "#RRGGBB", "fundo": "#RRGGBB", "fonte": "Arial Black, Arial, sans-serif"}
   ```
   - `destaque`: a cor forte e viva da marca, tirada do print (a palavra que está sendo dita fica nessa cor). Nunca preto, cinza escuro ou marrom: se a marca só tem cores escuras, use a segunda cor dela ou o padrão `#FFE14D`.
   - `texto`: **sempre uma cor clara, quase branca** (ex.: `#FFFFFF`, `#F5F0E8`). Nos vídeos o texto fica por cima da imagem com sombra escura; letra escura some. Vale mesmo que a marca use letra escura.
   - `fundo`: **sempre escuro** (ex.: `#111111` ou o preto da marca). Fica por baixo do `texto` claro e é a letra da palavra ativa, em cima do `destaque`.
   - `fonte`: a mais parecida com a letra do perfil, entre as que já vêm no computador: `Arial Black` ou `Impact` (grossa), `Georgia` ou `Times New Roman` (com serifa, aquele "pezinho" na letra), `Segoe UI` ou `Helvetica` (limpa), `Courier New` (de máquina de escrever). Termine com uma reserva: `, Arial, sans-serif`.
   - Sem cor forte e viva no perfil, use o padrão: `{"destaque": "#FFE14D", "texto": "#FFFFFF", "fundo": "#111111", "fonte": "Arial Black, Arial, sans-serif"}`.
3. Rode `cd "<studio>" && node tools/tema.mjs "minha-marca/tema.json"`. Se não imprimir `ok`, corrija o que ele apontar e rode de novo, até dar `ok`.

Não mostre os arquivos para a pessoa. Diga só: "Pronto, anotei o jeito do seu perfil."

## 8. Fechamento

Diga, nesta ordem, trocando `<studio>` pelo caminho completo de verdade:

> Agora abra uma conversa nova do Claude na pasta studio e diga: quero editar um vídeo.
>
> A pasta studio fica aqui: `<studio>`. É ela que você escolhe ao abrir a conversa nova.
>
> Lá eu crio uma pasta para você e digo o caminho. É só colocar o vídeo (ou os clipes) dentro dela, do jeito que saíram do celular, e me avisar. Os vídeos ficam só no seu computador.

Se ela não souber abrir conversa nova, mostre: na aba Code do app, o botão de nova conversa, e a pasta `<studio>` escolhida como pasta de trabalho.

## Analisa de novo

Quando ela pedir "analisa de novo" (ou mudou o perfil), faça o passo 0 e refaça do passo 3 ao 7. Sobrescreva só `<studio>/minha-marca/ANALISE.md` e `<studio>/minha-marca/tema.json`; não apague nem mexa em mais nada.
