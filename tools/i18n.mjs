// Psiconometria — internacionalização do site estático.
//
// O português (static-site/*.html e assets/*.js) é a única fonte. Os dicionários
// i18n/<lang>.json mapeiam "texto em português" → "tradução". Este script:
//
//   node tools/i18n.mjs extract   → gera i18n/source.json (todos os textos traduzíveis)
//   node tools/i18n.mjs check     → lista chaves faltando/sobrando e erros de marcação em cada dicionário
//   node tools/i18n.mjs build     → gera static-site/en, /de, /es e assets/i18n/<lang>/*.js
//
// Textos sem tradução no dicionário caem para o português (e aparecem no "check").
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = path.join(ROOT, 'static-site');
const I18N = path.join(ROOT, 'i18n');
export const LANGS = {
  pt: { html: 'pt-BR', og: 'pt_BR', dir: '' },
  en: { html: 'en-GB', og: 'en_GB', dir: 'en' },
  de: { html: 'de-DE', og: 'de_DE', dir: 'de' },
  es: { html: 'es-ES', og: 'es_ES', dir: 'es' },
};
const TARGETS = ['en', 'de', 'es'];
const PAGES = ['index.html', 'o-que-e.html', 'as-duas-disciplinas.html', 'catalogo.html', 'matriz.html', 'laboratorio.html', 'casos.html', 'metodo.html', 'glossario.html', 'sobre.html'];
const BASE_URL = 'https://www.psiconometria.com/';

/* ---------------- critérios do que é texto ---------------- */
const SKIP_KEYS = new Set(['id', 'url', 'familia', 'ligacoes', 'href', 'value', 'pontos']);
// Nomes próprios de idioma no seletor e marcas: nunca traduzir.
const NEVER = new Set(['Psiconometria', 'Português', 'English', 'Deutsch', 'Español', 'KPIs', 'KPI', 'www.psiconometria.com', 'Menu']);
function isText(s) {
  const t = s.trim();
  if (!t || NEVER.has(t)) return false;
  if (!/[A-Za-zÀ-ÿ]/.test(t)) return false;            // só números/símbolos
  if (/^[a-z0-9_.#\/:-]+$/.test(t)) return false;        // identificadores, classes, caminhos
  if (/^(https?:|mailto:)/.test(t)) return false;
  return true;
}

/* ---------------- dados (data.js, content.js) ---------------- */
function loadWin(file) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx);
  return ctx.window;
}
// Percorre o objeto e aplica fn em cada texto. Itens de lista herdam a chave da lista.
// Não traduz: ids, urls, referências entre registros (familia, ligacoes, FATORES[].kpis).
function mapData(v, fn, p = []) {
  if (typeof v === 'string') {
    const k = p[p.length - 1];
    if (SKIP_KEYS.has(k) || (p.includes('FATORES') && k === 'kpis')) return v;
    return isText(v) ? fn(v) : v;
  }
  if (Array.isArray(v)) return v.map((x) => mapData(x, fn, p));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, mapData(x, fn, p.concat(k))]));
  return v;
}
const DATA_FILES = [['data.js', 'PSICO_DATA'], ['content.js', 'PSICO_PAGES']];

/* ---------------- JavaScript (app.js): só os textos marcados com T('...') ---------------- */
const unq = (b) => b.replace(/\\'/g, "'").replace(/\\\\/g, '\\');
const q = (t) => t.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
function mapJS(src, fn) {
  return src.replace(/\bT\('((?:[^'\\\n]|\\.)*)'/g, (m, body) => "T('" + q(fn(unq(body))) + "'");
}
const JS_FILES = ['app.js'];

