// Ferramentas para traduzir por partes.
//   node tools/i18n-parts.mjs show  <a|b> <inicio> <qtd>      → mostra os textos numerados da fonte
//   node tools/i18n-parts.mjs check <en|de|es> <a|b>          → verifica as partes gravadas
//   node tools/i18n-parts.mjs merge                           → junta tudo em i18n/<lang>.json
// Cada parte é i18n/parts/<lang>-<metade>-<inicio>.json: uma LISTA de traduções, na mesma
// ordem dos textos da fonte a partir de <inicio> (índice 0-based dentro da metade).
import fs from 'node:fs';
const chunk = (h) => JSON.parse(fs.readFileSync(`i18n/chunks/${h}.json`, 'utf8'));
function load(lang, h) {
  const src = chunk(h), d = {}, errs = [];
  for (const f of fs.readdirSync('i18n/parts').filter((f) => new RegExp(`^${lang}-${h}-\\d+\\.json$`).test(f))) {
    const start = Number(f.match(/-(\d+)\.json$/)[1]);
    let arr; try { arr = JSON.parse(fs.readFileSync('i18n/parts/' + f, 'utf8')); } catch (e) { errs.push(`JSON inválido em ${f}: ${e.message}`); continue; }
    if (!Array.isArray(arr)) { errs.push(`${f} não é uma lista`); continue; }
    if (start + arr.length > src.length) errs.push(`${f} passa do fim da fonte (${start}+${arr.length} > ${src.length})`);
    arr.forEach((t, i) => { if (src[start + i]) d[src[start + i].pt] = t; });
  }
  return { src: src.map((x) => x.pt), d, errs };
}
const tags = (s) => (s.match(/<\/?[a-z][^>]*>/gi) || []).map((t) => t.replace(/\s(title|aria-label|alt)="[^"]*"/g, '')).sort().join('');
const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join('');
const [cmd, a1, a2, a3] = process.argv.slice(2);
if (cmd === 'show') {
  const src = chunk(a1), s = Number(a2), n = Number(a3);
  src.slice(s, s + n).forEach((x, i) => console.log(`[${s + i}] (${x.where})\n${x.pt}\n`));
} else if (cmd === 'check') {
  const { src, d, errs } = load(a1, a2);
  errs.forEach((e) => console.log('ERRO:', e));
  const missing = src.map((k, i) => [k, i]).filter(([k]) => typeof d[k] !== 'string' || !d[k].trim());
  const markup = src.map((k, i) => [k, i]).filter(([k]) => typeof d[k] === 'string' && (tags(k) !== tags(d[k]) || ph(k) !== ph(d[k])));
  console.log(`${a1}-${a2}: ${src.length - missing.length}/${src.length} traduzidos | faltando ${missing.length} | marcação/placeholder diferente ${markup.length}`);
  for (const [k, i] of missing.slice(0, 10)) console.log(`  FALTANDO [${i}]:`, k.slice(0, 100));
  for (const [k, i] of markup.slice(0, 15)) console.log(`  MARCAÇÃO [${i}]: fonte=${JSON.stringify(k).slice(0, 140)}\n      tradução=${JSON.stringify(d[k]).slice(0, 140)}`);
  if (errs.length || missing.length || markup.length) process.exitCode = 1;
} else if (cmd === 'merge') {
  for (const lang of ['en', 'de', 'es']) {
    const all = {};
    for (const h of ['a', 'b']) Object.assign(all, load(lang, h).d);
    fs.writeFileSync(`i18n/${lang}.json`, JSON.stringify(all, null, 1) + '\n');
    console.log(lang, Object.keys(all).length, 'textos');
  }
}
