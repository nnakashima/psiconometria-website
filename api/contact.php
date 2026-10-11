<?php
// Formulário de contato (página Sobre) → e-mail para a equipe via Resend.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

[$cfg, $d] = psico_entrada();

$c = [
  'nome' => psico_clip($d['nome'] ?? '', 120),
  'email' => psico_clip($d['email'] ?? '', 254),
  'empresa' => psico_clip($d['empresa'] ?? '', 160),
  'interesse' => psico_clip($d['interesse'] ?? '', 40),
  'mensagem' => psico_clip($d['mensagem'] ?? '', 2000),
  'origem' => psico_clip($d['origem'] ?? '', 120) ?: 'site',
];
if ($c['nome'] === '' || $c['email'] === '' || $c['interesse'] === '') psico_json(400, ['ok' => false, 'error' => 'campos_obrigatorios']);
if (!psico_email_ok($c['email'])) psico_json(400, ['ok' => false, 'error' => 'email_invalido']);
if (!isset(PSICO_INTERESSES[$c['interesse']])) psico_json(400, ['ok' => false, 'error' => 'interesse_invalido']);

$label = PSICO_INTERESSES[$c['interesse']];
$assunto = mb_substr(preg_replace('/[\r\n]+/', ' ', "Novo contato pelo site: {$label} — {$c['nome']}"), 0, 180);

try {
  psico_resend($cfg, '/emails', [
    'from' => $cfg['MAIL_FROM'],
    'to' => psico_destinos($cfg),
    'reply_to' => $c['email'],
    'subject' => $assunto,
    'html' => '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">Nova mensagem pelo formulário de contato de psiconometria.com. Responda a este e-mail para falar direto com a pessoa.</p>'
      . psico_tabela([['Nome', $c['nome']], ['E-mail', $c['email']], ['Empresa / instituição', $c['empresa']], ['Interesse', $label], ['Mensagem', $c['mensagem']], ['Origem', $c['origem']]]),
    'text' => "Nome: {$c['nome']}\nE-mail: {$c['email']}\nEmpresa: " . ($c['empresa'] ?: '—') . "\nInteresse: {$label}\nOrigem: {$c['origem']}\n\n" . ($c['mensagem'] ?: '(sem mensagem)'),
  ]);
} catch (Throwable $e) {
  psico_json(502, ['ok' => false, 'error' => 'falha_no_envio']);
}

if ($c['interesse'] === 'newsletter') psico_audiencia($cfg, $c['email'], $c['nome']);
psico_json(200, ['ok' => true]);