const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
/* ---------------- HTML ---------------- */
const INLINE = new Set(['a', 'b', 'strong', 'i', 'em', 'span', 'sub', 'sup', 'br', 'abbr', 'code', 'small']);
function onlyInline(node) { return node.childNodes.every((c) => c.nodeType === 3 || (c.nodeType === 1 && INLINE.has(c.rawTagName?.toLowerCase()) && onlyInline(c))); }
// Encontra os blocos traduzíveis: o elemento mais alto cujo conteúdo é só texto e marcação inline.
function blocks(root) {
  const out = [];
  const direct = (c) => c.childNodes.some((t) => t.nodeType === 3 && t.text.trim());
  const kids = (c) => c.childNodes.filter((e) => e.nodeType === 1);
  (function walk(n, force) {
    for (const c of kids(n)) {
      const tag = c.rawTagName.toLowerCase();
      if (tag === 'script' || tag === 'style') continue;
      if (onlyInline(c) && isText(c.text)) {
        // Vários elementos lado a lado sem texto solto (ex.: três links): traduz cada um.
        if (!direct(c) && kids(c).length > 1) { walk(c, true); continue; }
        if (!INLINE.has(tag) || force) { out.push(c); continue; }
      }
      walk(c, false);
    }
  })(root, false);
  return out;
}
function htmlStrings(file, fn) {
  const src = fs.readFileSync(file, 'utf8');
  const root = parse(src, { comment: true, blockTextElements: { script: true, style: true } });
  for (const el of blocks(root.querySelector('body'))) {
    const inner = el.innerHTML.trim();
    const lead = el.innerHTML.match(/^\s*/)[0], trail = el.innerHTML.match(/\s*$/)[0];
    const t = fn(inner);
    if (t !== inner) el.set_content(lead + t + trail);
  }
  // atributos de texto em qualquer elemento do body
  for (const el of root.querySelectorAll('body *')) for (const a of ATTRS) { const v = el.getAttribute(a); if (v && isText(v)) el.setAttribute(a, fn(v)); }
  // <title> e metas
  const title = root.querySelector('title'); if (title) title.set_content(fn(title.text));
  for (const m of root.querySelectorAll('meta[name="description"], meta[property="og:title"], meta[property="og:description"]')) m.setAttribute('content', fn(m.getAttribute('content')));
  return root;
}

/* ---------------- extract ---------------- */
function extract() {
  const seen = new Map();
  const add = (where) => (s) => { if (!seen.has(s)) seen.set(s, where); return s; };
  for (const p of PAGES) htmlStrings(path.join(SITE, p), add('page:' + p));
  for (const [f, g] of DATA_FILES) mapData(loadWin(path.join(SITE, 'assets', f))[g], add('data:' + f));
  for (const f of JS_FILES) mapJS(fs.readFileSync(path.join(SITE, 'assets', f), 'utf8'), add('ui:' + f));
  const list = [...seen].map(([pt, where]) => ({ pt, where }));
  fs.mkdirSync(I18N, { recursive: true });
  fs.writeFileSync(path.join(I18N, 'source.json'), JSON.stringify(list, null, 1));
  const words = list.reduce((a, x) => a + x.pt.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length, 0);
  console.log(`${list.length} textos, ~${words} palavras → i18n/source.json`);
}

