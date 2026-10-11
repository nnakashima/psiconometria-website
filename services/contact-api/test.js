// Teste local: sobe um Resend falso e verifica os fluxos principais.
'use strict';
const http = require('http');
const assert = require('assert');
const calls = [];
const fake = http.createServer((req, res) => {
  let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => {
    calls.push({ path: req.url, auth: req.headers.authorization, body: JSON.parse(b) });
    res.writeHead(200, { 'Content-Type': 'application/json' }); res.end('{"id":"x"}');
  });
}).listen(0, async () => {
  Object.assign(process.env, { RESEND_API_URL: 'http://127.0.0.1:' + fake.address().port, RESEND_API_KEY: 're_test', MAIL_FROM: 'Site <site@example.com>', MAIL_TO: 'dono@example.com', ALLOWED_ORIGINS: 'https://www.psiconometria.com', RESEND_AUDIENCE_ID: 'aud_1', PORT: '0' });
  const { server } = require('./server');
  server.listen(0, async () => {
    const base = 'http://127.0.0.1:' + server.address().port;
    const post = (p, body, origin = 'https://www.psiconometria.com') => fetch(base + p, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) }).then(async (r) => ({ s: r.status, j: await r.json(), h: r.headers }));
    let r = await post('/contact', { nome: 'Ana', email: 'ana@empresa.com', empresa: 'X', interesse: 'diagnostico', mensagem: 'Olá <b>' });
    assert.equal(r.s, 200); assert.equal(r.h.get('access-control-allow-origin'), 'https://www.psiconometria.com');
    const mail = calls.pop(); assert.equal(mail.path, '/emails'); assert.equal(mail.body.reply_to, 'ana@empresa.com'); assert.ok(mail.body.html.includes('&lt;b&gt;')); assert.equal(mail.auth, 'Bearer re_test');
    r = await post('/contact', { nome: 'Ana', email: 'ana@empresa.com' }); assert.equal(r.s, 400);
    r = await post('/contact', { nome: 'Ana', email: 'nao-email', interesse: 'diagnostico' }); assert.equal(r.j.error, 'email_invalido');
    r = await post('/contact', { nome: 'Ana', email: 'a@b.com', interesse: 'diagnostico' }, 'https://evil.example'); assert.equal(r.s, 403);
    const before = calls.length; r = await post('/subscribe', { email: 'bot@x.com', site: 'spam' }); assert.equal(r.s, 200); assert.equal(calls.length, before);
    r = await post('/subscribe', { email: 'leitor@x.com' }); assert.equal(r.s, 200);
    assert.ok(calls.some((c) => c.path === '/audiences/aud_1/contacts' && c.body.email === 'leitor@x.com')); assert.equal(calls[calls.length - 1].path, '/emails');
    r = await post('/subscribe', { email: 'outro@x.com' }); assert.equal(r.s, 429); // 6ª requisição do mesmo IP na janela
    console.log('ok: todos os testes passaram'); process.exit(0);
  });
});
