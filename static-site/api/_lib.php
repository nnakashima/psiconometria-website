<?php
// Psiconometria — funções comuns dos formulários (contato e newsletter) via Resend.
// Não é acessível diretamente (bloqueado pelo .htaccess desta pasta).
declare(strict_types=1);

const PSICO_INTERESSES = [
  'diagnostico' => 'Diagnóstico organizacional (não clínico)',
  'projeto-piloto' => 'Propor um projeto-piloto',
  'conteudo-pesquisa' => 'Conteúdo e pesquisa',
  'consultoria' => 'Consultoria',
  'colaboracao-academica' => 'Colaboração acadêmica',
  'newsletter' => 'Apenas receber novos estudos',
];

function psico_config(): array {
  // 1º: fora da pasta pública (recomendado): /home/<usuario>/psiconometria-config.php
  // 2º: api/config.php (protegido pelo .htaccess)
  $candidatos = [dirname(__DIR__, 2) . '/psiconometria-config.php', __DIR__ . '/config.php'];
  foreach ($candidatos as $f) {
    if (is_file($f)) { $c = require $f; if (is_array($c)) return $c + ['RESEND_AUDIENCE_ID' => '', 'RESEND_API_URL' => 'https://api.resend.com']; }
  }
  return [];
}

function psico_json(int $status, array $body): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Content-Type-Options: nosniff');
  echo json_encode($body, JSON_UNESCAPED_UNICODE);
  exit;
}

function psico_esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function psico_clip($v, int $n): string { return is_string($v) ? mb_substr(trim($v), 0, $n) : ''; }
function psico_email_ok(string $e): bool { return strlen($e) <= 254 && filter_var($e, FILTER_VALIDATE_EMAIL) !== false; }

/** Lê o pedido, aplica as proteções e devolve [config, dados]. Encerra com erro quando algo falha. */
function psico_entrada(): array {
  if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') psico_json(405, ['ok' => false, 'error' => 'metodo_nao_permitido']);

  // Mesma origem: o formulário só pode vir do próprio site.
  $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
  $host = $_SERVER['HTTP_HOST'] ?? '';
  if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== preg_replace('/:\d+$/', '', $host)) {
    psico_json(403, ['ok' => false, 'error' => 'origem_nao_permitida']);
  }

  $cfg = psico_config();
  if (empty($cfg['RESEND_API_KEY']) || empty($cfg['MAIL_FROM']) || empty($cfg['MAIL_TO'])) {
    psico_json(503, ['ok' => false, 'error' => 'servico_nao_configurado']);
  }

  $raw = file_get_contents('php://input', false, null, 0, 10241);
  if ($raw === false || strlen($raw) > 10240) psico_json(413, ['ok' => false, 'error' => 'pedido_grande_demais']);
  $data = json_decode($raw, true);
  if (!is_array($data)) psico_json(400, ['ok' => false, 'error' => 'pedido_invalido']);

  if (!empty($data['site'])) psico_json(200, ['ok' => true]); // campo-isca preenchido: robô; finge sucesso

  psico_limite(5, 600);
  return [$cfg, $data];
}

/** Até $max envios por IP a cada $janela segundos (arquivos temporários do servidor). */
function psico_limite(int $max, int $janela): void {
  $ip = $_SERVER['REMOTE_ADDR'] ?? 'desconhecido';
  $f = sys_get_temp_dir() . '/psico_rl_' . md5($ip);
  $agora = time();
  $lista = [];
  if (is_file($f)) $lista = array_filter(array_map('intval', explode(',', (string) @file_get_contents($f))), fn($t) => $agora - $t < $janela);
  $lista[] = $agora;
  @file_put_contents($f, implode(',', $lista), LOCK_EX);
  if (count($lista) > $max) psico_json(429, ['ok' => false, 'error' => 'muitas_tentativas']);
}

function psico_resend(array $cfg, string $path, array $body): array {
  $ch = curl_init(rtrim($cfg['RESEND_API_URL'], '/') . $path);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $cfg['RESEND_API_KEY'], 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);
  $res = curl_exec($ch);
  $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($res === false || $code < 200 || $code >= 300) {
    error_log('[psiconometria] Resend ' . $path . ' falhou: ' . $code . ' ' . $err . ' ' . substr((string) $res, 0, 300));
    throw new RuntimeException('resend_' . $code);
  }
  return json_decode((string) $res, true) ?: [];
}

function psico_destinos(array $cfg): array {
  $to = is_array($cfg['MAIL_TO']) ? $cfg['MAIL_TO'] : explode(',', (string) $cfg['MAIL_TO']);
  return array_values(array_filter(array_map('trim', $to)));
}

function psico_tabela(array $linhas): string {
  $h = '<table cellpadding="6" style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;font-size:14px">';
  foreach ($linhas as [$k, $v]) {
    $h .= '<tr><td style="vertical-align:top;color:#5f6062;border-bottom:1px solid #e3e3e3">' . psico_esc($k) . '</td>'
        . '<td style="border-bottom:1px solid #e3e3e3;white-space:pre-wrap">' . psico_esc($v !== '' ? $v : '—') . '</td></tr>';
  }
  return $h . '</table>';
}

function psico_audiencia(array $cfg, string $email, string $nome = ''): bool {
  if (empty($cfg['RESEND_AUDIENCE_ID'])) return false;
  $body = ['email' => $email, 'unsubscribed' => false];
  if ($nome !== '' && $nome !== 'Assinante da newsletter') $body['first_name'] = explode(' ', $nome)[0];
  try { psico_resend($cfg, '/audiences/' . rawurlencode($cfg['RESEND_AUDIENCE_ID']) . '/contacts', $body); return true; }
  catch (Throwable $e) { return false; }
}
