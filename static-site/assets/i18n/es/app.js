/* Gerado por tools/i18n.mjs a partir de assets/app.js — não editar. */
/* Psiconometria — lógica do site estático.
   Cabeçalho e rodapé compartilhados, interatividade de cada página e envio de formulários. */
(function () {
  'use strict';
  var D = window.PSICO_DATA;
  var P = window.PSICO_PAGES;
  var CFG = window.PSICO_CONFIG || {};
  // T(): marca textos de interface. Em português devolve o próprio texto; nas outras
  // línguas o tools/i18n.mjs substitui o literal pela tradução. {chave} = valor inserido.
  function T(s, vals) { return vals ? s.replace(/\{(\w+)\}/g, function (m, k) { return vals[k] != null ? vals[k] : m; }) : s; }
  var LOC = document.documentElement.lang || 'pt-BR';
  var LANG = LOC.slice(0, 2);
  var UNITS = { pt: ['mi', 'mil'], en: ['M', 'k'], de: ['Mio.', 'Tsd.'], es: ['M', 'mil'] }[LANG] || ['mi', 'mil'];

  // Idiomas do site: português na raiz, os demais em pastas próprias. Nomes no próprio idioma.
  var LANGS = [
    { code: 'pt', name: 'Português', dir: '/', flag: '<rect width="20" height="14" fill="#009c3b"/><path d="M10 1.7 18.3 7 10 12.3 1.7 7z" fill="#ffdf00"/><circle cx="10" cy="7" r="3" fill="#002776"/>' },
    { code: 'en', name: 'English', dir: '/en/', flag: '<rect width="20" height="14" fill="#fff"/><rect x="8.5" width="3" height="14" fill="#ce1124"/><rect y="5.5" width="20" height="3" fill="#ce1124"/>' },
    { code: 'de', name: 'Deutsch', dir: '/de/', flag: '<rect width="20" height="4.67" fill="#000"/><rect y="4.67" width="20" height="4.67" fill="#dd0000"/><rect y="9.33" width="20" height="4.67" fill="#ffce00"/>' },
    { code: 'es', name: 'Español', dir: '/es/', flag: '<rect width="20" height="14" fill="#aa151b"/><rect y="3.5" width="20" height="7" fill="#f1bf00"/>' }
  ];
  function flagSVG(l) { return '<svg class="flag" viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false">' + l.flag + '</svg>'; }

  var NAV = [
    { to: 'o-que-e.html', label: T('El concepto') },
    { to: 'as-duas-disciplinas.html', label: T('Disciplinas') },
    { to: 'metodo.html', label: T('Método') },
    { to: 'matriz.html', label: T('Matriz') },
    { to: 'laboratorio.html', label: T('Laboratorio') },
    { to: 'casos.html', label: T('Casos') },
    { to: 'catalogo.html', label: T('Catálogo') },
    { to: 'glossario.html', label: T('Glosario') },
    { to: 'sobre.html', label: T('Acerca de') }
  ];

  /* ---------- utilitários ---------- */
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function mq(q) { return window.matchMedia(q).matches; }
  function current() { var p = location.pathname.split('/').pop(); return p === '' ? 'index.html' : p; }
  function fmt(n, d) { return n.toLocaleString(LOC, { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }

  var EV_LEVEL = { [T('Fuerte')]: 4, [T('Alta')]: 4, [T('Moderada')]: 3, [T('Emergente')]: 2, [T('Limitada')]: 2, [T('Hipótesis')]: 1, [T('En debate')]: 1 };
  function ev(label, prefix) {
    var n = EV_LEVEL[label] || 0, bars = '';
    for (var i = 1; i <= 4; i++) bars += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return '<span class="ev" title="' + T('Nivel de evidencia') + ': ' + esc(label) + '"><span class="ev-bar" aria-hidden="true">' + bars + '</span>' + (prefix ? prefix + ' ' : '') + esc(LANG === 'de' ? label : label.toLowerCase()) + '</span>';
  }

  /* ---------- cabeçalho e rodapé ---------- */
  function renderHeader() {
    var head = $('site-header');
    if (!head) return;
    var cur = current();
    head.className = 'site-header';
    head.innerHTML =
      '<a class="skip" href="#conteudo">' + T('Saltar al contenido') + '</a>' +
      '<div class="wrap">' +
        '<a class="brand" href="index.html"><span class="brand-mark">Psiconometria</span><span class="brand-sub">' + T('Personas, datos y resultados empresariales') + '</span></a>' +
        langSwitcher(cur) +
        '<button class="menu-btn" id="menu-btn" aria-expanded="false" aria-controls="nav">' + T('Menú') + '</button>' +
        '<nav class="nav" id="nav" aria-label="' + T('Navegación principal') + '">' +
          NAV.map(function (n) { return '<a href="' + n.to + '"' + (n.to === cur ? ' aria-current="page"' : '') + '>' + n.label + '</a>'; }).join('') +
          '<a class="nav-cta" href="sobre.html#contato">' + T('Contacto') + '</a>' +
        '</nav>' +
      '</div>';
    initLangSwitcher();
    var btn = $('menu-btn'), nav = $('nav');
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? T('Cerrar') : T('Menú');
    });
  }

  function langSwitcher(cur) {
    var me = LANGS.filter(function (l) { return l.code === LANG; })[0] || LANGS[0];
    var page = cur === 'index.html' ? '' : cur;
    return '<div class="lang" id="lang">' +
      '<button class="lang-btn" id="lang-btn" aria-expanded="false" aria-controls="lang-list" aria-label="' + T('Idioma') + ': ' + me.name + '">' + flagSVG(me) + '<span class="lang-code">' + me.code.toUpperCase() + '</span></button>' +
      '<ul class="lang-list" id="lang-list" hidden>' + LANGS.map(function (l) {
        return '<li><a href="' + l.dir + page + '" hreflang="' + l.code + '" lang="' + l.code + '"' + (l.code === LANG ? ' aria-current="true"' : '') + '>' + flagSVG(l) + '<span>' + l.name + '</span></a></li>';
      }).join('') + '</ul></div>';
  }

  function initLangSwitcher() {
    var btn = $('lang-btn'), list = $('lang-list'), box = $('lang');
    if (!btn) return;
    function set(open) { list.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(list.hidden); });
    document.addEventListener('click', function (e) { if (!box.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !list.hidden) { set(false); btn.focus(); } });
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
            '<p class="about">' + T('Un enfoque integrado que combina la medición rigurosa de las características humanas con métodos cuantitativos de análisis económico para comprender cómo las personas, los comportamientos, las relaciones y las decisiones influyen en los procesos y los resultados empresariales.') + '</p>' +
            '<div class="nl" id="nl">' +
              '<h2>' + T('Reciba nuevos estudios') + '</h2>' +
              '<form id="nl-form" novalidate>' +
                '<label class="sr-only" for="newsletter-email">' + T('Su correo electrónico') + '</label>' +
                '<input type="email" id="newsletter-email" name="email" placeholder="' + T('su@email.com') + '" autocomplete="email" required>' +
                '<input class="hp" type="text" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">' +
                '<button class="btn" type="submit">' + T('Suscribirse') + '</button>' +
              '</form>' +
              '<p class="form-msg" id="nl-msg" role="status" aria-live="polite"></p>' +
            '</div>' +
          '</div>' +
          '<div><h2>' + T('Navegación') + '</h2><ul>' + NAV.map(function (n) { return '<li><a href="' + n.to + '">' + n.label + '</a></li>'; }).join('') + '<li><a href="sobre.html#contato">' + T('Contacto') + '</a></li></ul></div>' +
          '<div>' +
            '<h2>' + T('Compromiso metodológico') + '</h2>' +
            '<ul class="commit">' +
              '<li>' + T('La correlación no demuestra causalidad.') + '</li>' +
              '<li>' + T('Ningún instrumento debe usarse de forma aislada en decisiones de alto impacto.') + '</li>' +
              '<li>' + T('Los tests psicológicos de uso exclusivo exigen profesionales habilitados.') + '</li>' +
              '<li>' + T('Toda afirmación factual indica la fuente, el año y el tipo de evidencia.') + '</li>' +
            '</ul>' +
            '<p class="sources">' + T('Fuentes de referencia: APA, AERA/NCME, CFP/SATEPSI, OECD, World Bank, Google re:Work, Gallup, Our World in Data.') + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + ' Psiconometria. ' + T('Concepto de autor en desarrollo.') + '</span><span>www.psiconometria.com</span></div>' +
      '</div>';
    initNewsletter();
  }

  /* ---------- envio de formulários ---------- */
  function post(kind, payload) {
    var url = kind === 'contact' ? CFG.CONTACT_URL : CFG.SUBSCRIBE_URL;
    if (!url) return Promise.reject(new Error('sem-endpoint'));
    return fetch(url, {
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
      if (!email || !form.email.checkValidity()) { msg.className = 'form-msg err'; msg.textContent = T('Indique un correo electrónico válido para suscribirse.'); return; }
      var btn = form.querySelector('button'); btn.disabled = true; btn.textContent = T('Enviando…');
      post('subscribe', { email: email, origem: 'rodape' + (LANG !== 'pt' ? '-' + LANG : ''), site: form.site.value })
        .then(function () { form.remove(); msg.textContent = T('Suscripción registrada. Gracias.'); })
        .catch(function () { msg.className = 'form-msg err'; msg.textContent = T('No se ha podido registrar. Inténtelo de nuevo.'); btn.disabled = false; btn.textContent = T('Suscribirse'); });
    });
  }

  function initContact() {
    var root = $('contact-root');
    if (!root) return;
    root.innerHTML =
      '<form class="form" id="contact-form" novalidate>' +
        '<div class="two">' +
          '<div class="field"><label for="ct-nome">' + T('Nombre *') + '</label><input type="text" id="ct-nome" name="nome" placeholder="' + T('Su nombre') + '" autocomplete="name" maxlength="120" required></div>' +
          '<div class="field"><label for="ct-email">' + T('Correo electrónico *') + '</label><input type="email" id="ct-email" name="email" placeholder="' + T('usted@empresa.com') + '" autocomplete="email" required></div>' +
        '</div>' +
        '<div class="two">' +
          '<div class="field"><label for="ct-empresa">' + T('Empresa / institución') + ' <span class="opt">' + T('(opcional)') + '</span></label><input type="text" id="ct-empresa" name="empresa" placeholder="' + T('Opcional') + '" autocomplete="organization" maxlength="160"></div>' +
          '<div class="field"><label for="ct-interesse">' + T('Interés *') + '</label><select id="ct-interesse" name="interesse" required><option value="">' + T('Seleccione') + '</option>' +
            P.INTERESSES.map(function (i) { return '<option value="' + i.value + '">' + i.label + '</option>'; }).join('') +
          '</select></div>' +
        '</div>' +
        '<div class="field"><label for="ct-mensagem">' + T('Mensaje') + '</label><textarea id="ct-mensagem" name="mensagem" rows="5" maxlength="2000" placeholder="' + T('Describa en dos o tres frases el contexto: sector, tamaño del equipo y la pregunta de negocio que le gustaría investigar.') + '"></textarea></div>' +
        '<input class="hp" type="text" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">' +
        '<p class="form-msg err" id="ct-err" role="alert" hidden></p>' +
        '<div><button class="btn" type="submit">' + T('Enviar mensaje') + '</button></div>' +
        '<p class="small muted">' + T('Enviamos solo lo necesario para responder a su consulta. No recogemos datos psicológicos en este sitio. Consulte los principios de ética y privacidad en esta página.') + '</p>' +
      '</form>';
    var form = $('contact-form'), err = $('ct-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      var data = { nome: form.nome.value.trim(), email: form.email.value.trim(), empresa: form.empresa.value.trim(), interesse: form.interesse.value, mensagem: form.mensagem.value.trim(), origem: 'pagina-sobre' + (LANG !== 'pt' ? '-' + LANG : ''), site: form.site.value };
      if (!data.nome || !data.email || !data.interesse) { err.textContent = T('Rellene el nombre, el correo electrónico y el interés para enviar.'); err.hidden = false; return; }
      if (!form.email.checkValidity()) { err.textContent = T('El correo electrónico indicado no parece válido. Revíselo e inténtelo de nuevo.'); err.hidden = false; form.email.focus(); return; }
      var btn = form.querySelector('button[type="submit"]'); btn.disabled = true; btn.textContent = T('Enviando…');
      post('contact', data).then(function () {
        root.innerHTML = '<div class="form-done" role="status"><h3>' + T('Mensaje registrado') + '</h3><p class="muted">' + T('Gracias por su interés. Le responderemos al correo electrónico indicado. Mientras tanto, explore la <a class="link" href="matriz.html">Matriz Personas × KPI</a> o el <a class="link" href="laboratorio.html">Laboratorio de impacto</a>.') + '</p></div>';
      }).catch(function () {
        err.textContent = T('No se ha podido enviar ahora. Inténtelo de nuevo en unos instantes.'); err.hidden = false;
        btn.disabled = false; btn.textContent = T('Enviar mensaje');
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
            '<div><h4>' + T('Cómo se manifiesta') + '</h4><p>' + esc(d.sintoma) + '</p></div>' +
            '<div><h4>' + T('Cómo lo aborda la Psiconometria') + '</h4><p>' + esc(d.abordagem) + '</p></div>' +
            '<div><h4>' + T('Primer paso') + '</h4><p>' + esc(d.passo) + '</p></div>' +
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
          '<div><h3 class="sr-only">' + T('Elija un factor humano') + '</h3><ul class="pick">' + demo.map(function (x) {
            return '<li><button data-id="' + x.id + '"' + (x.id === sel ? ' aria-current="true"' : '') + '>' + esc(x.nome) + '</button></li>';
          }).join('') + '</ul><p class="small" style="margin-top:1rem"><a class="link" href="matriz.html">' + T('Ver los 16 factores') + '</a></p></div>' +
          '<div class="detail"><div class="method-top"><h3>' + esc(f.nome) + '</h3>' + ev(f.evidencia, T('Evidencia')) + '</div>' +
            chainHTML(f.cadeia, [T('Comportamiento'), T('Efecto en el proceso'), T('Indicador adelantado'), T('KPI operativo'), T('KPI financiero')], false) + '</div>';
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
    var W = 640, H = 400, L = 64, R = 24, TP = 20, B = 64;
    var x0 = 2, x1 = 5, y0 = 4, y1 = 14;
    var X = function (v) { return L + (v - x0) / (x1 - x0) * (W - L - R); };
    var Y = function (v) { return TP + (y1 - v) / (y1 - y0) * (H - TP - B); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-labelledby="sc-t sc-d" style="width:100%;max-width:' + W + 'px;height:auto">' +
      '<title id="sc-t">' + T('Retrabajo según el índice de seguridad psicológica, 24 equipos') + '</title>' +
      '<desc id="sc-d">' + T('Gráfico de dispersión con datos ficticios. Los equipos con un índice más alto tienden a tener menos retrabajo, pero la dispersión es grande.') + '</desc>';
    for (var gx = 2; gx <= 5; gx += 0.5) s += '<line x1="' + X(gx) + '" x2="' + X(gx) + '" y1="' + TP + '" y2="' + (H - B) + '" stroke="#e3e3e3"/>' +
      '<text x="' + X(gx) + '" y="' + (H - B + 20) + '" font-size="12" text-anchor="middle" fill="#5f6062">' + fmt(gx, 1) + '</text>';
    for (var gy = 4; gy <= 14; gy += 2) s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(gy) + '" y2="' + Y(gy) + '" stroke="#e3e3e3"/>' +
      '<text x="' + (L - 10) + '" y="' + (Y(gy) + 4) + '" font-size="12" text-anchor="end" fill="#5f6062">' + gy + '%</text>';
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + (H - B) + '" y2="' + (H - B) + '" stroke="#000"/>';
    s += '<line x1="' + L + '" x2="' + L + '" y1="' + TP + '" y2="' + (H - B) + '" stroke="#000"/>';
    var lx0 = 2.3, lx1 = 4.7;
    s += '<line x1="' + X(lx0) + '" y1="' + Y(E.a + E.b * lx0) + '" x2="' + X(lx1) + '" y2="' + Y(E.a + E.b * lx1) + '" stroke="#a31f34" stroke-width="2"/>';
    E.pontos.forEach(function (p) { s += '<circle cx="' + X(p[0]).toFixed(1) + '" cy="' + Y(p[1]).toFixed(1) + '" r="4.5" fill="#fff" stroke="#000" stroke-width="1.4"/>'; });
    s += '<text x="' + ((L + W - R) / 2) + '" y="' + (H - 16) + '" font-size="13" text-anchor="middle" fill="#000">' + T('Índice de seguridad psicológica del equipo (escala de 1 a 5)') + '</text>';
    s += '<text transform="translate(16 ' + ((TP + H - B) / 2) + ') rotate(-90)" font-size="13" text-anchor="middle" fill="#000">' + T('Retrabajo (% de las entregas)') + '</text>';
    s += '<text x="' + X(2.3) + '" y="' + (Y(E.a + E.b * 2.3) - 10) + '" font-size="12" fill="#a31f34">' + T('tendencia estimada') + '</text>';
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
            '<div><p class="layer-name">' + T('Capa humana') + '</p><div class="layer layer-h">' + P.HUMANA.map(function (n) {
              return '<button data-id="' + n.id + '" aria-pressed="' + (ativo === n.id) + '">' + esc(n.nome) + '</button>';
            }).join('') + '</div></div>' +
            '<p class="layer-sep">' + (ativo ? T('Conexiones plausibles destacadas') : T('Influencia indirecta, mediada por procesos')) + '</p>' +
            '<div><p class="layer-name">' + T('Capa empresarial') + '</p><div class="layer layer-e">' + P.EMPRESARIAL.map(function (n) {
              return '<div class="' + (lig.indexOf(n.id) >= 0 ? 'on' : '') + '"><b>' + esc(n.nome) + '</b><span>' + esc(n.desc) + '</span></div>';
            }).join('') + '</div></div>' +
          '</div>' +
          '<div class="layer-desc" aria-live="polite">' + (h ? '<b>' + esc(h.nome) + '.</b> ' + esc(h.desc) : T('Seleccione un elemento de la capa humana para ver su descripción y sus conexiones plausibles.')) + '</div>';
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
      psicometria: { nome: T('Psicometría'), dados: D.PSICOMETRIA, intro: T('La ciencia de la medición psicológica: cómo convertir las características humanas en datos fiables, válidos y justos.') },
      econometria: { nome: T('Econometría'), dados: D.ECONOMETRIA, intro: T('Métodos cuantitativos aplicados a datos económicos: cómo estimar relaciones, cuantificar la incertidumbre y aproximarse a la causalidad.') },
      convergencias: { nome: T('Convergencias'), dados: D.CONVERGENCIAS, intro: T('Donde se encuentran las dos disciplinas: el terreno de la Psiconometria.') }
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
            [[T('Definición sencilla'), item.definicao], [T('Ejemplo organizacional'), item.exemplo], [T('Método de análisis'), item.metodo], [T('Decisión que puede apoyar'), item.decisao], [T('Limitaciones'), item.limitacoes], [T('Nivel de evidencia'), item.evidencia]].map(function (r) {
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
      ['finalidade', T('Finalidad'), [T('Selección'), T('Desarrollo'), T('Equipos'), T('Liderazgo'), T('Cultura')]],
      ['tipo', T('Tipo de constructo'), [T('Rasgo'), T('Estado'), T('Preferencia'), T('Competencia'), T('Comportamiento'), T('Percepción')]],
      ['evidencia', T('Nivel de evidencia'), [T('Alta'), T('Moderada'), T('Limitada'), T('En debate')]],
      ['aplicacao', T('Aplicación'), [T('Individual'), T('Colectiva'), T('Organizacional')]],
      ['restrito', T('Restricción'), [['sim', T('Restringido a psicólogos')], ['nao', T('Sin restricción')]]],
      ['licenca', T('Licencia'), [T('Gratuito'), T('Con licencia'), T('Propietario')]]
    ];
    root.innerHTML =
      '<div class="filters">' +
        '<div class="field search"><label for="cat-busca">' + T('Buscar') + '</label><input type="search" id="cat-busca" placeholder="' + T('Buscar método o constructo…') + '"></div>' +
        filtros.map(function (f) {
          return '<div class="field"><label for="f-' + f[0] + '">' + f[1] + '</label><select id="f-' + f[0] + '" data-k="' + f[0] + '"><option value="' + ALL + '">' + T('Todos') + '</option>' +
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
        '<dl><dt>' + T('Mide') + '</dt><dd>' + esc(m.tipo) + '</dd><dt>' + T('Uso') + '</dt><dd>' + esc(m.uso) + '</dd><dt>KPIs</dt><dd>' + esc(m.kpis.join(', ')) + '</dd><dt>' + T('Licencia') + '</dt><dd>' + esc(m.licenca) + (m.restrito ? T(', restringido a psicólogos') : '') + '</dd></dl>' +
        '<div class="pr">' + (m.mecanismo ? '<p style="margin:0"><b>' + T('Mecanismo hasta el KPI.') + '</b> ' + esc(m.mecanismo) + '</p>' : '') + '<p style="margin:0"><b>' + T('Potencial.') + '</b> ' + esc(m.potencial) + '</p><p style="margin:0"><b>' + T('Riesgos y límites.') + '</b> ' + esc(m.riscos) + '</p></div>' +
        '<p class="src">' + esc(m.satepsi) + '. ' + T('Fuente') + ': ' + esc(m.fonte) + '</p>' +
      '</article>';
    }
    function render() {
      var list = filtered();
      $('cat-count').textContent = T('{n} de {total} métodos', { n: list.length, total: D.METODOS.length });
      if (!list.length) { $('cat-list').innerHTML = '<p class="empty">' + T('Ningún método coincide con los filtros. Amplíe los criterios o borre la búsqueda.') + '</p>'; return; }
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
    var ETAPAS = [T('Comportamiento observable'), T('Efecto en el proceso'), T('Indicador adelantado'), T('KPI operativo'), T('KPI financiero')];
    function render(focusDetail) {
      var f = D.FATORES.filter(function (x) { return x.id === sel; })[0];
      var kpis = D.KPIS.filter(function (k) { return f.kpis.indexOf(k.id) >= 0; });
      root.innerHTML =
        '<div><h2 class="sr-only">' + T('Factores humanos') + '</h2><ul class="pick factor-list">' + D.FATORES.map(function (x) {
          return '<li><button data-id="' + x.id + '"' + (x.id === sel ? ' aria-current="true"' : '') + '>' + esc(x.nome) + '</button></li>';
        }).join('') + '</ul></div>' +
        '<article class="detail" id="mx-detail" tabindex="-1">' +
          '<div class="method-top"><h2>' + esc(f.nome) + '</h2>' + ev(f.evidencia, T('Evidencia')) + '</div>' +
          '<p class="muted" style="margin-top:0.75rem;max-width:var(--measure)">' + esc(f.descricao) + '</p>' +
          '<figure class="fig" style="margin-top:1.75rem"><div class="fig-frame">' + chainHTML(f.cadeia, ETAPAS, true) + '</div><figcaption><b>' + T('Cadena de mecanismos.') + '</b>' + T('Cada eslabón es una hipótesis que medir; el efecto se debilita en cada paso.') + '</figcaption></figure>' +
          '<div class="cols-2" style="margin-top:2rem"><div><h3>' + T('Impacto positivo plausible') + '</h3><p class="muted" style="margin-top:0.5rem">' + esc(f.positivo) + '</p></div><div><h3>' + T('Impacto negativo plausible') + '</h3><p class="muted" style="margin-top:0.5rem">' + esc(f.negativo) + '</p></div></div>' +
          '<dl class="rows rows-2" style="margin-top:1.5rem">' +
            '<div><dt>' + T('Variables moderadoras') + '</dt><dd><span class="tags">' + f.moderadoras.map(function (m) { return '<span class="tag">' + esc(m) + '</span>'; }).join('') + '</span></dd></div>' +
            '<div><dt>' + T('Plazo probable') + '</dt><dd>' + esc(f.prazo) + '</dd></div>' +
            '<div><dt>' + T('Datos necesarios') + '</dt><dd>' + esc(f.dados.join('; ')) + '</dd></div>' +
            '<div><dt>' + T('KPI potencialmente relacionados') + '</dt><dd><span class="tags">' + kpis.map(function (k) {
              return '<span class="tag' + (k.distal ? ' tag-dash' : '') + '"' + (k.distal ? ' title="Resultado distal — influência indireta"' : '') + '>' + esc(k.nome) + (k.distal ? ' ' + T('(distal)') : '') + '</span>';
            }).join('') + '</span></dd></div>' +
          '</dl>' +
          ((f.evidencia === T('Emergente') || f.evidencia === T('Hipótesis')) ? '<p class="note" style="margin-top:1.5rem"><b>' + T('Atención.') + '</b> ' + T('Para este factor, la relación con los resultados es mayoritariamente hipótesis o correlación. Trátela como una pregunta que probar, no como una palanca garantizada.') + '</p>' : '') +
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
    function BRL(v) { return v >= 1e6 ? 'R$ ' + fmt(v / 1e6, 1) + ' ' + UNITS[0] : 'R$ ' + fmt(Math.round(v / 1e3), 0) + ' ' + UNITS[1]; }
    var campos = [
      ['empregados', T('Empleados'), 20, 5000, 10, ''],
      ['faturamento', T('Facturación anual'), 5, 1000, 5, ' ' + UNITS[0]],
      ['salario', T('Salario medio mensual'), 2000, 25000, 250, ''],
      ['turnover', T('Rotación anual'), 2, 60, 1, '%'],
      ['absenteismo', T('Absentismo'), 1, 20, 0.5, '%'],
      ['retrabalho', T('Retrabajo'), 1, 30, 1, '%'],
      ['investimento', T('Inversión prevista'), 50, 3000, 50, ' ' + UNITS[1]]
    ];
    function show(k, un) { var v = st[k]; return (k === 'salario' || k === 'faturamento' || k === 'investimento' ? 'R$ ' : '') + v.toLocaleString(LOC) + un; }
    root.innerHTML =
      '<div class="lab-in"><h2 style="font-size:1.25rem">' + T('Supuestos de su empresa') + '</h2><div style="margin-top:1rem;border-top:1px solid var(--ink)">' +
        campos.map(function (c) {
          return '<div class="row"><div class="row-top"><label for="in-' + c[0] + '">' + c[1] + '</label><output id="val-' + c[0] + '" for="in-' + c[0] + '">' + show(c[0], c[5]) + '</output></div>' +
            '<input type="range" id="in-' + c[0] + '" data-k="' + c[0] + '" data-u="' + c[5] + '" min="' + c[2] + '" max="' + c[3] + '" step="' + c[4] + '" value="' + st[c[0]] + '"></div>';
        }).join('') +
      '</div><p class="small muted" style="margin-top:1rem">' + T('Supuestos fijos del modelo: reposición ≈ 60% del salario anual por salida; el 35% del valor del retrabajo se convierte en coste; reducciones relativas del 5%, 10% y 20% en los tres costes, según el escenario.') + '</p></div>' +
      '<div id="lab-out" aria-live="polite"></div>';
    Array.prototype.forEach.call(root.querySelectorAll('input[type="range"]'), function (inp) {
      inp.addEventListener('input', function () { st[inp.dataset.k] = Number(inp.value); $('val-' + inp.dataset.k).textContent = show(inp.dataset.k, inp.dataset.u); compute(); });
    });
    function compute() {
      var salAno = st.salario * 13.3;
      var custoTurn = st.empregados * (st.turnover / 100) * salAno * 0.6;
      var custoAbs = st.empregados * salAno * (st.absenteismo / 100);
      var custoRetr = st.faturamento * 1e6 * (st.retrabalho / 100) * 0.35;
      var cen = [{ nome: T('Conservador'), f: 0.05 }, { nome: T('Central'), f: 0.1 }, { nome: T('Optimista'), f: 0.2 }].map(function (c) {
        var eco = (custoTurn + custoAbs + custoRetr) * c.f;
        return { nome: c.nome, economia: eco, min: eco * 0.5, max: eco * 1.6, roi: eco / (st.investimento * 1e3) };
      });
      var maxEco = Math.max.apply(null, cen.map(function (c) { return c.max; }));
      var sens = [{ nome: T('Rotación'), v: custoTurn }, { nome: T('Retrabajo'), v: custoRetr }, { nome: T('Absentismo'), v: custoAbs }].sort(function (a, b) { return b.v - a.v; });
      $('lab-out').innerHTML =
        '<h2 style="font-size:1.25rem">' + T('Coste anual estimado actual') + '</h2>' +
        '<div class="kpis3" style="margin-top:1rem">' + [[T('Rotación'), custoTurn], [T('Absentismo'), custoAbs], [T('Retrabajo'), custoRetr]].map(function (r) {
          return '<div><p class="lbl" style="margin:0">' + r[0] + '</p><p class="val" style="margin:0">' + BRL(r[1]) + '</p></div>';
        }).join('') + '</div>' +
        '<h2 style="font-size:1.25rem;margin-top:2.5rem">' + T('Ahorro anual posible, por escenario (rangos = incertidumbre)') + '</h2><p class="small muted" style="margin-top:0.375rem">' + T('El cuadrado marca la estimación; la línea, el rango de incertidumbre.') + '</p>' +
        cen.map(function (c) {
          return '<div class="scen"><div class="scen-top"><b>' + c.nome + '</b><span class="r">' + T('De {min} a {max}; retorno de {roi}× la inversión', { min: BRL(c.min), max: BRL(c.max), roi: fmt(c.roi, 1) }) + '</span></div>' +
            '<div class="scen-bar"><span class="range" style="left:' + (c.min / maxEco * 100) + '%;width:' + ((c.max - c.min) / maxEco * 100) + '%"></span><span class="pt" style="left:' + (c.economia / maxEco * 100) + '%"></span></div></div>';
        }).join('') +
        '<div class="cols-2" style="margin-top:2.5rem">' +
          '<div><h3>' + T('Sensibilidad') + '</h3><p class="muted" style="margin-top:0.5rem">' + T('La variable que más mueve el resultado es <strong>{v}</strong>. Empiece por medirla bien antes de invertir.', { v: sens[0].nome.toLowerCase() }) + '</p></div>' +
          '<div><h3>' + T('Plazo y seguimiento') + '</h3><p class="muted" style="margin-top:0.5rem">' + T('Señales en 1–2 trimestres; efectos financieros en 3–6. Siga los indicadores adelantados (comunicación de errores, participación, pulso) además de los financieros.') + '</p></div>' +
        '</div>' +
        '<div class="panel" style="margin-top:2rem"><h3>' + T('Cómo probarlo de verdad') + '</h3><ul class="check-list yes" style="margin-top:0.75rem"><li>' + T('Piloto en algunos equipos, con la línea base registrada previamente.') + '</li><li>' + T('Grupo de comparación similar que no recibe la intervención.') + '</li><li>' + T('Series históricas para separar la tendencia del efecto.') + '</li><li>' + T('Diferencias en diferencias para estimar el efecto incremental.') + '</li></ul></div>' +
        '<p class="note" style="margin-top:1.5rem"><b>' + T('Estimaciones ilustrativas, no hechos.') + '</b> ' + T('Los multiplicadores son supuestos didácticos; su organización debe estimarlos con sus propios datos.') + '</p>';
    }
    compute();
  }

  /* ---------- Glossário ---------- */
  function initGlossario() {
    var root = $('gloss-root');
    if (!root) return;
    root.innerHTML = '<div class="field" style="max-width:28rem"><label for="gl-busca">' + T('Buscar término') + '</label><input type="search" id="gl-busca" placeholder="' + T('Buscar término…') + '"></div><p class="count" id="gl-count" aria-live="polite"></p><dl class="terms" id="gl-list" style="margin-top:1rem;border-top:1px solid var(--ink)"></dl>';
    var busca = '';
    function render() {
      var termos = D.GLOSSARIO.filter(function (g) { return !busca || (g.termo + ' ' + g.definicao).toLowerCase().indexOf(busca.toLowerCase()) >= 0; })
        .sort(function (a, b) { return a.termo.localeCompare(b.termo, LOC); });
      $('gl-count').textContent = T('{n} de {total} términos', { n: termos.length, total: D.GLOSSARIO.length });
      $('gl-list').innerHTML = termos.length ? termos.map(function (g) {
        return '<div><dt>' + esc(g.termo) + '</dt><dd>' + esc(g.definicao) + '<p class="ex" style="margin-bottom:0">' + esc(g.exemplo) + '</p></dd></div>';
      }).join('') : '<p class="empty">' + T('No se ha encontrado ningún término para "{q}". Pruebe con una palabra más corta.', { q: esc(busca) }) + '</p>';
    }
    $('gl-busca').addEventListener('input', function (e) { busca = e.target.value; render(); });
    render();
  }

  /* ---------- Casos ---------- */
  function initCasos() {
    var root = $('casos-root');
    if (!root) return;
    root.innerHTML = D.CASOS.map(function (c) {
      var rows = [[T('Problema'), c.problema], [T('Hipótesis'), c.hipotese], [T('Datos utilizados'), c.dados], [T('Método'), c.metodo], [T('Intervención'), c.intervencao], [T('Resultados comunicados'), c.resultados]];
      return '<article class="case" id="' + c.id + '"><div class="split">' +
        '<div><span class="tag">' + esc(c.tipo) + '</span><h2>' + esc(c.titulo) + '</h2><p class="case-meta">' + esc(c.organizacao) + ', ' + esc(String(c.ano)) + '</p>' +
          '<p class="muted" style="margin-top:1rem">' + esc(c.resumo) + '</p>' +
          '<p><a class="link" href="' + esc(c.fonte.url) + '" target="_blank" rel="noopener noreferrer">' + T('Fuente original') + '<span class="sr-only"> ' + T('(se abre en una pestaña nueva)') + '</span></a>' + (c.fonte.nome ? ' <span class="small muted">' + esc(c.fonte.nome) + '</span>' : '') + '</p></div>' +
        '<div><dl class="rows rows-2">' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
          '<div class="cols-2" style="margin-top:1.5rem"><div class="panel"><h3>' + T('Limitaciones') + '</h3><p class="muted" style="margin-top:0.5rem">' + esc(c.limitacoes) + '</p></div><div class="panel"><h3>' + T('Qué se puede aprender') + '</h3><p class="muted" style="margin-top:0.5rem">' + esc(c.aprendizado) + '</p></div></div>' +
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
