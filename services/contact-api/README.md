# Serviço de formulários (contato e newsletter)

Recebe os envios do site estático e encaminha por e-mail via [Resend](https://resend.com).
Node 18+, sem dependências.

## Rotas

| Método | Rota         | Uso                                                         |
|--------|--------------|-------------------------------------------------------------|
| GET    | `/health`    | Verificação de saúde; mostra se as variáveis estão completas |
| POST   | `/contact`   | Formulário da página Sobre                                   |
| POST   | `/subscribe` | "Receba novos estudos", no rodapé                            |

Proteções: CORS restrito às origens permitidas, campo-isca contra robôs (`site`),
limite de 5 envios por IP a cada 10 minutos, corpo máximo de 10 KB e validação dos campos.

## Variáveis de ambiente

| Variável             | Obrigatória | Exemplo                                                 |
|----------------------|-------------|---------------------------------------------------------|
| `RESEND_API_KEY`     | sim         | chave criada em resend.com → API Keys (permissão *Sending access*) |
| `MAIL_FROM`          | sim         | `Psiconometria <contato@psiconometria.com>` — o domínio precisa estar verificado no Resend |
| `MAIL_TO`            | sim         | e-mail(s) que recebem os contatos, separados por vírgula |
| `ALLOWED_ORIGINS`    | sim         | `https://www.psiconometria.com,https://psiconometria.com` |
| `RESEND_AUDIENCE_ID` | não         | ID da audiência no Resend; se definido, inscritos da newsletter entram nela |
| `PORT`               | não         | definido automaticamente pelo Railway                    |

## Deploy no Railway

1. No projeto do Railway, crie um serviço a partir deste repositório.
2. Em *Settings → Root Directory*, use `services/contact-api`. O Railway detecta Node e roda `npm start`.
3. Cadastre as variáveis acima em *Variables*.
4. Em *Networking*, gere um domínio público (ex.: `psiconometria-contato.up.railway.app`).
5. Abra `https://<domínio>/health`: deve responder `{"ok":true,"configured":true}`.
6. No site, edite `static-site/assets/config.js` e coloque o domínio em `API_BASE`.

## Teste local

```bash
npm test   # sobe um Resend falso e verifica contato, validação, CORS, campo-isca e limite
```
