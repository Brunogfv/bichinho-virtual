"# Bichinhos Virtuais

Um jogo estilo *Tamagotchi* para navegador, onde você escolhe, cuida e acompanha a evolução de um bichinho virtual.

## Sobre o jogo

Neste jogo você adota um bichinho e cuida dele mantendo seus status equilibrados. O bichinho envelhece com o tempo, evolui de estágio e precisa de atenção constante para não adoecer ou morrer.

## Como jogar

1. Abra `index.html` no navegador ou publique no GitHub Pages.
2. Escolha um bichinho entre as opções disponíveis.
3. Dê um nome ao seu pet.
4. Use as ações para manter as barras em níveis saudáveis.

## Ações disponíveis

- `ALIMENTAR` 🍖: reduz a fome e aumenta um pouco a felicidade.
- `BRINCAR` 🎾: aumenta felicidade, mas consome energia e deixa o bichinho com mais fome.
- `DORMIR` 💤: repõe energia e felicidade lentamente.
- `LIMPAR` 🛁: aumenta a higiene e melhora o humor.
- `REMEDIAR` 💊: recupera vida quando o pet está doente.
- `NOVO` 🔄: reinicia com um novo bichinho.

## Status do bichinho

O seu pet possui cinco barras principais:

- Fome: se ficar muito alto, o pet fica doente e perde saúde.
- Felicidade: é essencial para evitar tristezas e mau humor.
- Energia: quando zerar, o bichinho cai no sono automaticamente.
- Higiene: ficar baixo demais também prejudica a saúde.
- Saúde: representa a vitalidade geral e é afetada por todos os outros status.

## Evolução e estágios

O bichinho passa por estágios conforme a idade:

- Ovo
- Filhote
- Adulto
- Velhinho

Cada estágio altera a aparência do sprite e pode liberar novos comportamentos visuais.

## Tipos de bichinhos

Você pode escolher entre diversas espécies com estilos únicos:

- Florinho (Planta)
- Gotinho (Água)
- Foguinho (Fogo)
- Nuvinha (Ar)
- Coelhop (Mágico)

Cada um tem cor e temática diferentes.

## Sistema de progresso

- O jogo salva automaticamente o estado do bichinho no `localStorage` do navegador.
- Você pode retomar o pet salvo quando reabrir o jogo.
- Ao morrer, o bichinho é registrado nos `Recordes` com idade e estatísticas.

## Minigame avançado

O jogo inclui um minigame de coleta de itens:

- Toque em itens bons para ganhar pontos.
- Evite itens ruins para não perder pontuação.
- O minigame só pode ser usado com o bichinho acordado e com energia suficiente.

## Como rodar

### Localmente

- Abra o arquivo `index.html` no navegador.

### No GitHub Pages

1. Faça push do projeto para um repositório GitHub.
2. Vá em `Settings > Pages` no repositório.
3. Selecione `Branch: main` e `Root`.
4. Salve para publicar.

## Estrutura do projeto

- `index.html` — o jogo completo em uma única página.
- `README.md` — este guia.
- `planejamento_bichinho_virtual.pdf` — design e planejamento do projeto.

## Dicas de jogabilidade

- Use `ALIMENTAR` antes que a fome chegue a níveis críticos.
- Deixe o bichinho dormir quando a energia estiver baixa.
- Remova doenças com `REMEDIAR` assim que a saúde cair.
- Verifique os `Recordes` para comparar suas melhores partidas.

## Contato

Se quiser melhorar o jogo, você pode editar `index.html` adicionando novos bichinhos, efeitos sonoros ou recursos de progressão.
" 
