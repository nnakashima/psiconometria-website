<?php
// Modelo de configuração dos formulários. NÃO coloque a chave real neste arquivo nem no Git.
//
// Como usar na Hostinger:
//   1. Copie este conteúdo para um arquivo chamado  psiconometria-config.php
//   2. Salve-o FORA da pasta pública, um nível acima de public_html
//      (ex.: /home/u123456789/domains/psiconometria.com/psiconometria-config.php).
//      Alternativa: salvar como api/config.php (o .htaccess bloqueia o acesso pela web).
//   3. Preencha os valores abaixo.
return [
  'RESEND_API_KEY'     => 're_COLE_A_CHAVE_AQUI',           // resend.com → API Keys, permissão "Sending access"
  'MAIL_FROM'          => 'Psiconometria <contato@psiconometria.com>', // domínio verificado no Resend
  'MAIL_TO'            => 'admin@psiconometria.com',          // quem recebe; vários: 'a@x.com,b@x.com'
  'RESEND_AUDIENCE_ID' => '',                                 // opcional: audiência para a newsletter
];
