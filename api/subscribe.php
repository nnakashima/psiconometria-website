<?php
// "Receba novos estudos" (rodapé) → audiência do Resend (opcional) + aviso para a equipe.
declare(strict_types=1);
require __DIR__ . '/_lib.php';

[$cfg, $d] = psico_entrada();

$email = psico_clip($d['email'] ?? '', 254);
$origem = psico_clip($d['origem'] ?? '', 120) ?: 'rodape';
if (!psico_email_ok($email)) psico_json(400, ['ok' => false, 'error' => 'email_invalido']);

$adicionado = psico_audiencia($cfg, $email);

// Sempre avisa a equipe, para nenhuma inscrição se perder mesmo sem audiência configurada.
try {
  psico_resend($cfg, '/emails', [
    'from' => $cfg['MAIL_FROM'],
    'to' => psico_destinos($cfg),
    'subject' => 'Nova inscrição na newsletter: ' . $email,
    'html' => '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">Nova inscrição em "Receba novos estudos".</p>'
      . psico_tabela([['E-mail', $email], ['Origem', $origem], ['Adicionado à audiência do Resend', $adicionado ? 'sim' : 'não']]),
    'text' => "E-mail: {$email}\nOrigem: {$origem}\nAdicionado à audiência: " . ($adicionado ? 'sim' : 'não'),
  ]);
} catch (Throwable $e) {
  if (!$adicionado) psico_json(502, ['ok' => false, 'error' => 'falha_no_envio']);
}
psico_json(200, ['ok' => true]);
