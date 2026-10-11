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
│   ├── config.js              # Endereços dos scripts de formulário
│   ├── favicon.svg
│   └── fonts/                 # Hanken Grotesk e STIX Two (SIL Open Font License), hospedadas localmente
├── api/                     # Scripts PHP dos formulários (Resend)
├── .htaccess                # Cabeçalhos de segurança e cache
├── sitemap.xml
└── robots.txt
```

## Onde editar

- **Textos estruturados** (métodos, fatores, casos, glossário, disciplinas): `assets/data.js`.
- **Textos da home e das páginas** (dores, exemplo, equação, etapas do método, princípios): `assets/content.js`.
- **Textos fixos de cada página** (títulos, introduções): direto no `.html`.
- **Cores e tipografia**: variáveis no início de `assets/styles.css`.

## Formulários (contato e newsletter)

Os formulários enviam para dois scripts PHP na pasta `api/`, que entregam por
e-mail via [Resend](https://resend.com). Eles rodam na própria hospedagem do site:
não há servidor separado.

| Arquivo              | Função                                                          |
|----------------------|-----------------------------------------------------------------|
| `api/contact.php`    | Formulário da página Sobre → e-mail para a equipe, com "responder para" o remetente |
| `api/subscribe.php`  | "Receba novos estudos" → audiência do Resend (opcional) + aviso por e-mail |
| `api/_lib.php`       | Validação, limite de 5 envios por IP a cada 10 min, campo-isca, chamada ao Resend |
| `api/config.sample.php` | Modelo de configuração (sem a chave real)                    |

**Configuração (uma vez, no servidor):** copie `api/config.sample.php` para um
arquivo `psiconometria-config.php` **fora** de `public_html` (um nível acima) e
preencha a chave do Resend, o remetente e o destinatário. A chave nunca vai para o Git.
Alternativa: salvar como `api/config.php`; o `.htaccess` da pasta bloqueia o acesso pela web.

O remetente (`MAIL_FROM`) precisa usar um domínio verificado no Resend
(Resend → Domains → `psiconometria.com`, com os registros DNS publicados).

Sem configuração, os formulários respondem com a mensagem de erro de envio,
em vez de fingir que a mensagem foi registrada.

## Visualizar localmente

```bash
cd static-site
php -S localhost:8080        # serve o site e os scripts da pasta api/
```

Depois acesse http://localhost:8080

## Publicar na Hostinger

Requer um plano de **hospedagem** (Premium, Business ou Cloud), que roda PHP e
dá acesso ao Gerenciador de Arquivos. O Hostinger Website Builder não aceita
arquivos próprios.

1. hPanel → Sites → psiconometria.com → **Gerenciador de Arquivos** → `public_html`.
2. Envie o pacote `psiconometria-site.zip` e use **Extrair** (ou envie o conteúdo de `static-site/` por FTP).
3. Crie `psiconometria-config.php` um nível acima de `public_html`, a partir do modelo.
4. Confirme que o SSL está ativo (hPanel → Segurança → SSL).
5. Teste o formulário em `/sobre.html#contato`.

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
