# Psiconometria — Website (exportação estática)

Este repositório contém o código completo do website **Psiconometria**
(www.psiconometria.com), exportado em **HTML/CSS/JavaScript puro (vanilla)**,
preservando 100% do conteúdo editorial de todas as páginas.

A exportação foi gerada a partir do projeto React + Vite + Tailwind original
(apps/web) e convertida para arquivos estáticos para facilitar a hospedagem
em qualquer servidor (GitHub Pages, Netlify, Vercel, Hostinger, etc.) e
edições futuras no formato HTML.

## Estrutura

```
static-site/
├── index.html                 # Início (hero, equação, fluxo, convergências, matriz demo, caso, CTAs)
├── o-que-e.html               # O que é Psiconometria (origens, diagrama de duas camadas, distinções)
├── as-duas-disciplinas.html    # 10 psicometria + 10 econometria + 10 convergências (interativo)
├── catalogo.html              # Catálogo de 40+ avaliações em 11 famílias (filtros + busca)
├── matriz.html                # Matriz Pessoas × KPIs (16 fatores, cadeias de mecanismos)
├── laboratorio.html           # Simulador de impacto (7 premissas editáveis, 3 cenários)
├── casos.html                 # 5 casos reais com fontes e limitações (Aristotle, Oxygen, Q12, OECD, Microsoft)
├── metodo.html                # Método em 7 etapas + exemplo de retrabalho
├── glossario.html             # 24 termos técnicos com exemplos empresariais (busca)
├── sobre.html                 # Manifesto, princípios, ética, contato
├── assets/
│   ├── styles.css             # Design system (Archivo + Newsreader, paleta grafite/marfim/petróleo/teal/âmbar)
│   ├── data.js                # Todo o conteúdo editorial (disciplinas, métodos, fatores, casos, glossário)
│   └── app.js                 # Header/footer compartilhados + toda a interatividade
├── sitemap.xml
└── robots.txt
```

## Como usar

### Visualizar localmente
Abra `static-site/index.html` diretamente no navegador, **ou** sirva a pasta
por um servidor estático (recomendado, para que os caminhos relativos e o
`fetch` funcionem plenamente):

```bash
cd static-site
python3 -m http.server 8080   # ou: npx serve
```

Depois acesse http://localhost:8080

### Publicar no GitHub Pages
1. Crie um repositório no GitHub (ex.: `psiconometria-site`).
2. Copie o conteúdo de `static-site/` para a raiz do repositório.
3. Faça commit e push.
4. Em **Settings → Pages**, escolha a branch (ex.: `main`) e a pasta `/root`.
5. O site ficará em `https://<usuario>.github.io/psiconometria-site/`.

> Se publicar num subcaminho, os links relativos continuam funcionando.

### Publicar em hospedagem própria (Hostinger, Netlify, Vercel)
Basta enviar os arquivos de `static-site/` para a pasta pública
(`public_html` ou equivalente). Não há build, dependências nem servidor
de aplicação — é HTML estático.

## Conteúdo preservado

Todo o conteúdo do site React original foi migrado 1:1:

- **10 páginas** com navegação completa (header + footer + menu mobile).
- **Equação interativa** Psicometria + Econometria = Psiconometria.
- **Fluxo animado** Pessoas → Comportamentos → Relações → Processos → Indicadores → Valor.
- **30 fundamentos** (10 psicometria, 10 econometria, 10 convergências) com definição, exemplo, método, decisão, limitações e evidência.
- **Catálogo** com 40+ métodos em 11 famílias, 6 filtros + busca, cards que alternam potencial/risco.
- **Matriz** com 16 fatores humanos × 17 KPIs, cadeias de 5 etapas, impactos positivo/negativo, moderadores, prazo, dados, evidência.
- **Simulador** com 7 premissas editáveis, 3 cenários com faixas de incerteza, sensibilidade e plano de teste.
- **5 casos reais** (Google Aristotle/Oxygen, Gallup Q12, OECD, Microsoft) com problema, hipótese, dados, método, intervenção, resultados, limitações, aprendizado e link para fonte.
- **Método** em 7 etapas + exemplo de retrabalho com 13 verificações prévias.
- **Glossário** com 24 termos e busca.
- **Sobre**: manifesto, princípios metodológicos, política de fontes, ética/LGPD, formulário de contato.
- **Imagens** editoriais (hostinger.com) mantidas nos mesmos slots.

## Diferenças em relação ao app React original

- **Sem backend**: o formulário de contato e a newsletter são apenas
  demonstrativos (mostram confirmação no front-end). No app original eles
  gravavam numa coleção PocketBase. Para recuperar persistência, conecte um
  backend (Formspree, Netlify Forms, PocketBase, etc.).
- **Sem React/roteador**: navegação por páginas HTML separadas (links
  relativos), em vez de SPA.
- **Interatividade em vanilla JS**: filtros, simulador, tabs e busca
  reescritos em JavaScript puro, preservando os mesmos comportamentos.

## Identidade visual

- **Tipografia**: Archivo (interface/dados) + Newsreader (títulos editoriais).
- **Paleta**: grafite profundo, marfim quente, areia, azul petróleo, azul
  cobalto, verde teal, âmbar, coral.
- **Princípios**: rigor acadêmico + clareza de ferramenta empresarial +
  sensibilidade humana + sofisticação editorial.

## Fontes de referência

APA · AERA/APA/NCME · CFP/SATEPSI · OECD · World Bank · Google re:Work ·
Gallup · Our World in Data.

---

© Psiconometria — conceito autoral em desenvolvimento. Não é uma ciência
oficialmente reconhecida nem uma disciplina acadêmica consolidada.
