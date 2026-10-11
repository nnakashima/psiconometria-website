# Psiconometria — Website (estático)

Site **Psiconometria** (www.psiconometria.com) em **HTML/CSS/JavaScript puro**,
sem build e sem dependências. Contém 100% do conteúdo editorial da versão
React (`apps/web`), redesenhado como um relatório técnico: papel branco,
tinta preta, um único acento em vermelho, figuras numeradas e notação matemática.

## Estrutura

```
static-site/
├── index.html                 # Home: equação, conceito, exemplo didático, por que importa, dores, demonstração, limites, como começar
├── o-que-e.html               # O conceito (origens, diagrama de duas camadas, distinções)
├── as-duas-disciplinas.html   # 10 psicometria + 10 econometria + 10 convergências (links diretos por #id)
├── catalogo.html              # 49 avaliações em 11 famílias (6 filtros + busca)
├── matriz.html                # Matriz Pessoas × KPIs (16 fatores × 17 KPIs)
├── laboratorio.html           # Simulador de impacto (7 premissas, 3 cenários)
├── casos.html                 # 5 casos reais com fontes e limitações
├── metodo.html                # Método em 7 etapas + exemplo do retrabalho
├── glossario.html             # 24 termos com busca
├── sobre.html                 # Manifesto, princípios, ética, contato
├── assets/
│   ├── styles.css             # Sistema visual (tokens no :root)
│   ├── data.js                # Conteúdo editorial estruturado (inalterado em relação ao React)
│   ├── content.js             # Textos das páginas: equação, exemplo, dores, distinções, etapas, princípios
│   ├── app.js                 # Cabeçalho, rodapé, interatividade e envio de formulários
│   ├── config.js              # Endereço do serviço de formulários (API_BASE)
│   ├── favicon.svg
│   └── fonts/                 # Hanken Grotesk e STIX Two (SIL Open Font License), hospedadas localmente
├── sitemap.xml
└── robots.txt
```

## Onde editar

- **Textos estruturados** (métodos, fatores, casos, glossário, disciplinas): `assets/data.js`.
- **Textos da home e das páginas** (dores, exemplo, equação, etapas do método, princípios): `assets/content.js`.
- **Textos fixos de cada página** (títulos, introduções): direto no `.html`.
- **Cores e tipografia**: variáveis no início de `assets/styles.css`.

## Formulários (contato e newsletter)

Os formulários enviam para o serviço em `services/contact-api`, que entrega por
e-mail via Resend. Depois de publicar esse serviço (instruções no README dele),
coloque o endereço em `assets/config.js`:

```js
window.PSICO_CONFIG = { API_BASE: 'https://psiconometria-contato.up.railway.app' };
```

Enquanto `API_BASE` estiver vazio, os formulários mostram a mensagem de erro de
envio, em vez de fingir que a mensagem foi registrada.

## Visualizar localmente

```bash
cd static-site
python3 -m http.server 8080   # ou: npx serve
```

Depois acesse http://localhost:8080

## Publicar

Envie o conteúdo de `static-site/` para a pasta pública da hospedagem
(Hostinger, Netlify, Vercel, GitHub Pages ou um serviço estático no Railway).
Não há build. Os links são relativos, então funcionam também em subcaminhos.

## Diferenças em relação à versão React

- **Fotos removidas.** As três fotos de banco de imagem (hospedadas em
  images.hostinger.com) deram lugar a figuras técnicas: equação, fluxo,
  gráfico de dispersão e diagrama de camadas. As legendas das páginas Casos e Sobre foram mantidas como texto.
- **Conteúdo novo na home:** equação explicada termo a termo, exemplo didático
  com dados fictícios (24 equipes), "por que importa" e sete dores com primeiro passo.
- **Catálogo:** passa a mostrar também o campo "mecanismo até o KPI", que já
  existia nos dados mas não aparecia em nenhuma versão.
- **Nível de evidência** em escala de quatro marcas, legível sem depender de cor.

## Fontes de referência

APA, AERA/APA/NCME, CFP/SATEPSI, OECD, World Bank, Google re:Work, Gallup,
Our World in Data.

---

© Psiconometria — conceito autoral em desenvolvimento. Não é uma ciência
oficialmente reconhecida nem uma disciplina acadêmica consolidada.
