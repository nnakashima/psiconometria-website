// Psiconometria — serviço de formulários (contato e newsletter) via Resend.
// Node 18+, sem dependências. Configuração por variáveis de ambiente (ver README.md).
'use strict';
const http = require('http');

const ENV = {
  PORT: Number(process.env.PORT || 8080),
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_API_URL: (process.env.RESEND_API_URL || 'https://api.resend.com').replace(/\/$/, ''),
  RESEND_AUDIENCE_ID: process.env.RESEND_AUDIENCE_ID || '',
  MAIL_FROM: process.env.MAIL_FROM || '',
  MAIL_TO: (process.env.MAIL_TO || '').split(',').map((s) => s.trim()).filter(Boolean),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean),
};

const INTERESSES = {
  'diagnostico': 'Diagnóstico organizacional (não clínico)',
  'projeto-piloto': 'Propor um projeto-piloto',
  'conteudo-pesquisa': 'Conteúdo e pesquisa',
  'consultoria': 'Consultoria',
  'colaboracao-academica': 'Colaboração acadêmica',
  'newsletter': 'Apenas receber novos estudos',
};

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const MAX_BODY = 10 * 1024;

/* ---- limite simples de requisições por IP (memória do processo) ---- */
const WINDOW_MS = 10 * 60 * 1000, MAX_HITS = 5;
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return list.length > MAX_HITS;
}

function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function clip(v, n) { return typeof v === 'string' ? v.trim().slice(0, n) : ''; }
function oneLine(s) { return s.replace(/[\r\n]+/g, ' '); }

function cors(req, res) {
  const origin = (req.headers.origin || '').replace(/\/$/, '');
  if (origin && (ENV.ALLOWED_ORIGINS.includes(origin) || ENV.ALLOWED_ORIGINS.includes('*'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return true;
  }
  return !origin; // requisições sem Origin (curl, health check) seguem; navegadores de outras origens não
}

function send(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
}

function readJSON(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => { size += c.length; if (size > MAX_BODY) { reject(Object.assign(new Error('too_large'), { status: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { reject(Object.assign(new Error('bad_json'), { status: 400 })); } });
    req.on('error', reject);
  });
}

async function resend(path, body) {
  const r = await fetch(ENV.RESEND_API_URL + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + ENV.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) { const e = new Error('resend_' + r.status + ': ' + text.slice(0, 300)); e.status = r.status; throw e; }
  try { return JSON.parse(text); } catch { return {}; }
}

function table(rows) {
  return '<table cellpadding="6" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:14px">' +
    rows.map(([k, v]) => `<tr><td style="vertical-align:top;color:#5f6062;border-bottom:1px solid #e3e3e3">${esc(k)}</td><td style="border-bottom:1px solid #e3e3e3;white-space:pre-wrap">${esc(v || '—')}</td></tr>`).join('') +
    '</table>';
}

async function handleContact(data) {
  const c = {
    nome: clip(data.nome, 120), email: clip(data.email, 254), empresa: clip(data.empresa, 160),
    interesse: clip(data.interesse, 40), mensagem: clip(data.mensagem, 2000), origem: clip(data.origem, 120) || 'site',
  };
  if (!c.nome || !c.email || !c.interesse) return [400, { ok: false, error: 'campos_obrigatorios' }];
  if (!EMAIL_RE.test(c.email)) return [400, { ok: false, error: 'email_invalido' }];
  if (!INTERESSES[c.interesse]) return [400, { ok: false, error: 'interesse_invalido' }];
  const label = INTERESSES[c.interesse];
  await resend('/emails', {
    from: ENV.MAIL_FROM, to: ENV.MAIL_TO, reply_to: c.email,
    subject: oneLine(`Novo contato pelo site: ${label} — ${c.nome}`).slice(0, 180),
    html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">Nova mensagem pelo formulário de contato de psiconometria.com. Responda a este e-mail para falar direto com a pessoa.</p>` +
      table([['Nome', c.nome], ['E-mail', c.email], ['Empresa / instituição', c.empresa], ['Interesse', label], ['Mensagem', c.mensagem], ['Origem', c.origem]]),
    text: `Nome: ${c.nome}\nE-mail: ${c.email}\nEmpresa: ${c.empresa || '—'}\nInteresse: ${label}\nOrigem: ${c.origem}\n\n${c.mensagem || '(sem mensagem)'}`,
  });
  if (c.interesse === 'newsletter' && ENV.RESEND_AUDIENCE_ID) await addToAudience(c.email, c.nome).catch((e) => console.error('[audience]', e.message));
  return [200, { ok: true }];
}

async function addToAudience(email, nome) {
  const body = { email, unsubscribed: false };
  if (nome && nome !== 'Assinante da newsletter') body.first_name = nome.split(' ')[0];
  return resend(`/audiences/${encodeURIComponent(ENV.RESEND_AUDIENCE_ID)}/contacts`, body);
}

async function handleSubscribe(data) {
  const email = clip(data.email, 254), origem = clip(data.origem, 120) || 'rodape';
  if (!EMAIL_RE.test(email)) return [400, { ok: false, error: 'email_invalido' }];
  let added = false;
  if (ENV.RESEND_AUDIENCE_ID) {
    try { await addToAudience(email); added = true; } catch (e) { console.error('[audience]', e.message); }
  }
  // Sempre avisa a equipe, para nenhuma inscrição se perder mesmo sem audiência configurada.
  await resend('/emails', {
    from: ENV.MAIL_FROM, to: ENV.MAIL_TO,
    subject: 'Nova inscrição na newsletter: ' + email,
    html: `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">Nova inscrição em "Receba novos estudos".</p>` +
      table([['E-mail', email], ['Origem', origem], ['Adicionado à audiência do Resend', added ? 'sim' : 'não']]),
    text: `E-mail: ${email}\nOrigem: ${origem}\nAdicionado à audiência: ${added ? 'sim' : 'não'}`,
  });
  return [200, { ok: true }];
}

function configured() { return !!(ENV.RESEND_API_KEY && ENV.MAIL_FROM && ENV.MAIL_TO.length); }

const server = http.createServer(async (req, res) => {
  const url = (req.url || '/').split('?')[0];
  const allowed = cors(req, res);
  if (req.method === 'GET' && (url === '/' || url === '/health')) return send(res, 200, { ok: true, configured: configured() });
  if (req.method === 'OPTIONS') { res.writeHead(allowed ? 204 : 403); return res.end(); }
  if (req.method !== 'POST' || (url !== '/contact' && url !== '/subscribe')) return send(res, 404, { ok: false, error: 'nao_encontrado' });
  if (!allowed) return send(res, 403, { ok: false, error: 'origem_nao_permitida' });
  if (!configured()) return send(res, 503, { ok: false, error: 'servico_nao_configurado' });

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return send(res, 429, { ok: false, error: 'muitas_tentativas' });

  try {
    const data = await readJSON(req);
    if (data.site) return send(res, 200, { ok: true }); // honeypot preenchido: robô; finge sucesso e descarta
    const [status, body] = url === '/contact' ? await handleContact(data) : await handleSubscribe(data);
    return send(res, status, body);
  } catch (e) {
    console.error('[erro]', url, e.message);
    return send(res, e.status === 413 || e.status === 400 ? e.status : 502, { ok: false, error: 'falha_no_envio' });
  }
});

if (require.main === module) {
  server.listen(ENV.PORT, () => console.log(`contact-api ouvindo na porta ${ENV.PORT} (configurado: ${configured()})`));
}
module.exports = { server, ENV };
