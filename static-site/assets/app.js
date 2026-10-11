/* Psiconometria — lógica do site estático.
   Cabeçalho e rodapé compartilhados, interatividade de cada página e envio de formulários. */
(function () {
  'use strict';
  var D = window.PSICO_DATA;
  var P = window.PSICO_PAGES;
  var CFG = window.PSICO_CONFIG || {};

  var NAV = [
    { to: 'o-que-e.html', label: 'O conceito' },
    { to: 'as-duas-disciplinas.html', label: 'Disciplinas' },
    { to: 'metodo.html', label: 'Método' },
    { to: 'matriz.html', label: 'Matriz' },
    { to: 'laboratorio.html', label: 'Laboratório' },
    { to: 'casos.html', label: 'Casos' },
    { to: 'catalogo.html', label: 'Catálogo' },
    { to: 'glossario.html', label: 'Glossário' },
    { to: 'sobre.html', label: 'Sobre' }
  ];

  /* ---------- utilitários ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function mq(q) { return window.matchMedia(q).matches; }
  function current() { var p = location.pathname.split('/').pop(); return p === '' ? 'index.html' : p; }
  function fmt(n, d) { return n.toLocaleString('pt-BR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  var EV_LEVEL = { 'Forte': 4, 'Alta': 4, 'Moderada': 3, 'Emergente': 2, 'Limitada': 2, 'Hipótese': 1, 'Em debate': 1 };
  function ev(label, prefix) {
    var n = EV_LEVEL[label] || 0, bars = '';
    for (var i = 1; i <= 4; i++) bars += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<span class="ev" title="Nível de evidência: ' + esc(label) + '"><span class="ev-bar" aria-hidden="true">' + bars + '</span>' + (prefix ? prefix + ' ' : '') + esc(label.toLowerCase()) + '</span>';
  }

  /* ---------- cabeçalho e rodapé ---------- */
  function renderHeader() {
    var head = $('site-header');
    if (!head) return;
    var cur = current();
    head.className = 'site-header';
    head.innerHTML =
      '<a class="skip" href="#conteudo">Pular para o conteúdo</a>' +
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><span class="brand-mark">Psiconometria</span><span class="brand-sub">Pessoas, dados e resultados empresariais</span></a>' +
        '<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>' +
        '<nav class="nav" id="nav" aria-label="Navegação principal">' +
          NAV.map(function (n) { return '<a href="' + n.to + '"' + (n.to === cur ? ' aria-current="page"' : '') + '>' + n.label + '</a>'; }).join('') +
          '<a class="nav-cta" href="sobre.html#contato">Contato</a>' +
        '</nav>' +
      '</div>';
    var btn = $('menu-btn'), nav = $('nav');
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Fechar' : 'Menu';
    });
  }

  function renderFooter() {
    var foot = $('site-footer');
    if (!foot) return;
    foot.className = 'site-footer';
    foot.innerHTML =
      '<div class="wrap">' +
        '<div class="foot-grid">' +
          '<div>' +
            '<h2>Psiconometria</h2>' +
            '<p class="about">Uma abordagem integrada que combina a mensuração rigorosa de características humanas com métodos quantitativos de análise econômica — para compreender como pessoas, comportamentos, relações e decisões influenciam processos e resultados empresariais.</p>' +
            '<div class="nl" id="nl">' +
              '<h2>Receba novos estudos</h2>' +
              '<form id="nl-form" novalidate>' +
                '<label class="sr-only" for="newsletter-email">Seu e-mail</label>' +
                '<input type="email" id="newsletter-email" name="email" placeholder="seu@email.com" autocomplete="email" required>' +
                '<input class="hp" type="text" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">' +
                '<button class="btn" type="submit">Assinar</button>' +
              '</form>' +
              '<p class="form-msg" id="nl-msg" role="status" aria-live="polite"></p>' +
            '</div>' +
          '</div>' +
          '<div><h2>Navegação</h2><ul>' + NAV.map(function (n) { return '<li><a href="' + n.to + '">' + n.label + '</a></li>'; }).join('') + '<li><a href="sobre.html#contato">Contato</a></li></ul></div>' +
          '<div>' +
            '<h2>Compromisso metodológico</h2>' +
            '<ul class="commit">' +
              '<li>Correlação não comprova causalidade.</li>' +
              '<li>Nenhum instrumento deve ser usado isoladamente em decisões de alto impacto.</li>' +
              '<li>Testes psicológicos de uso privativo exigem profissionais habilitados.</li>' +
              '<li>Toda afirmação factual indica fonte, ano e tipo de evidência.</li>' +
            '</ul>' +
            '<p class="sources">Fontes de referência: APA, AERA/NCME, CFP/SATEPSI, OECD, World Bank, Google re:Work, Gallup, Our World in Data.</p>' +
          '</div>' +
        '</div>' +
        '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Psiconometria. Conceito autoral em desenvolvimento.</span><span>www.psiconometria.com</span></div>' +
      '</div>';
    initNewsletter();
  }

  /* ---------- envio de formulários ---------- */
  function post(path, payload) {
    if (!CFG.API_BASE) return Promise.reject(new Error('sem-api'));
    return fetch(CFG.API_BASE.replace(/\/$/, '') + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok || j.ok === false) { var e = new Error(j.error || 'falha'); e.status = r.status; throw e; }
        return j;
      });
    });
  }

  function initNewsletter() {
    var form = $('nl-form'), msg = $('nl-msg');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = form.email.value.trim();
      msg.className = 'form-msg';
      if (!email || !form.email.checkValidity()) { msg.className = 'form-msg err'; msg.textContent = 'Informe um e-mail válido para assinar.'; return; }
      var btn = form.querySelector('button'); btn.disabled = true; btn.textContent = 'Enviando…';
      post('/subscribe', { email: email, origem: 'rodape', site: form.site.value })
        .then(function () { form.remove(); msg.textContent = 'Inscrição registrada. Obrigado.'; })
        .catch(function () { msg.className = 'form-msg err'; msg.textContent = 'Não foi possível registrar. Tente novamente.'; btn.disabled = false; btn.textContent = 'Assinar'; });
    });
  }

  function initContact() {
    var root = $('contact-root');
    if (!root) return;
    root.innerHTML =
      '<form class="form" id="contact-form" novalidate>' +
        '<div class="two">' +
          '<div class="field"><label for="ct-nome">Nome *</label><input type="text" id="ct-nome" name="nome" placeholder="Seu nome" autocomplete="name" maxlength="120" required></div>' +
          '<div class="field"><label for="ct-email">E-mail *</label><input type="email" id="ct-email" name="email" placeholder="voce@empresa.com" autocomplete="email" required></div>' +
        '</div>' +
        '<div class="two">' +
          '<div class="field"><label for="ct-empresa">Empresa / instituição <span class="opt">(opcional)</span></label><input type="text" id="ct-empresa" name="empresa" placeholder="Opcional" autocomplete="organization" maxlength="160"></div>' +
          '<div class="field"><label for="ct-interesse">Interesse *</label><select id="ct-interesse" name="interesse" required><option value="">Selecione</option>' +
            P.INTERESSES.map(function (i) { return '<option value="' + i.value + '">' + i.label + '</option>'; }).join('') +
          '</select></div>' +
        '</div>' +
        '<div class="field"><label for="ct-mensagem">Mensagem</label><textarea id="ct-mensagem" name="mensagem" rows="5" maxlength="2000" placeholder="Conte em duas ou três frases o contexto: setor, tamanho da equipe e a pergunta de negócio que você gostaria de investigar."></textarea></div>' +
        '<input class="hp" type="text" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<p class="form-msg err" id="ct-err" role="alert" hidden></p>' +
        '<div><button class="btn" type="submit">Enviar mensagem</button></div>' +
        '<p class="small muted">Enviamos apenas o necessário para responder ao seu contato. Não coletamos dados psicológicos neste site. Consulte os princípios de ética e privacidade nesta página.</p>' +
      '</form>';
    var form = $('contact-form'), err = $('ct-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var data = { nome: form.nome.value.trim(), email: form.email.value.trim(), empresa: form.empresa.value.trim(), interesse: form.interesse.value, mensagem: form.mensagem.value.trim(), origem: 'pagina-sobre', site: form.site.value };
      if (!data.nome || !data.email || !data.interesse) { err.textContent = 'Preencha nome, e-mail e interesse para enviar.'; err.hidden = false; return; }
      if (!form.email.checkValidity()) { err.textContent = 'O e-mail informado não parece válido. Confira e tente de novo.'; err.hidden = false; form.email.focus(); return; }
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = 'Enviando…';
      post('/contact', data).then(function () {
        root.innerHTML = '<div class="form-done" role="status"><h3>Mensagem registrada</h3><p class="muted">Obrigado pelo interesse. Retornaremos pelo e-mail informado. Enquanto isso, explore a <a class="link" href="matriz.html">Matriz Pessoas × KPIs</a> ou o <a class="link" href="laboratorio.html">Laboratório de impacto</a>.</p></div>';
      }).catch(function () {
        err.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.'; err.hidden = false;
        btn.disabled = false; btn.textContent = 'Enviar mensagem';
      });
    });
  }

  /* ---------- Home ---------- */
  function initHome() {
    // Equação
    var legend = $('eq-legend');
    if (legend) {
      var terms = document.querySelectorAll('.eq-term');
      var show = function (id) {
        var t = P.EQ.filter(function (x) { return x.id === id; })[0];
        Array.prototype.forEach.call(terms, function (b) { b.setAttribute('aria-pressed', b.dataset.term === id ? 'true' : 'false'); });
        legend.innerHTML = '<p class="who">' + esc(t.titulo) + ' <span class="disc">— ' + esc(t.disc) + '</span></p><p>' + esc(t.texto) + '</p><p class="ex">' + esc(t.ex) + '</p>';
      };
      Array.prototype.forEach.call(terms, function (b) {
        b.addEventListener('click', function () { show(b.dataset.term); });
      });
      show('fator');
    }

    // Convergências
    var cv = $('conv-list');
    if (cv) cv.innerHTML = D.CONVERGENCIAS.map(function (c) { return '<li><a href="as-duas-disciplinas.html#' + c.id + '">' + esc(c.titulo) + '</a></li>'; }).join('');

    // Gráfico do exemplo
    var sc = $('scatter');
    if (sc) sc.innerHTML = scatterSVG(P.EXEMPLO);

    // Dores
    var pains = $('pains');
    if (pains) {
      pains.innerHTML = P.DORES.map(function (d, i) {
        return '<li class="pain"><button aria-expanded="false" aria-controls="dor-' + i + '"><h3>' + esc(d.titulo) + '</h3><span class="sym" aria-hidden="true">+</span></button>' +
          '<div class="pain-body" id="dor-' + i + '" hidden>' +
            '<div><h4>Como aparece</h4><p>' + esc(d.sintoma) + '</p></div>' +
            '<div><h4>Como a Psiconometria aborda</h4><p>' + esc(d.abordagem) + '</p></div>' +
            '<div><h4>Primeiro passo</h4><p>' + esc(d.passo) + '</p></div>' +
            '<p class="go"><a class="link" href="' + d.link.href + '">' + esc(d.link.texto) + '</a></p>' +
          '</div></li>';
      }).join('');
      Array.prototype.forEach.call(pains.querySelectorAll('.pain > button'), function (b) {
        b.addEventListener('click', function () {
          var open = b.getAttribute('aria-expanded') !== 'true';
          b.setAttribute('aria-expanded', open ? 'true' : 'false');
          b.querySelector('.sym').textContent = open ? '−' : '+';
          $(b.getAttribute('aria-controls')).hidden = !open;
        });
      });
    }

    // Mini matriz
    var mm = $('home-matrix');
    if (mm) {
      var demo = D.FATORES.filter(function (f) { return ['seguranca-psicologica', 'lideranca', 'aprendizado'].indexOf(f.id) >= 0; });
      var sel = demo[0].id;
      var draw = function () {
        var f = demo.filter(function (x) { return x.id === sel; })[0];
        mm.innerHTML =
          '<div><h3 class="sr-only">Escolha um fator humano</h3><ul class="pick">' + demo.map(function (x) {
            return '<li><button data-id="' + x.id + '"' + (x.id === sel ? ' aria-current="true"' : '') + '>' + esc(x.nome) + '</button></li>';
          }).join('') + '</ul><p class="small" style="margin-top:1rem"><a class="link" href="matriz.html">Ver os 16 fatores</a></p></div>' +
          '<div class="detail"><div class="method-top"><h3>' + esc(f.nome) + '</h3>' + ev(f.evidencia, 'Evidência') + '</div>' +
            chainHTML(f.cadeia, ['Comportamento', 'Efeito no processo', 'Indicador antecedente', 'KPI operacional', 'KPI financeiro'], false) + '</div>';
        Array.prototype.forEach.call(mm.querySelectorAll('.pick button'), function (b) {
          b.addEventListener('click', function () { sel = b.dataset.id; draw(); });
        });
      };
      draw();
    }
  }

  function chainHTML(items, labels, horizontal) {
    return '<ol class="chain' + (horizontal ? ' h' : '') + '" style="margin-top:1.25rem">' + items.map(function (s, i) {
      return '<li><span class="step">' + esc(labels[i]) + '</span><span class="txt">' + esc(s) + '</span></li>';
    }).join('') + '</ol>';
  }

  function scatterSVG(E) {
    var W = 640, H = 400, L = 64, R = 24, T = 20, B = 64;
    var x0 = 2, x1 = 5, y0 = 4, y1 = 14;
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (W - L - R); };
    var Y = function (v) { return T + (y1 - v) / (y1 - y0) * (H - T - B); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="sc-t sc-d" style="width:100%;max-width:' + W + 'px;height:auto">' +
      '<title id="sc-t">Retrabalho por índice de segurança psicológica, 24 equipes</title>' +
      '<desc id="sc-d">Gráfico de dispersão com dados fictícios. Equipes com índice mais alto tendem a ter menos retrabalho, mas a dispersão é grande.</desc>';
    for (var gx = 2; gx <= 5; gx += 0.5) s += '<line x1="' + X(gx) + '" x2="' + X(gx) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#e3e3e3"/>' +
      '<text x="' + X(gx) + '" y="' + (H - B + 20) + '" font-size="12" text-anchor="middle" fill="#5f6062">' + fmt(gx, 1) + '</text>';
    for (var gy = 4; gy <= 14; gy += 2) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(gy) + '" y2="' + Y(gy) + '" stroke="#e3e3e3"/>' +
      '<text x="' + (L - 10) + '" y="' + (Y(gy) + 4) + '" font-size="12" text-anchor="end" fill="#5f6062">' + gy + '%</text>';
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="#000"/>';
    s += '<line x1="' + L + '" x2="' + L + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#000"/>';
    var lx0 = 2.3, lx1 = 4.7;
    s += '<line x1="' + X(lx0) + '" y1="' + Y(E.a + E.b * lx0) + '" x2="' + X(lx1) + '" y2="' + Y(E.a + E.b * lx1) + '" stroke="#a31f34" stroke-width="2"/>';
    E.pontos.forEach(function (p) { s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="4.5" fill="#fff" stroke="#000" stroke-width="1.4"/>'; });
    s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 16) + '" font-size="13" text-anchor="middle" fill="#000">Índice de segurança psicológica da equipe (escala 1 a 5)</text>';
    s += '<text transform="translate(16 ' + ((T + H - B) / 2) + ') rotate(-90)" font-size="13" text-anchor="middle" fill="#000">Retrabalho (% das entregas)</text>';
    s += '<text x="' + X(2.3) + '" y="' + (Y(E.a + E.b * 2.3) - 10) + '" font-size="12" fill="#a31f34">tendência estimada</text>';
    return s + '</svg>';
  }

  /* ---------- O que é ---------- */
  function initConceito() {
    var root = $('conceito-diagram');
    if (root) {
      var ativo = null;
      var render = function () {
        var h = P.HUMANA.filter(function (c) { return c.id === ativo; })[0];
        var lig = h ? h.ligacoes : [];
        root.innerHTML =
          '<div class="layers">' +
            '<div><p class="layer-name">Camada humana</p><div class="layer layer-h">' + P.HUMANA.map(function (n) {
              return '<button data-id="' + n.id + '" aria-pressed="' + (ativo === n.id) + '">' + esc(n.nome) + '</button>';
            }).join('') + '</div></div>' +
            '<p class="layer-sep">' + (ativo ? 'Conexões plausíveis destacadas' : 'Influência indireta, mediada por processos') + '</p>' +
            '<div><p class="layer-name">Camada empresarial</p><div class="layer layer-e">' + P.EMPRESARIAL.map(function (n) {
              return '<div class="' + (lig.indexOf(n.id) >= 0 ? 'on' : '') + '"><b>' + esc(n.nome) + '</b><span>' + esc(n.desc) + '</span></div>';
            }).join('') + '</div></div>' +
          '</div>' +
          '<div class="layer-desc" aria-live="polite">' + (h ? '<b>' + esc(h.nome) + '.</b> ' + esc(h.desc) : 'Selecione um elemento da camada humana para ver sua descrição e suas conexões plausíveis.') + '</div>';
        Array.prototype.forEach.call(root.querySelectorAll('.layer-h button'), function (b) {
          b.addEventListener('click', function () { ativo = ativo === b.dataset.id ? null : b.dataset.id; render(); });
        });
      };
      render();
    }
    var dr = $('conceito-distincoes');
    if (dr) dr.innerHTML = P.DISTINCOES.map(function (i) { return '<div><dt>' + esc(i.t) + '</dt><dd>' + esc(i.d) + '</dd></div>'; }).join('');
  }

  /* ---------- Disciplinas ---------- */
  function initDisciplinas() {
    var root = $('disc-root');
    if (!root) return;
    var GRUPOS = {
      psicometria: { nome: 'Psicometria', dados: D.PSICOMETRIA, intro: 'A ciência da medida psicológica: como transformar características humanas em dados confiáveis, válidos e justos.' },
      econometria: { nome: 'Econometria', dados: D.ECONOMETRIA, intro: 'Métodos quantitativos aplicados a dados econômicos: como estimar relações, quantificar incerteza e aproximar causalidade.' },
      convergencias: { nome: 'Convergências', dados: D.CONVERGENCIAS, intro: 'Onde as duas disciplinas se encontram — o terreno da Psiconometria.' }
    };
    var keys = Object.keys(GRUPOS), grupo = 'convergencias', sel = D.CONVERGENCIAS[0].id;
    function fromHash() {
      var hash = location.hash.replace('#', ''), hit = false;
      if (hash) keys.forEach(function (k) { if (GRUPOS[k].dados.some(function (d) { return d.id === hash; })) { grupo = k; sel = hash; hit = true; } });
      return hit;
    }
    fromHash();
    window.addEventListener('hashchange', function () { if (fromHash()) render(true); });

    function render(focusDetail) {
      var g = GRUPOS[grupo];
      var item = g.dados.filter(function (d) { return d.id === sel; })[0] || g.dados[0];
      root.innerHTML =
        '<div class="tabs" role="tablist">' + keys.map(function (k) { return '<button role="tab" data-g="' + k + '" aria-selected="' + (k === grupo) + '">' + GRUPOS[k].nome + '</button>'; }).join('') + '</div>' +
        '<p class="lede" style="font-size:1.0625rem">' + esc(g.intro) + '</p>' +
        '<div class="split split-5-7" style="margin-top:2rem">' +
          '<ol class="pick">' + g.dados.map(function (d, i) {
            return '<li id="' + d.id + '"><button data-id="' + d.id + '"' + (d.id === item.id ? ' aria-current="true"' : '') + '><span class="n">' + (i + 1) + '</span><span>' + esc(d.titulo) + '</span></button></li>';
          }).join('') + '</ol>' +
          '<article class="detail" id="disc-detail" tabindex="-1"><h2>' + esc(item.titulo) + '</h2><dl class="rows rows-2" style="margin-top:1.5rem">' +
            [['Definição simples', item.definicao], ['Exemplo organizacional', item.exemplo], ['Método de análise', item.metodo], ['Decisão que pode apoiar', item.decisao], ['Limitações', item.limitacoes], ['Nível de evidência', item.evidencia]].map(function (r) {
              return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>';
            }).join('') +
          '</dl></article>' +
        '</div>';
      Array.prototype.forEach.call(root.querySelectorAll('.tabs button'), function (b) {
        b.addEventListener('click', function () { grupo = b.dataset.g; sel = GRUPOS[grupo].dados[0].id; render(); });
      });
      Array.prototype.forEach.call(root.querySelectorAll('.pick button'), function (b) {
        b.addEventListener('click', function () { sel = b.dataset.id; render(!mq('(min-width:1000px)')); });
      });
      if (focusDetail) { var dt = $('disc-detail'); dt.focus({ preventScroll: true }); dt.scrollIntoView({ block: 'start' }); }
    }
    render();
  }

  /* ---------- Catálogo ---------- */
  function initCatalogo() {
    var root = $('catalogo-root');
    if (!root) return;
    var ALL = 'todos';
    var state = { busca: '', finalidade: ALL, tipo: ALL, evidencia: ALL, aplicacao: ALL, restrito: ALL, licenca: ALL };
    var filtros = [
      ['finalidade', 'Finalidade', ['Seleção', 'Desenvolvimento', 'Equipes', 'Liderança', 'Cultura']],
      ['tipo', 'Tipo de construto', ['Traço', 'Estado', 'Preferência', 'Competência', 'Comportamento', 'Percepção']],
      ['evidencia', 'Nível de evidência', ['Alta', 'Moderada', 'Limitada', 'Em debate']],
      ['aplicacao', 'Aplicação', ['Individual', 'Coletiva', 'Organizacional']],
      ['restrito', 'Restrição', [['sim', 'Restrito a psicólogos'], ['nao', 'Não restrito']]],
      ['licenca', 'Licença', ['Gratuito', 'Licenciado', 'Proprietário']]
    ];
    root.innerHTML =
      '<div class="filters">' +
        '<div class="field search"><label for="cat-busca">Buscar</label><input type="search" id="cat-busca" placeholder="Buscar método ou construto…"></div>' +
        filtros.map(function (f) {
          return '<div class="field"><label for="f-' + f[0] + '">' + f[1] + '</label><select id="f-' + f[0] + '" data-k="' + f[0] + '"><option value="' + ALL + '">Todos</option>' +
            f[2].map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="' + v + '">' + l + '</option>'; }).join('') + '</select></div>';
        }).join('') +
      '</div>' +
      '<p class="count" id="cat-count" aria-live="polite"></p><div id="cat-list"></div>';
    $('cat-busca').addEventListener('input', function (e) { state.busca = e.target.value; render(); });
    Array.prototype.forEach.call(root.querySelectorAll('select'), function (s) { s.addEventListener('change', function () { state[s.dataset.k] = s.value; render(); }); });

    function filtered() {
      return D.METODOS.filter(function (m) {
        if (state.busca && (m.nome + ' ' + m.mede).toLowerCase().indexOf(state.busca.toLowerCase()) < 0) return false;
        if (state.finalidade !== ALL && m.finalidade.indexOf(state.finalidade) < 0) return false;
        if (state.tipo !== ALL && m.tipo !== state.tipo) return false;
        if (state.evidencia !== ALL && m.evidencia !== state.evidencia) return false;
        if (state.aplicacao !== ALL && m.aplicacao.indexOf(state.aplicacao) < 0) return false;
        if (state.restrito === 'sim' && !m.restrito) return false;
        if (state.restrito === 'nao' && m.restrito) return false;
        if (state.licenca !== ALL && m.licenca !== state.licenca) return false;
        return true;
      });
    }
    function card(m) {
      return '<article class="method">' +
        '<div class="method-top"><h3>' + esc(m.nome) + '</h3>' + ev(m.evidencia) + '</div>' +
        '<p class="mede">' + esc(m.mede) + '</p>' +
        '<dl><dt>Mede</dt><dd>' + esc(m.tipo) + '</dd><dt>Uso</dt><dd>' + esc(m.uso) + '</dd><dt>KPIs</dt><dd>' + esc(m.kpis.join(', ')) + '</dd><dt>Licença</dt><dd>' + esc(m.licenca) + (m.restrito ? ', restrito a psicólogos' : '') + '</dd></dl>' +
        '<div class="pr">' + (m.mecanismo ? '<p style="margin:0"><b>Mecanismo até o KPI.</b> ' + esc(m.mecanismo) + '</p>' : '') + '<p style="margin:0"><b>Potencial.</b> ' + esc(m.potencial) + '</p><p style="margin:0"><b>Riscos e limites.</b> ' + esc(m.riscos) + '</p></div>' +
        '<p class="src">' + esc(m.satepsi) + '. Fonte: ' + esc(m.fonte) + '</p>' +
      '</article>';
    }
    function render() {
      var list = filtered();
      $('cat-count').textContent = list.length + ' de ' + D.METODOS.length + ' métodos';
      if (!list.length) { $('cat-list').innerHTML = '<p class="empty">Nenhum método corresponde aos filtros. Amplie os critérios ou limpe a busca.</p>'; return; }
      $('cat-list').innerHTML = D.FAMILIAS.map(function (fam) {
        var itens = list.filter(function (m) { return m.familia === fam.id; });
        if (!itens.length) return '';
        return '<section class="family"><h2>' + esc(fam.nome) + ' <span class="muted small">' + itens.length + '</span></h2><div class="methods">' + itens.map(card).join('') + '</div></section>';
      }).join('');
    }
    render();
  }

  /* ---------- Matriz ---------- */
  function initMatriz() {
    var root = $('matriz-root');
    if (!root) return;
    var sel = 'seguranca-psicologica';
    var ETAPAS = ['Comportamento observável', 'Efeito no processo', 'Indicador antecedente', 'KPI operacional', 'KPI financeiro'];
    function render(focusDetail) {
      var f = D.FATORES.filter(function (x) { return x.id === sel; })[0];
      var kpis = D.KPIS.filter(function (k) { return f.kpis.indexOf(k.id) >= 0; });
      root.innerHTML =
        '<div><h2 class="sr-only">Fatores humanos</h2><ul class="pick factor-list">' + D.FATORES.map(function (x) {
          return '<li><button data-id="' + x.id + '"' + (x.id === sel ? ' aria-current="true"' : '') + '>' + esc(x.nome) + '</button></li>';
        }).join('') + '</ul></div>' +
        '<article class="detail" id="mx-detail" tabindex="-1">' +
          '<div class="method-top"><h2>' + esc(f.nome) + '</h2>' + ev(f.evidencia, 'Evidência') + '</div>' +
          '<p class="muted" style="margin-top:0.75rem;max-width:var(--measure)">' + esc(f.descricao) + '</p>' +
          '<figure class="fig" style="margin-top:1.75rem"><div class="fig-frame">' + chainHTML(f.cadeia, ETAPAS, true) + '</div><figcaption><b>Cadeia de mecanismo.</b>Cada elo é uma hipótese a medir; o efeito enfraquece a cada passo.</figcaption></figure>' +
          '<div class="cols-2" style="margin-top:2rem"><div><h3>Impacto positivo plausível</h3><p class="muted" style="margin-top:0.5rem">' + esc(f.positivo) + '</p></div><div><h3>Impacto negativo plausível</h3><p class="muted" style="margin-top:0.5rem">' + esc(f.negativo) + '</p></div></div>' +
          '<dl class="rows rows-2" style="margin-top:1.5rem">' +
            '<div><dt>Variáveis moderadoras</dt><dd><span class="tags">' + f.moderadoras.map(function (m) { return '<span class="tag">' + esc(m) + '</span>'; }).join('') + '</span></dd></div>' +
            '<div><dt>Prazo provável</dt><dd>' + esc(f.prazo) + '</dd></div>' +
            '<div><dt>Dados necessários</dt><dd>' + esc(f.dados.join('; ')) + '</dd></div>' +
            '<div><dt>KPIs potencialmente relacionados</dt><dd><span class="tags">' + kpis.map(function (k) {
              return '<span class="tag' + (k.distal ? ' tag-dash' : '') + '"' + (k.distal ? ' title="Resultado distal — influência indireta"' : '') + '>' + esc(k.nome) + (k.distal ? ' (distal)' : '') + '</span>';
            }).join('') + '</span></dd></div>' +
          '</dl>' +
          ((f.evidencia === 'Emergente' || f.evidencia === 'Hipótese') ? '<p class="note" style="margin-top:1.5rem"><b>Atenção.</b> Para este fator, a relação com resultados é majoritariamente hipótese ou correlação. Trate como pergunta a testar, não como alavanca garantida.</p>' : '') +
        '</article>';
      Array.prototype.forEach.call(root.querySelectorAll('.pick button'), function (b) {
        b.addEventListener('click', function () { sel = b.dataset.id; render(!mq('(min-width:1000px)')); });
      });
      if (focusDetail) { var dt = $('mx-detail'); dt.focus({ preventScroll: true }); dt.scrollIntoView({ block: 'start' }); }
    }
    render();
  }

  /* ---------- Laboratório ---------- */
  function initLaboratorio() {
    var root = $('lab-root');
    if (!root) return;
    var st = { empregados: 250, faturamento: 80, salario: 6000, turnover: 18, absenteismo: 5, retrabalho: 8, investimento: 300 };
    function BRL(v) { return v >= 1e6 ? 'R$ ' + (v / 1e6).toFixed(1).replace('.', ',') + ' mi' : 'R$ ' + Math.round(v / 1e3) + ' mil'; }
    var campos = [
      ['empregados', 'Empregados', 20, 5000, 10, ''],
      ['faturamento', 'Faturamento anual', 5, 1000, 5, ' mi'],
      ['salario', 'Salário médio mensal', 2000, 25000, 250, ''],
      ['turnover', 'Turnover anual', 2, 60, 1, '%'],
      ['absenteismo', 'Absenteísmo', 1, 20, 0.5, '%'],
      ['retrabalho', 'Retrabalho', 1, 30, 1, '%'],
      ['investimento', 'Investimento previsto', 50, 3000, 50, ' mil']
    ];
    function show(k, un) { var v = st[k]; return (k === 'salario' || k === 'faturamento' || k === 'investimento' ? 'R$ ' : '') + v.toLocaleString('pt-BR') + un; }
    root.innerHTML =
      '<div class="lab-in"><h2 style="font-size:1.25rem">Premissas da sua empresa</h2><div style="margin-top:1rem;border-top:1px solid var(--ink)">' +
        campos.map(function (c) {
          return '<div class="row"><div class="row-top"><label for="in-' + c[0] + '">' + c[1] + '</label><output id="val-' + c[0] + '" for="in-' + c[0] + '">' + show(c[0], c[5]) + '</output></div>' +
            '<input type="range" id="in-' + c[0] + '" data-k="' + c[0] + '" data-u="' + c[5] + '" min="' + c[2] + '" max="' + c[3] + '" step="' + c[4] + '" value="' + st[c[0]] + '"></div>';
        }).join('') +
      '</div><p class="small muted" style="margin-top:1rem">Premissas fixas do modelo: reposição ≈ 60% do salário anual por saída; 35% do valor do retrabalho vira custo; reduções relativas de 5%, 10% e 20% nos três custos, por cenário.</p></div>' +
      '<div id="lab-out" aria-live="polite"></div>';
    Array.prototype.forEach.call(root.querySelectorAll('input[type="range"]'), function (inp) {
      inp.addEventListener('input', function () { st[inp.dataset.k] = Number(inp.value); $('val-' + inp.dataset.k).textContent = show(inp.dataset.k, inp.dataset.u); compute(); });
    });
    function compute() {
      var salAno = st.salario * 13.3;
      var custoTurn = st.empregados * (st.turnover / 100) * salAno * 0.6;
      var custoAbs = st.empregados * salAno * (st.absenteismo / 100);
      var custoRetr = st.faturamento * 1e6 * (st.retrabalho / 100) * 0.35;
      var cen = [{ nome: 'Conservador', f: 0.05 }, { nome: 'Central', f: 0.1 }, { nome: 'Otimista', f: 0.2 }].map(function (c) {
        var eco = (custoTurn + custoAbs + custoRetr) * c.f;
        return { nome: c.nome, economia: eco, min: eco * 0.5, max: eco * 1.6, roi: eco / (st.investimento * 1e3) };
      });
      var maxEco = Math.max.apply(null, cen.map(function (c) { return c.max; }));
      var sens = [{ nome: 'Turnover', v: custoTurn }, { nome: 'Retrabalho', v: custoRetr }, { nome: 'Absenteísmo', v: custoAbs }].sort(function (a, b) { return b.v - a.v; });
      $('lab-out').innerHTML =
        '<h2 style="font-size:1.25rem">Custo anual estimado hoje</h2>' +
        '<div class="kpis3" style="margin-top:1rem">' + [['Turnover', custoTurn], ['Absenteísmo', custoAbs], ['Retrabalho', custoRetr]].map(function (r) {
          return '<div><p class="lbl" style="margin:0">' + r[0] + '</p><p class="val" style="margin:0">' + BRL(r[1]) + '</p></div>';
        }).join('') + '</div>' +
        '<h2 style="font-size:1.25rem;margin-top:2.5rem">Economia anual possível, por cenário (faixas = incerteza)</h2><p class="small muted" style="margin-top:0.375rem">O quadrado marca a estimativa; a linha, a faixa de incerteza.</p>' +
        cen.map(function (c) {
          return '<div class="scen"><div class="scen-top"><b>' + c.nome + '</b><span class="r">' + BRL(c.min) + ' a ' + BRL(c.max) + '; retorno de ' + c.roi.toFixed(1).replace('.', ',') + '× o investimento</span></div>' +
            '<div class="scen-bar"><span class="range" style="left:' + (c.min / maxEco * 100) + '%;width:' + ((c.max - c.min) / maxEco * 100) + '%"></span><span class="pt" style="left:' + (c.economia / maxEco * 100) + '%"></span></div></div>';
        }).join('') +
        '<div class="cols-2" style="margin-top:2.5rem">' +
          '<div><h3>Sensibilidade</h3><p class="muted" style="margin-top:0.5rem">A variável que mais move o resultado é <strong>' + sens[0].nome.toLowerCase() + '</strong>. Comece medindo-a bem antes de investir.</p></div>' +
          '<div><h3>Prazo e acompanhamento</h3><p class="muted" style="margin-top:0.5rem">Sinais em 1–2 trimestres; efeitos financeiros em 3–6. Acompanhe indicadores antecedentes (relatos de erro, adesão, pulso) além dos financeiros.</p></div>' +
        '</div>' +
        '<div class="panel" style="margin-top:2rem"><h3>Como testar de verdade</h3><ul class="check-list yes" style="margin-top:0.75rem"><li>Piloto em algumas equipes, com linha de base registrada antes.</li><li>Grupo de comparação semelhante que não recebe a intervenção.</li><li>Séries históricas para separar tendência de efeito.</li><li>Diferenças-em-diferenças para estimar o efeito incremental.</li></ul></div>' +
        '<p class="note" style="margin-top:1.5rem"><b>Estimativas ilustrativas, não fatos.</b> Os multiplicadores são premissas didáticas; a sua organização precisa estimá-los com os próprios dados.</p>';
    }
    compute();
  }

  /* ---------- Glossário ---------- */
  function initGlossario() {
    var root = $('gloss-root');
    if (!root) return;
    root.innerHTML = '<div class="field" style="max-width:28rem"><label for="gl-busca">Buscar termo</label><input type="search" id="gl-busca" placeholder="Buscar termo…"></div><p class="count" id="gl-count" aria-live="polite"></p><dl class="terms" id="gl-list" style="margin-top:1rem;border-top:1px solid var(--ink)"></dl>';
    var busca = '';
    function render() {
      var termos = D.GLOSSARIO.filter(function (g) { return !busca || (g.termo + ' ' + g.definicao).toLowerCase().indexOf(busca.toLowerCase()) >= 0; })
        .sort(function (a, b) { return a.termo.localeCompare(b.termo, 'pt-BR'); });
      $('gl-count').textContent = termos.length + ' de ' + D.GLOSSARIO.length + ' termos';
      $('gl-list').innerHTML = termos.length ? termos.map(function (g) {
        return '<div><dt>' + esc(g.termo) + '</dt><dd>' + esc(g.definicao) + '<p class="ex" style="margin-bottom:0">' + esc(g.exemplo) + '</p></dd></div>';
      }).join('') : '<p class="empty">Nenhum termo encontrado para "' + esc(busca) + '". Tente uma palavra mais curta.</p>';
    }
    $('gl-busca').addEventListener('input', function (e) { busca = e.target.value; render(); });
    render();
  }

  /* ---------- Casos ---------- */
  function initCasos() {
    var root = $('casos-root');
    if (!root) return;
    root.innerHTML = D.CASOS.map(function (c) {
      var rows = [['Problema', c.problema], ['Hipótese', c.hipotese], ['Dados utilizados', c.dados], ['Método', c.metodo], ['Intervenção', c.intervencao], ['Resultados informados', c.resultados]];
      return '<article class="case" id="' + c.id + '"><div class="split">' +
        '<div><span class="tag">' + esc(c.tipo) + '</span><h2>' + esc(c.titulo) + '</h2><p class="case-meta">' + esc(c.organizacao) + ', ' + esc(String(c.ano)) + '</p>' +
          '<p class="muted" style="margin-top:1rem">' + esc(c.resumo) + '</p>' +
          '<p><a class="link" href="' + esc(c.fonte.url) + '" target="_blank" rel="noopener noreferrer">Fonte original<span class="sr-only"> (abre em nova aba)</span></a>' + (c.fonte.nome ? ' <span class="small muted">' + esc(c.fonte.nome) + '</span>' : '') + '</p></div>' +
        '<div><dl class="rows rows-2">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<div class="cols-2" style="margin-top:1.5rem"><div class="panel"><h3>Limitações</h3><p class="muted" style="margin-top:0.5rem">' + esc(c.limitacoes) + '</p></div><div class="panel"><h3>O que pode ser aprendido</h3><p class="muted" style="margin-top:0.5rem">' + esc(c.aprendizado) + '</p></div></div>' +
        '</div></div></article>';
    }).join('');
  }

  /* ---------- Método ---------- */
  function initMetodo() {
    var ol = $('metodo-list');
    if (ol) ol.innerHTML = P.ETAPAS.map(function (e) { return '<li><h3>' + esc(e.t) + '</h3><p>' + esc(e.d) + '</p></li>'; }).join('');
    var ul = $('metodo-verificar');
    if (ul) ul.innerHTML = P.VERIFICAR.map(function (v) { return '<li class="tag">' + esc(v) + '</li>'; }).join('');
  }

  /* ---------- Sobre ---------- */
  function initSobre() {
    var root = $('sobre-principios');
    if (root) root.innerHTML = P.BLOCOS.map(function (b) {
      return '<section><h3>' + esc(b.titulo) + '</h3><ul class="check-list yes" style="margin-top:0.75rem">' + b.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></section>';
    }).join('');
    initContact();
  }

  function init() {
    renderHeader();
    renderFooter();
    var page = document.body.getAttribute('data-page');
    ({ home: initHome, conceito: initConceito, disciplinas: initDisciplinas, catalogo: initCatalogo, matriz: initMatriz, laboratorio: initLaboratorio, glossario: initGlossario, casos: initCasos, metodo: initMetodo, sobre: initSobre }[page] || function () {})();
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