/* ---------------- check ---------------- */
function tags(s) { return (s.match(/<\/?[a-z][^>]*>/gi) || []).map((t) => t.replace(/\s(title|aria-label|alt)="[^"]*"/g, '')).sort().join(''); }
function check() {
  const src = JSON.parse(fs.readFileSync(path.join(I18N, 'source.json'), 'utf8')).map((x) => x.pt);
  let bad = 0;
  for (const l of TARGETS) {
    const f = path.join(I18N, l + '.json');
    if (!fs.existsSync(f)) { console.log(`${l}: sem dicionário`); bad++; continue; }
    const d = JSON.parse(fs.readFileSync(f, 'utf8'));
    const missing = src.filter((k) => !(k in d) || typeof d[k] !== 'string' || !d[k].trim());
    const extra = Object.keys(d).filter((k) => !src.includes(k));
    const markup = src.filter((k) => k in d && tags(k) !== tags(d[k]));
    console.log(`${l}: ${src.length - missing.length}/${src.length} traduzidos; ${missing.length} faltando; ${extra.length} sobrando; ${markup.length} com marcação diferente`);
    for (const k of missing.slice(0, 10)) console.log('   faltando:', k.slice(0, 90));
    for (const k of markup.slice(0, 10)) console.log('   marcação:', k.slice(0, 90));
    bad += missing.length + markup.length;
  }
  return bad;
}

/* ---------------- build ---------------- */
function build() {
  const altLinks = (page) => Object.entries(LANGS).map(([l, c]) => `<link rel="alternate" hreflang="${c.html.slice(0, 2)}" href="${BASE_URL}${c.dir ? c.dir + '/' : ''}${page === 'index.html' ? '' : page}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${BASE_URL}${page === 'index.html' ? '' : page}">`;

  // português (raiz): só garante lang e alternates
  for (const p of PAGES) {
    const f = path.join(SITE, p);
    let s = fs.readFileSync(f, 'utf8').replace(/<link rel="alternate" hreflang[^>]*>\n?/g, '');
    s = s.replace(/<html lang="[^"]*">/, '<html lang="pt-BR">').replace(/(<link rel="canonical"[^>]*>)/, `$1\n${altLinks(p)}`);
    fs.writeFileSync(f, s);
  }

  for (const l of TARGETS) {
    const dict = JSON.parse(fs.readFileSync(path.join(I18N, l + '.json'), 'utf8'));
    const tr = (s) => (typeof dict[s] === 'string' && dict[s].trim() ? dict[s] : s);
    const outDir = path.join(SITE, LANGS[l].dir);
    const assetDir = path.join(SITE, 'assets', 'i18n', l);
    fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(assetDir, { recursive: true });

    for (const [f, g] of DATA_FILES) fs.writeFileSync(path.join(assetDir, f), `/* Gerado por tools/i18n.mjs a partir de assets/${f} — não editar. */\nwindow.${g} = ${JSON.stringify(mapData(loadWin(path.join(SITE, 'assets', f))[g], tr), null, 1)};\n`);
    for (const f of JS_FILES) fs.writeFileSync(path.join(assetDir, f), `/* Gerado por tools/i18n.mjs a partir de assets/${f} — não editar. */\n` + mapJS(fs.readFileSync(path.join(SITE, 'assets', f), 'utf8'), tr));

    for (const p of PAGES) {
      const root = htmlStrings(path.join(SITE, p), tr);
      let s = root.toString();
      s = s.replace(/<html lang="[^"]*">/, `<html lang="${LANGS[l].html}">`)
        .replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="${LANGS[l].og}">`)
        .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${BASE_URL}${l}/${p === 'index.html' ? '' : p}">`)
        .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${BASE_URL}${l}/${p === 'index.html' ? '' : p}">`)
        .replace(/(href|src)="assets\//g, '$1="../assets/')
        .replace(/src="\.\.\/assets\/(data|content|app)\.js"/g, `src="../assets/i18n/${l}/$1.js"`);
      fs.writeFileSync(path.join(outDir, p), s);
    }
  }

  // sitemap com todas as versões
  const urls = PAGES.flatMap((p) => Object.values(LANGS).map((c) => `${BASE_URL}${c.dir ? c.dir + '/' : ''}${p === 'index.html' ? '' : p}`));
  fs.writeFileSync(path.join(SITE, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><changefreq>monthly</changefreq></url>`).join('\n')}\n</urlset>\n`);
  console.log('ok: páginas geradas em', TARGETS.map((l) => '/' + l + '/').join(', '));
}

const cmd = process.argv[2];
if (cmd === 'extract') extract();
else if (cmd === 'check') process.exitCode = check() ? 1 : 0;
else if (cmd === 'build') build();
else console.log('uso: node tools/i18n.mjs extract | check | build');
